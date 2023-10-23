import Mail from '../models/Mail'

class MailSentDTO {
    id: number | undefined;
    subject: string;
    message: string;
    recipients: string[];
    date: Date;
    sender: string;

    public constructor(mail: Mail) {
        this.subject = mail.subject;
        this.message = mail.message;
        this.recipients = mail.recipients;
        this.date = mail.date;
        this.id = mail.id as number; 
        this.sender = mail.sender?.ownEmail as string;
    }

}


export default MailSentDTO