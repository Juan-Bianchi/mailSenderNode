import { JwtPayload } from "jsonwebtoken";
import MailSentDTO from "../../dtos/MailSentDTO";
import GetVerbError from "../../errors/GetVerbError";
import Mail from "../../models/Mail";
import MailRepositoryImplementation from "../../repositories/repositoriesImplementations/MailRepositoryImplementation";
import MailService from "../MailService";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";
import User from "../../models/User";
import Mailjet from "../../mailProviders/classes/Mailjet";
import SendingPovider from "../../mailProviders/classes/SendingProvider";
import PostVerbError from "../../errors/PostVerbError";
import Strategy from "../../mailProviders/interface/Strategy";
import Sendgrid from "../../mailProviders/classes/Sendgrid";
import prisma from "../../../database/client";
import { Request } from "express";

const mailRep = new MailRepositoryImplementation();
const userRep = new UserRepositoryImplementation();

class MailServiceImplementation implements MailService{

    async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByDateAndId(id, date);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByUserId(userId);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    async sendMail(mail: MailSentDTO, payload: JwtPayload): Promise<boolean> {
        const transactionResult: boolean = await prisma.$transaction(async () => {
            const user: User | null = await userRep.getUserByEmail(payload.email);
            if(user === null || user.id === null ) {
                throw new GetVerbError('Not user found with this id.');
            }
            const mailsAmount: number = (await mailRep.getMailsByDateAndId(user.id as number, new Date())).length
            if(mailsAmount >= 1000) {
                throw new PostVerbError('Mail could not be sent. You have exceeded the maximum amount of sent emails for today.');
            }
            const newMail = new Mail(mail.subject, mail.message, mail.recipients, mail.date);
            newMail.sender = user;
            let strategy: Strategy = new Mailjet();
            const mailSender: SendingPovider = new SendingPovider(strategy);
            let mailSentOk: boolean = await mailSender.sendMail(newMail);
            if(!mailSentOk){
                mailSender.strategy = new Sendgrid();
                mailSentOk = await mailSender.sendMail(newMail);
            }
            if(!mailSentOk) {
                throw new PostVerbError('Mail could not be sent. Please try again later');
            }

            await mailRep.saveMail(mail, user.id as number);
            user.mails = await mailRep.getMailsByUserId(user.id as number);
            await userRep.updateUser(user);
            return true;
        })
        return transactionResult;
    }

    buildDTO(req: Request): MailSentDTO {
        const{
            sender,
            subject,
            message,
            recipients,
            date
        } = req.body;
        
        const mail: Mail = new Mail(subject, message, recipients, date);
        const mailDto = new MailSentDTO(mail);
        mailDto.sender = sender;
        return mailDto; 
    }
}

export default MailServiceImplementation;