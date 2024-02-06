import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/authentication'

const generateToken = (user_id: number, randomInt: number) => {
    const token = jwt.sign({ userId: user_id, randomInt }, process.env['TOKEN_SECRET_KEY'] || "secret_key", {})
    return token
}

const validateToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env['TOKEN_SECRET_KEY'] || "secret_key") as JwtPayload;
        const { userId, randomInt } = decoded
        return { userId: parseInt(userId), randomInt }
    }
    catch (e) {
        throw new Error("Something went wrong")
    }
}

export { generateToken, validateToken }