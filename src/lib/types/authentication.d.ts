interface IauthResponse {
    status: string
}

declare namespace Express {
    export interface Request {
        userId?: string
    }
}

interface JwtPayload {
    userId: string,
    randomInt: number
}

export { IauthResponse, JwtPayload }