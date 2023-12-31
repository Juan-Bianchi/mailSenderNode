import jwt, { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import {Request} from 'express'
import TokenValidationError from '../../errors/TokenValidationError';
import Jwtoken from '../Jwtoken';

class JwtokenImpl implements Jwtoken{
    
    createJwtToken(user: string, email: string, role: string): string {
        if(!process.env.JWT_SECRET){
            throw new Error('Not Jwt secret assigned in the system')
        }
        const token: string = jwt.sign({user, email, role} , process.env.JWT_SECRET , { expiresIn: '1h' });
        return token;
    }

    verifyJwtToken(token: string): JwtPayload {
        if(!process.env.JWT_SECRET){
            throw new Error('Not Jwt secret assigned in the system')
        }
        return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    }

    getPayload(req: Request): JwtPayload {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            if(!token)
                throw new TokenValidationError('Token not correct.');
            return this.verifyJwtToken(token);
        }
        catch(error) {
            if(error instanceof TokenExpiredError || error instanceof JsonWebTokenError || error instanceof NotBeforeError)
                throw new TokenValidationError(error.message);
            throw new TokenValidationError('Token not correct.');
        }
    }

}

export default JwtokenImpl;