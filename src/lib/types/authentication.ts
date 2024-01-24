interface IauthResponse {
    status: string
}

interface JwtPayload {
    userId: string
}

export { IauthResponse, JwtPayload }