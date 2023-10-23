import { Router, Request, Response } from 'express'
import {checkToken} from './AuthMiddleware'
import MailServiceImplementation from '../services/servicesImplementations/MailServiceImplementation';
import MailSentDTO from '../dtos/MailSentDTO';
import Jwtoken from '../utils/Jwtoken';
import { JwtPayload } from 'jsonwebtoken';
import PostVerbError from '../errors/PostVerbError';
import TokenValidationError from '../errors/TokenValidationError';
import GetVerbError from '../errors/GetVerbError';
import ConstraintError from '../errors/ConstraintError';

const mailRouter = Router();
const mailService = new MailServiceImplementation();
const jsonwebtoken = new Jwtoken();

mailRouter.post('/mails', checkToken, (req: Request, res: Response) => {
    try{
        const mail: MailSentDTO = mailService.buildDTO(req)
        const payload: JwtPayload = jsonwebtoken.getPayload(req);
        mailService.sendMail(mail ,payload);
        res.status(200).json(mail);
    }
    catch (error){
        if(error instanceof PostVerbError ||
           error instanceof TokenValidationError ||
           error instanceof GetVerbError ||
           error instanceof ConstraintError) {
                res.status(403).send(error.message);
           }
        else {
            res.status(403).send(error);
        }
    }
    
})

export default mailRouter;



