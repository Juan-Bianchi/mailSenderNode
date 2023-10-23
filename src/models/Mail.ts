import User from './User'

class Mail {
    id: number | undefined;
    sender: User | undefined;
    subject: string;
    message: string;
    recipients: string[];
    date: Date;

    public constructor(subject: string, message: string, recipients: string[], date: Date, id?: number) {
        this.subject = subject;
        this.message = message;
        this.recipients = recipients;
        this.date = date;

        this.id = id; // optional
    }

    
}


export default Mail