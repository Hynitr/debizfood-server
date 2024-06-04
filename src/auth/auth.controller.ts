import { Response } from 'express'
import { OTPDTO } from './dto/otp.dto'
import { AuthService } from './auth.service'
import { EmailDTO, SignupDTO } from './dto/auth.dto'
import { Body, Controller, Res } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  async signup(@Res() res: Response, @Body() body: SignupDTO) {
    await this.authService.signup(res, body)
  }

  async requestOTP(@Res() res: Response, @Body() body: EmailDTO) {
    await this.authService.requestOTP(res, body)
  }

  async verifyOtp(@Res() res: Response, @Body() body: OTPDTO) {
    await this.authService.verifyOtp(res, body)
  }
}
