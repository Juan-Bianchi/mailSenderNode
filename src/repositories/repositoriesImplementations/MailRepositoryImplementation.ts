import { MailEntity } from "@prisma/client";
import prisma from "../../../database/client";
import MailRepository from "../MailRepository";
import Mail from "../../models/Mail";
import MailSentDTO from "../../dtos/MailSentDTO";
import DatabaseError from "../../errors/DatabaseError";


class MailRepositoryImplementation implements MailRepository {

    async getMailsByDateAndId(id: number, date: Date ) : Promise<Mail[]> {
        // start
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);
        // end
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
        

        const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail.id));
        return mails;

    }

    async getMailsByUserId(userId: number): Promise<Mail[]> {
        const mailEntities: MailEntity[] = await prisma.mailEntity.findMany({
            where: {
                userId: userId
            }
        });
        const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail.id));
        return mails;
    }

    async saveMail(mail: MailSentDTO, userId: number): Promise<MailEntity> {
        try {
            const mailEntity: MailEntity = await prisma.mailEntity.create({
                data: {
                    subject: mail.subject,
                    message: mail.message,
                    recipients: mail.recipients,
                    date: mail.date,
                    userId: userId as number,
                },
            })
            return mailEntity;
        }
        catch(error) {
            throw new DatabaseError('Database error')
        }
    }

}

export default MailRepositoryImplementation;