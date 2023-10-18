import MailSentDTO from '../dtos/MailSentDTO';

interface MailService {
    getMailById(id: number): Promise<MailSentDTO | null>;
    getMailsByDateAndId(id: number, date: Date ) : Promise<MailSentDTO[]>;
    getMailsByUserId(userId: number): Promise<MailSentDTO[]>;
}

export default MailService;