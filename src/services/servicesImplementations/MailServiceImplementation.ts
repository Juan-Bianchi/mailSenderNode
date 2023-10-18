import MailSentDTO from "../../dtos/MailSentDTO";
import Mail from "../../models/Mail";
import MailRepository from "../../repositories/MailRepository";
import MailService from "../MailService";

class MailServiceImplementation implements MailService{

    private mailRepository: MailRepository;

    public constructor (mailRepository: MailRepository) {
        this.mailRepository = mailRepository;
    }

    public async getMailById(id: number): Promise<MailSentDTO | null> {
        const mail: Mail | null = await this.mailRepository.getMailById(id);
        if(!mail)
            return mail;

        const mailSentDTO: MailSentDTO = new MailSentDTO(mail);
        return mailSentDTO
    }

    public async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRepository.getMailsByDateAndId(id, date);
        return mails.map(mail => new MailSentDTO(mail))
    }

    public async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await this.mailRepository.getMailsByUserId(userId);
        return mails.map(mail => new MailSentDTO(mail))
    }

    public async sendMail

}

export default MailService;