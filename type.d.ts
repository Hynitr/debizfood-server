type Method = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'

interface IGenOTP {
    totp: string
    totp_expiry: Date
}

interface CloudinaryModuleOptions {
    cloudName: string
    apiKey: string
    apiSecret: string
}

interface FileDest {
    folder: string
    resource_type: 'image' | 'video'
}

interface Attachment {
    public_id: string
    public_url: string
    secure_url: string
}

type Status = 'ACTIVE' | 'SUSPENDED'
type Roles = 'USER' | 'ADMIN'

interface ExpressUser extends Express.User {
    sub: string
    role: Roles
    status: Status
    modelName: string
}

interface IRequest extends Request {
    user: ExpressUser
}

interface JwtPayload {
    sub: string
    role: Roles
    status: Status
    modelName: string
}