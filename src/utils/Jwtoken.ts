import jwt, { JwtPayload } from 'jsonwebtoken'
import {Request} from 'express'

interface Jwtoken {
    createJwtToken(user: string, email: string, role: string): string;
    verifyJwtToken(token: string): JwtPayload;
    getPayload(req: Request): JwtPayload;
}

export default Jwtoken;