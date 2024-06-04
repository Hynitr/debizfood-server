import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class OTPDTO {
    @ApiProperty({
        example: '1234'
    })
    @IsString()
    @MinLength(4)
    @MaxLength(4)
    otp: string
}