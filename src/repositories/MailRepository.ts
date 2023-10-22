import { MailEntity } from '@prisma/client';
import MailSentDTO from '../dtos/MailSentDTO';
import Mail from '../models/Mail'

interface  MailRepository{
    getMailsByDateAndId(id: number, date: Date ) : Promise<Mail[]>;
    getMailsByUserId(userId: number): Promise<Mail[]>;
    saveMail(mail: MailSentDTO, id: number): Promise<MailEntity>;
}

export default MailRepository;

