import { Response, Request, NextFunction, Router } from "express";
import JwtokenImpl from "../utils/ultisImplementations/JwtokenImpl";
import { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { Role } from "@prisma/client";
import TokenValidationError from "../errors/TokenValidationError";

const jsonwebtoken = new JwtokenImpl();

const checkToken = (req: Request, res: Response, next: NextFunction)=> {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            return res.status(403).send('Token is not correct');
        const payload: JwtPayload = jsonwebtoken.verifyJwtToken(token);
        const roleIsValid = Object.values(Role).includes(payload.role);
        if(!roleIsValid)
            return res.status(403).send('Role is not valid');
                   
        next();
    }
    catch (error) {
        if(error instanceof TokenValidationError || error instanceof TokenExpiredError ||
           error instanceof NotBeforeError || error instanceof JsonWebTokenError)
            res.status(403).send(error.message);
        else {
            res.status(403).send('Forbidden');
        }
    }
}

const verifyAdminRole = (req: Request, res: Response, next: NextFunction)=> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1] as string;
    const payload: JwtPayload = jsonwebtoken.verifyJwtToken(token as string);
    const roleIsAdmin = payload.role == Role.ADMIN;
    if(!roleIsAdmin)
        return res.status(403).send('Role is not admin, you are not allowed to access this data.');
    next();   
}

export {checkToken, verifyAdminRole}