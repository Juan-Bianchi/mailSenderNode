import { MailEntity } from "@prisma/client";
import {prisma} from "../../index"
import MailRepository from "../MailRepository";
import Mail from "../../models/Mail";


class MailRepositoryImplementation implements MailRepository {

    public async getMailById(id: number): Promise<Mail | null> {
        try {
            const mailEntity: MailEntity | null = await prisma.mailEntity.findUnique({
                where: {
                    id: id
                }
            })
    
            if(!mailEntity)
                return mailEntity;
    
            const mail: Mail = new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity?.id);
            return mail;
        }
        catch(e) {
            throw e;
        }
        finally {
            await prisma.$disconnect;
        }
    }

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
    
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail?.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
        finally {
            await prisma.$disconnect;
        }
    }

    public async getMailsByUserId(userId: number): Promise<Mail[]> {
        try {
            const mailEntities: MailEntity[] = await prisma.mailEntity.findMany({
                where: {
                    userId: userId
                }
            });
            const mails: Mail[] = mailEntities.map(mail => new Mail(mail.subject, mail.message, mail.recipients, mail?.id));
            return mails;
        }
        catch(e) {
            throw e;
        }
    }

}

export default MailRepositoryImplementation;