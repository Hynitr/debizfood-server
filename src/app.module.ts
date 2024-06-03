import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MiscService } from 'libs/misc.service'
import { AppController } from './app.controller'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { EncryptionService } from 'libs/encryption.service'
import cloudinaryConfig from './cloudinary/cloudinary.config'
import { PaystackService } from 'libs/Paystack/paystack.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cloudinaryConfig],
    }),
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
