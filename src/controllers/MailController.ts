import { Router, Request, Response } from 'express'
import {checkToken} from './AuthMiddleware'
import MailSentDTO from '../dtos/MailSentDTO';
import Jwtoken from '../utils/ultisImplementations/JwtokenImpl';
import { JwtPayload } from 'jsonwebtoken';
import PostVerbError from '../errors/PostVerbError';
import GetVerbError from '../errors/GetVerbError';
import DatabaseError from '../errors/DatabaseError';
import Mail from '../models/Mail';
import { mailService } from '../utils/ServiceCreator';

const mailRouter = Router();

const jsonwebtoken = new Jwtoken();

mailRouter.post('/mails', checkToken, async(req: Request, res: Response) => {
    try{
        const {
            sender,
            subject,
            message,
            recipients,
            date,
        } = req.body;
        const mail: Mail = new Mail(subject, message, recipients, date);
        const mailDto = new MailSentDTO(mail);
        mailDto.sender = sender;
        const payload: JwtPayload = jsonwebtoken.getPayload(req);
        await mailService.sendMail(mailDto, payload.email);
        res.status(200).json(mailDto);
    }
    catch (error){
        if(error instanceof PostVerbError ||
           error instanceof GetVerbError ||
           error instanceof DatabaseError) {
                res.status(403).send(error.message);
        }
        else {
            res.status(403).send('Forbidden');
        }
    }
    
})

export default mailRouter;



