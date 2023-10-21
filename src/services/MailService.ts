import { JwtPayload } from 'jsonwebtoken';
import MailSentDTO from '../dtos/MailSentDTO';
import { Request } from 'express';

interface MailService {
    getMailById(id: number): Promise<MailSentDTO | null>;
    getMailsByDateAndId(id: number, date: Date ) : Promise<MailSentDTO[]>;
    getMailsByUserId(userId: number): Promise<MailSentDTO[]>;
    sendMail(mail: MailSentDTO, payload: JwtPayload): Promise<boolean>;
    buildDTO(req: Request): MailSentDTO;
}

export default MailService;