import { Response } from 'express'
import { Injectable } from '@nestjs/common'
import { StatusCodes } from 'enums/statusCodes'
import { MiscService } from 'libs/misc.service'
import { FundWalletDTO } from './dto/deposit.dto'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { PaystackService } from 'libs/Paystack/paystack.service'

@Injectable()
export class WalletService {
    constructor(
        private readonly misc: MiscService,
        private readonly prisma: PrismaService,
        private readonly paystack: PaystackService,
        private readonly response: ResponseService,
    ) { }

    async fundWallet(
        res: Response,
        { sub }: ExpressUser,
        { ref }: FundWalletDTO,
    ) {
        try {
            const wallet = await this.prisma.wallet.findUnique({ where: { userId: sub } })

            if (!wallet) {
                return this.response.sendError(res, StatusCodes.NotFound, 'Wallet not found')
            }

            const verifyTx = await this.paystack.verifyTransaction(ref)
            if (!verifyTx.status || verifyTx.data?.status !== "success") {
                return this.response.sendError(res, StatusCodes.PaymentIsRequired, 'Payment is required')
            }

            const { data } = verifyTx
            const amount = data.amount / 100
            const channel = data?.authorization?.channel
            const authorization_code = data?.authorization?.authorization_code

            const [tx] = await this.prisma.$transaction([
                this.prisma.txHistory.create({
                    data: {
                        type: 'DEPOSIT',
                        channel, amount,
                        authorization_code,
                        status: data.status,
                        user: { connect: { id: sub } },
                    }
                }),
                this.prisma.wallet.update({
                    where: { userId: sub },
                    data: {
                        lastAmountDeposited: amount,
                        lastDepositedAt: new Date(),
                        balance: { increment: amount },
                    }
                }),
            ])

            this.response.sendSuccess(res, StatusCodes.OK, { data: tx })
        } catch (err) {
            this.misc.handlePaystackAndServerError(res, err)
        }
    }
}
