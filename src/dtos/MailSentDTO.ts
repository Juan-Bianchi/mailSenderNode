import Mail from '../models/Mail'
import UserDTO from './UserDTO';
import User from '../models/User'

class MailSentDTO {
    private id: number;
    private subject: string;
    private message: string;
    private recipients: string[];
    private date: Date;
    private sender: UserDTO;

    public constructor(mail: Mail) {
        this.subject = mail.getSubject();
        this.message = mail.getMessage();
        this.recipients = mail.getRecipients();
        this.date = mail.getDate();
        this.id = mail.getId() as number; 
        this.sender = new UserDTO(mail.getSender() as User);
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getSubject(): string {
        return this.subject;
    }

    public getMessage(): string {
        return this.message;
    }

    public getDate(): Date {
        return this.date;
    }

    public getRecipients(): string[] {
        return this.recipients;
    }

    public getUserDTO(): UserDTO {
        return this.sender;
    }
}


export default MailSentDTO