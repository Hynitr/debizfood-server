import { PrismaClient } from '@prisma/client'
import { generateOTP } from 'helpers/generator'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }

    async manageOTP(userId: string) {
        const { totp, totp_expiry } = generateOTP(4)

        await this.totp.upsert({
            where: { userId },
            create: {
                otp: totp, otp_expiry: totp_expiry,
                user: { connect: { id: userId } }
            },
            update: { otp: totp, otp_expiry: totp_expiry }
        })

        return totp
    }
}