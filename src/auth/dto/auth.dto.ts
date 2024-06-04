import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { titleText, toLowerCase } from 'helpers/transformer'
import {
    IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString
} from 'class-validator'

export class EmailDTO {
    @ApiProperty({
        example: 'kawojue08@gmail.com'
    })
    @IsEmail()
    @Transform(({ value }) => toLowerCase(value))
    email: string
}

export class SignupDTO extends EmailDTO {
    @ApiProperty({
        example: '08131911964'
    })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({
        example: 'Raheem'
    })
    @IsString()
    @Transform(({ value }) => titleText(value))
    firstname: string

    @ApiProperty({
        example: 'Kawojue'
    })
    @IsString()
    @Transform(({ value }) => titleText(value))
    lastname: string

    @ApiProperty({
        example: new Date()
    })
    @IsDateString()
    dob: string

    @ApiProperty({
        example: 'a5462bs'
    })
    @IsString()
    @IsOptional()
    refCode?: string
}

