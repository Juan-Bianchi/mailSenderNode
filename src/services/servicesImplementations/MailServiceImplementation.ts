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

    public async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByDateAndId(id, date);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    public async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByUserId(userId);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    public async sendMail(mail: MailSentDTO, payload: JwtPayload): Promise<boolean> {
        const transactionResult: boolean = await prisma.$transaction(async () => {
            const user: User | null = await userRep.getUserByEmail(payload.email);
            if(user === null || user.getId() === null ) {
                throw new GetVerbError('Not user found with this id.');
            }

            const newMail = new Mail(mail.getSubject(), mail.getMessage(), mail.getRecipients(), mail.getDate());
            newMail.setSender(user);
            let strategy: Strategy = new Mailjet();
            const mailSender: SendingPovider = new SendingPovider(strategy);
            let mailSentOk: boolean = await mailSender.sendMail(newMail);
            if(!mailSentOk){
                mailSender.setStrategy(new Sendgrid());
                mailSentOk = await mailSender.sendMail(newMail);
            }
            if(!mailSentOk) {
                throw new PostVerbError('Mail could not be sent. Please try again later');
            }

            await mailRep.saveMail(mail, user.getId() as number);
            user.setMails(await mailRep.getMailsByUserId(user.getId() as number));
            user.setSentMails(user.getSentMails() + 1)
            await userRep.updateUser(user);

            return true;
        })
        return transactionResult;
    }

    public buildDTO(req: Request): MailSentDTO {
        const{
            sender,
            subject,
            message,
            recipients,
            date
        } = req.body;
        
        const mail: Mail = new Mail(subject, message, recipients, date);
        const mailDto = new MailSentDTO(mail);
        mailDto.setSender(sender);
        return mailDto; 
    }
}

export default MailServiceImplementation;