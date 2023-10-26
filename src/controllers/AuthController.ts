import {Router, Request, Response} from 'express'
import RegisterDTO from '../dtos/RegisterDTO';
import LoginDTO from '../dtos/LoginDTO';
import LoginError from '../errors/LoginError';
import PasswordValidationError from '../errors/PasswordValidationError';
import TokenValidationError from '../errors/TokenValidationError';
import RegisterError from '../errors/RegisterError';
import DatabaseError from '../errors/DatabaseError';
import {authService} from '../utils/ServiceCreator'

const authRouter = Router()


authRouter.post('/register', async (req: Request, res: Response) => {
     try{
        const {
            userName,
            password,
            email
        } = req.body;
        const user: RegisterDTO = new RegisterDTO(userName, email, password);
        await authService.register(user);
        res.status(201).json(user);
    }
    catch(error) {
        if(error instanceof RegisterError || error instanceof DatabaseError)
            res.status(403).send(error.message);
        else {
            res.status(403).send('Forbidden');
        }
    }
})


authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const {
            userName,
            password,
            email
        } = req.body;
        const user: LoginDTO = new LoginDTO(userName, email, password);
        res.status(200).json((await authService.login(user)));
    }
    catch (error) {
        if(error instanceof LoginError || 
            error instanceof PasswordValidationError ||
            error instanceof TokenValidationError) {
                res.status(403).send(error.message);
        }
        else {
            res.status(403).send('Forbidden');
        }
    }
})

export default authRouter;