import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/authentication'

const generateToken = (user_id: number) => {
    const token = jwt.sign({ userId: user_id }, process.env['TOKEN_SECRET_KEY'] || "secret_key", {
        expiresIn: '1h'
    });
    return token;
}

const validateToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env['TOKEN_SECRET_KEY'] || "secret_key") as JwtPayload;
        return parseInt(decoded.userId);
    }
    catch (e) {
        throw new Error("Something went wrong")
    }
}

export { generateToken, validateToken }