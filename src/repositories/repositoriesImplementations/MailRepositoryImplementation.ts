import { MailEntity } from "@prisma/client";
import prisma from "../../../database/client";
import MailRepository from "../MailRepository";
import Mail from "../../models/Mail";
import MailSentDTO from "../../dtos/MailSentDTO";


class MailRepositoryImplementation implements MailRepository {

    public async getMailsByDateAndId(id: number, date: Date ) : Promise<Mail[]> {
        try {
            // inicio
            const formattedDate = new Date(date);
            formattedDate.setHours(0, 0, 0, 0);
            // fin
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            
            const mailEntities: MailEntity[] = await prisma.mailEntity.findMany({
                where: {
                    date: {
                        gte: formattedDate,
                        lt: nextDay
                    },
                    userId: id
                }
            });
    
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail?.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
    }

    public async getMailsByUserId(userId: number): Promise<Mail[]> {
        try {
            const mailEntities: MailEntity[] = await prisma.mailEntity.findMany({
                where: {
                    userId: userId
                }
            });
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail?.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
    }

    public async saveMail(mail: MailSentDTO, id: number): Promise<MailEntity> {
        try {
            const mailEntity: MailEntity = await prisma.mailEntity.create({
                data: {
                    subject: mail.getSubject(),
                    message: mail.getMessage(),
                    recipients: mail.getRecipients(),
                    userId: id as number,
                },
            })
            return mailEntity;
        }
        catch(error) {
            throw error;
        }
    }

}

export default MailRepositoryImplementation;