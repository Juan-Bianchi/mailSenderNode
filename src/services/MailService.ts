import { JwtPayload } from 'jsonwebtoken';
import MailSentDTO from '../dtos/MailSentDTO';
import { Request } from 'express';

interface MailService {
    getMailsByDateAndId(id: number, date: Date ) : Promise<MailSentDTO[]>;
    getMailsByUserId(userId: number): Promise<MailSentDTO[]>;
    sendMail(mail: MailSentDTO, email: string): Promise<boolean>;
}

export default MailService;