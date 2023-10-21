import MailSentDTO from "../../dtos/MailSentDTO";
import Mail from "../../models/Mail";
import MailRepositoryImplementation from "../../repositories/repositoriesImplementations/MailRepositoryImplementation";
import MailService from "../MailService";

const mailRep = new MailRepositoryImplementation();

class MailServiceImplementation implements MailService{

    public async getMailById(id: number): Promise<MailSentDTO | null> {
        const mail: Mail | null = await mailRep.getMailById(id);
        if(!mail)
            throw new Error('Mail id not found. Please check and try again.');

        const mailSentDTO: MailSentDTO = new MailSentDTO(mail);
        return mailSentDTO
    }

    public async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByDateAndId(id, date);
        return mails.map((mail) => new MailSentDTO(mail))
    }

    public async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        const mails: Mail [] = await mailRep.getMailsByUserId(userId);
        return mails.map((mail) => new MailSentDTO(mail))
    }
}

export default MailService;