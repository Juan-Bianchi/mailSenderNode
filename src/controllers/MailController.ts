import { Router, Request, Response } from 'express'
import {checkToken} from './AuthMiddleware'
import MailServiceImplementation from '../services/servicesImplementations/MailServiceImplementation';
import MailSentDTO from '../dtos/MailSentDTO';
import Jwtoken from '../utils/ultisImplementations/JwtokenImpl';
import { JwtPayload } from 'jsonwebtoken';
import PostVerbError from '../errors/PostVerbError';
import TokenValidationError from '../errors/TokenValidationError';
import GetVerbError from '../errors/GetVerbError';
import MailServiceMock from '../../tests/Mocks/MailServiceMock';
import MailService from '../services/MailService';
import DatabaseError from '../errors/DatabaseError';
import MailRepositoryImplementation from '../repositories/repositoriesImplementations/MailRepositoryImplementation';
import UserRepositoryImplementation from '../repositories/repositoriesImplementations/UserRepositoryImplementation';
import Sendgrid from '../mailProviders/classes/Sendgrid';
import Mailjet from '../mailProviders/classes/Mailjet';
import Mail from '../models/Mail';

const mailRouter = Router();
const mailRep = new MailRepositoryImplementation();
const userRep = new UserRepositoryImplementation();
const mailjet = new Mailjet();
const sendgrid = new Sendgrid()
const mailService: MailService = new MailServiceImplementation(mailRep, userRep, mailjet, sendgrid);
const jsonwebtoken = new Jwtoken();

mailRouter.post('/mails', checkToken, (req: Request, res: Response) => {
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
        mailService.sendMail(mailDto, payload.email);
        res.status(200).json(mailDto);
    }
    catch (error){
        if(error instanceof PostVerbError ||
           error instanceof TokenValidationError ||
           error instanceof GetVerbError ||
           error instanceof DatabaseError) {
                res.status(403).send(error.message);
           }
        else {
            res.status(403).send(error);
        }
    }
    
})

export default mailRouter;



