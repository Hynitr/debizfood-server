import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from 'src/jwt/jwt.module'
import { MiscService } from 'libs/misc.service'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtStrategy } from 'src/jwt/jwt.strategy'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'

@Module({
  imports: [JwtModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MiscService,
    PrismaService,
    ResponseService,
  ],
})
export class AuthModule { }
