import {Router, Request, Response} from 'express'
import {checkToken, verifyAdminRole} from './AuthMiddleware'
import UserServiceImplementations from '../services/servicesImplementations/UserServiceImplementations';
import GetVerbError from '../errors/GetVerbError';
import UserService from '../services/UserService';
import UserRepositoryImplementation from '../repositories/repositoriesImplementations/UserRepositoryImplementation';

const userRep: UserRepositoryImplementation = new UserRepositoryImplementation()
const userService: UserService = new UserServiceImplementations(userRep);

const userRouter = Router();

userRouter.get('/users', checkToken, verifyAdminRole, async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await userService.getAllUsers());
    }
    catch (error) {
        if(error instanceof GetVerbError)
            return res.status(403).send(error.message);
        else
            return res.status(403).send(error);
    }
})


export default userRouter







