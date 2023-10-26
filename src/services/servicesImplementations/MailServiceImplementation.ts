import MailSentDTO from "../../dtos/MailSentDTO";
import GetVerbError from "../../errors/GetVerbError";
import Mail from "../../models/Mail";
import MailService from "../MailService";
import User from "../../models/User";
import SendingPovider from "../../mailProviders/classes/SendingProvider";
import PostVerbError from "../../errors/PostVerbError";
import Strategy from "../../mailProviders/interface/Strategy";
import prisma from "../../../database/client";
import MailRepository from "../../repositories/MailRepository";
import UserRepository from "../../repositories/UserRepository";


class MailServiceImplementation implements MailService{

    mailRep: MailRepository;
    userRep: UserRepository;
    mailjet: Strategy;
    sendgrid: Strategy;

    constructor(mailRep: MailRepository, userRep: UserRepository, mailjet: Strategy, sendgrid: Strategy) {
        this.mailRep = mailRep;
        this.userRep = userRep;
        this.mailjet = mailjet;
        this.sendgrid = sendgrid;
    }

    async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRep.getMailsByDateAndId(id, date);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRep.getMailsByUserId(userId);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    async sendMail(mail: MailSentDTO, email: string): Promise<boolean> {
        const transactionResult: boolean = await prisma.$transaction(async () => {
            const user: User | null = await this.userRep.getUserByEmail(email);
            if(user === null || user.id === null ) {
                throw new GetVerbError('Not user found with this id.');
            }
            const mailsAmount: number = (await this.mailRep.getMailsByDateAndId(user.id as number, new Date())).length
            if(mailsAmount >= 1000) {
                throw new PostVerbError('Mail could not be sent. You have exceeded the maximum amount of sent emails for today.');
            }
            const newMail = new Mail(mail.subject, mail.message, mail.recipients, mail.date);
            newMail.sender = user;
            let strategy: Strategy = this.mailjet;
            const mailSender: SendingPovider = new SendingPovider(strategy);
            let mailSentOk: boolean = await mailSender.sendMail(newMail);
            if(!mailSentOk){
                mailSender.strategy = this.sendgrid;
                mailSentOk = await mailSender.sendMail(newMail);
            }
            if(!mailSentOk) {
                throw new PostVerbError('Mail could not be sent. Please try again later');
            }

            await this.mailRep.saveMail(mail, user.id as number);
            user.mails = await this.mailRep.getMailsByUserId(user.id as number);
            await this.userRep.updateUser(user);
            return true;
        })
        return transactionResult;
    }
}

export default MailServiceImplementation;