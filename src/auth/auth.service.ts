import { Response } from 'express'
import { OTPDTO } from './dto/otp.dto'
import { Injectable } from '@nestjs/common'
import { MiscService } from 'libs/misc.service'
import { StatusCodes } from 'enums/statusCodes'
import { genReferralKey } from 'helpers/generator'
import { EmailDTO, SignupDTO } from './dto/auth.dto'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly misc: MiscService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
    ) { }

    async signup(
        res: Response,
        {
            dob, email, firstname,
            lastname, phone, refCode,
        }: SignupDTO
    ) {
        try {
            const findUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: { equals: phone, mode: 'insensitive' } },
                        { email: { equals: email, mode: 'insensitive' } }
                    ]
                }
            })

            if (findUser) {
                return this.response.sendError(res, StatusCodes.Conflict, "Email or phone number already exist")
            }

            const user = await this.prisma.user.create({
                data: {
                    email, dob: new Date(dob),
                    firstname, lastname, phone,
                }
            })

            if (user) {
                const genRefKey = genReferralKey(user.id)
                await this.prisma.$transaction([
                    this.prisma.wallet.create({
                        data: {
                            user: { connect: { id: user.id } }
                        }
                    }),
                    this.prisma.referral.create({
                        data: {
                            key: genRefKey,
                            user: { connect: { id: user.id } }
                        }
                    })
                ])
            }

            if (refCode) {
                const referral = await this.prisma.referral.findUnique({
                    where: { key: refCode }
                })

                if (!referral) {
                    return this.response.sendError(res, StatusCodes.BadRequest, "Invalid referral code")
                }

                await this.prisma.$transaction([
                    this.prisma.referral.update({
                        where: { key: refCode },
                        data: { points: { increment: 5 } }
                    }),
                    this.prisma.referred.create({
                        data: {
                            user: { connect: { id: user.id } },
                            referral: { connect: { id: referral.id } }
                        }
                    }),
                ])
            }

            res.on('finish', async () => {
                const otp = await this.prisma.manageOTP(user.id)
                // TODO: send OTP
            })

            this.response.sendSuccess(res, StatusCodes.OK, {
                message: "Account created successfully"
            })
        } catch (err) {
            this.misc.handleServerError(res, err)
        }
    }

    async requestOTP(res: Response, { email }: EmailDTO) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            })

            if (!user) {
                return this.response.sendError(res, StatusCodes.NotFound, "There is no account associated with this email")
            }

            res.on('finish', async () => {
                // TODO: send otp

                const otp = await this.prisma.manageOTP(user.id)
            })

            this.response.sendSuccess(res, StatusCodes.OK, {
                messsage: "A verification OTP has been sent to your email"
            })
        } catch (err) {
            this.misc.handleServerError(res, err)
        }
    }

    async verifyOtp(res: Response, { otp }: OTPDTO) {
        try {
            const totp = await this.prisma.totp.findUnique({
                where: { otp },
                include: {
                    user: true,
                }
            })

            if (!totp) {
                return this.response.sendError(res, StatusCodes.Unauthorized, "Invalid OTP")
            }

            if (new Date() > totp.otp_expiry) {
                this.response.sendError(res, StatusCodes.Forbidden, "OTP has expired")
                await this.prisma.totp.deleteMany({
                    where: { userId: totp.otp }
                })

                return
            }

            const access_token = await this.misc.generateNewAccessToken({
                sub: totp.userId,
                modelName: 'user',
                role: totp.user.role,
                status: totp.user.status,
            })

            this.response.sendSuccess(res, StatusCodes.OK, {
                access_token,
                data: {
                    email: totp.user.email,
                    lastname: totp.user.lastname,
                    firstname: totp.user.firstname,
                }
            })
        } catch (err) {
            this.misc.handleServerError(res, err)
        }
    }
}
