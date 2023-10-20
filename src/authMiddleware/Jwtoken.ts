import jwt, { JwtPayload } from 'jsonwebtoken'

class Jwtoken {
    
    public createJwtToken(user: string, email: string, authority: string): string {
        if(!process.env.JWT_SECRET){
            throw new Error('Not Jwt secret assigned in the system')
        }
        const token: string = jwt.sign({user, email, authority} , process.env.JWT_SECRET , { expiresIn: '1h' });
        return token;
    }

    public verifyJwtToken(token: string): string |JwtPayload {
        let isVerified: boolean;
        if(!process.env.JWT_SECRET){
            throw new Error('Not Jwt secret assigned in the system')
        }
        return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    }
}

export default Jwtoken;