import { Module } from '@nestjs/common'
import { JwtModule } from 'src/jwt/jwt.module'
import { MiscService } from 'libs/misc.service'
import { WalletService } from './wallet.service'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'prisma/prisma.service'
import { WalletController } from './wallet.controller'
import { ResponseService } from 'libs/response.service'
import { PaystackService } from 'libs/Paystack/paystack.service'

@Module({
  imports: [JwtModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [WalletController],
  providers: [
    WalletService,
    MiscService,
    PrismaService,
    ResponseService,
    PaystackService,
  ],
})
export class WalletModule { }
