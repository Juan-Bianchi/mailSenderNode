import MailSentDTO from "../../dtos/MailSentDTO";
import Mail from "../../models/Mail";
import MailRepositoryImplementation from "../../repositories/repositoriesImplementations/MailRepositoryImplementation";
import MailService from "../MailService";

class MailServiceImplementation implements MailService{

    private mailRepositoryImpl: MailRepositoryImplementation;

    public constructor (mailRepositoryImpl: MailRepositoryImplementation) {
        this.mailRepositoryImpl = mailRepositoryImpl;
    }

    public async getMailById(id: number): Promise<MailSentDTO | null> {
        const mail: Mail | null = await this.mailRepositoryImpl.getMailById(id);
        if(!mail)
            return mail;

        const mailSentDTO: MailSentDTO = new MailSentDTO(mail);
        return mailSentDTO
    }

    public async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRepositoryImpl.getMailsByDateAndId(id, date);
        return mails.map(mail => new MailSentDTO(mail))
    }

    public async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRepositoryImpl.getMailsByUserId(userId);
        return mails.map(mail => new MailSentDTO(mail))
    }
}

export default MailService;