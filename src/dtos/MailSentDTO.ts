import Mail from '../models/Mail'
import UserDTO from './UserDTO';
import User from '../models/User'

class MailSentDTO {
    private id: number | undefined;
    private subject: string;
    private message: string;
    private recipients: string[];
    private date: Date;
    private sender: string;

    public constructor(mail: Mail) {
        this.subject = mail.getSubject();
        this.message = mail.getMessage();
        this.recipients = mail.getRecipients();
        this.date = mail.getDate();
        this.id = mail.getId() as number; 
        this.sender = mail.getSender()?.getOwnEmail() as string;
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

    public getSender(): string{
        return this.sender;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setSender(sender: string): void {
        this.sender = sender;
    }
}


export default MailSentDTO