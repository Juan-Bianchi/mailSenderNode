import {Router, Request, Response} from 'express'
import {checkToken, verifyAdminRole} from './AuthMiddleware'
import GetVerbError from '../errors/GetVerbError';
import { userService } from '../utils/Dependencies';



const userRouter = Router();

userRouter.get('/users', checkToken, verifyAdminRole, async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await userService.getAllUsers());
    }
    catch (error) {
        if(error instanceof GetVerbError)
            return res.status(403).send(error.message);
        else {
            res.status(403).send('Forbidden');
        }
    }
})


export default userRouter







