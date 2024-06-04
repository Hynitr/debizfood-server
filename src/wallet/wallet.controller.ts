import { Response } from 'express'
import { Role } from '@prisma/client'
import { Roles } from 'src/role.decorator'
import { AuthGuard } from '@nestjs/passport'
import { WalletService } from './wallet.service'
import { FundWalletDTO } from './dto/deposit.dto'
import { RolesGuard } from 'src/jwt/jwt-auth.guard'
import { Body, Controller, Req, Res, UseGuards } from '@nestjs/common'

@Controller('wallet')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Roles(Role.USER)
  async fundWallet(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: FundWalletDTO
  ) {
    await this.walletService.fundWallet(res, req.user, body)
  }
}
