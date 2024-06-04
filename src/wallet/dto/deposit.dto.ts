import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class FundWalletDTO {
    @ApiProperty({
        example: 'deposit-dkjvdjbvdjb'
    })
    @IsString()
    @IsNotEmpty()
    ref: string
}