import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { titleText, toLowerCase } from 'helpers/transformer'
import {
    IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString
} from 'class-validator'

export class EmailDTO {
    @ApiProperty({
        example: 'kawojue08@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => toLowerCase(value))
    email: string
}

export class SignupDTO extends EmailDTO {
    @ApiProperty({
        example: '08131911964'
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string

    @ApiProperty({
        example: 'Raheem'
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => titleText(value))
    firstname: string

    @ApiProperty({
        example: 'Kawojue'
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => titleText(value))
    lastname: string

    @ApiProperty({
        example: new Date()
    })
    @IsNotEmpty()
    dob: string

    @ApiProperty({
        example: 'a5462bs'
    })
    @IsString()
    @IsOptional()
    refCode?: string
}

