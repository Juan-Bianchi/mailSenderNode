import { MailEntity } from "@prisma/client";
import prisma from "../../../database/client";
import MailRepository from "../MailRepository";
import Mail from "../../models/Mail";
import MailSentDTO from "../../dtos/MailSentDTO";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ConstraintError from "../../errors/ConstraintError";


class MailRepositoryImplementation implements MailRepository {

    async getMailsByDateAndId(id: number, date: Date ) : Promise<Mail[]> {
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
            
    
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
    }

    async getMailsByUserId(userId: number): Promise<Mail[]> {
        try {
            const mailEntities: MailEntity[] = await prisma.mailEntity.findMany({
                where: {
                    userId: userId
                }
            });
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail.date, mail.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
    }

    async saveMail(mail: MailSentDTO, userId: number): Promise<MailEntity> {
        try {
            const mailEntity: MailEntity = await prisma.mailEntity.create({
                data: {
                    subject: mail.subject,
                    message: mail.message,
                    recipients: mail.recipients,
                    userId: userId as number,
                },
            })
            return mailEntity;
        }
        catch(error) {
            if(error instanceof PrismaClientKnownRequestError){
                throw new ConstraintError('There is a unique constraint that is being violated.')
            }
            throw error;
        }
    }

}

export default MailRepositoryImplementation;