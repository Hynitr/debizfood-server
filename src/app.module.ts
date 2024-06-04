import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MiscService } from 'libs/misc.service'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { WalletModule } from './wallet/wallet.module'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { EncryptionService } from 'libs/encryption.service'
import cloudinaryConfig from './cloudinary/cloudinary.config'
import { PaystackService } from 'libs/Paystack/paystack.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cloudinaryConfig],
    }),
    AuthModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    MiscService,
    PrismaService,
    ResponseService,
    PaystackService,
    EncryptionService,
  ],
})
export class AppModule { }
