import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { StatusCodes } from 'enums/statusCodes'
import { ResponseService } from './response.service'

@Injectable()
export class MiscService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly response: ResponseService,
    ) { }

    async generateNewAccessToken({ sub, role, status, modelName }: JwtPayload) {
        return await this.jwtService.signAsync({ sub, role, status, modelName })
    }

    handleServerError(res: Response, err?: any, msg?: string) {
        console.error(err)
        return this.response.sendError(res, StatusCodes.InternalServerError, msg || err?.message || 'Something went wrong')
    }

    handlePaystackAndServerError(res: Response, err: any) {
        if (err.response?.message) {
            console.error(err)
            this.response.sendError(res, err.status, err.response.message)
        } else {
            this.handleServerError(res, err)
        }
    }

    async validateAndDecodeToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: process.env.HANDLE_ENCRYPTION_KEY
            })
        } catch (err) {
            console.error(err)
            return null
        }
    }
}