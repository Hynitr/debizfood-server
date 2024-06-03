import { Reflector } from '@nestjs/core'
import { MiscService } from 'libs/misc.service'
import { PrismaService } from 'prisma/prisma.service'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
        private readonly misc: MiscService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!roles) return true

        const ctx = context.switchToHttp()
        const request = ctx.getRequest()

        const token = request.headers.authorization?.split('Bearer ')[1]
        if (!token) return false

        try {
            const decoded = await this.misc.validateAndDecodeToken(token)
            if (decoded?.sub && decoded.role === 'user') {
                return this.prisma['modelName'].findUnique({
                    where: { id: decoded.sub }
                }).then(user => {
                    if ((decoded.status !== user.status) || (decoded.status === 'SUSPENDED')) return false
                    request.user = decoded
                    return roles.includes(decoded.role)
                }).catch(_ => {
                    return false
                })
            }
            request.user = decoded
            return roles.includes(decoded.role)
        } catch (error) {
            return false
        }
    }
}