import User from './User'

class Mail {
    private id: number | undefined;
    private sender: User | undefined;
    private subject: string;
    private message: string;
    private recipients: string[];
    private date: Date;

    public constructor(subject: string, message: string, recipients: string[], id?: number) {
        this.subject = subject;
        this.message = message;
        this.recipients = recipients;
        this.date = new Date();

        this.id = id; // optional
    }

    public setSender(user: User): void {
        this.sender = user;
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

    public getSender(): User | undefined{
        return this.sender;
    }

    public getDate(): Date {
        return this.date;
    }

    public getRecipients(): string[] {
        return this.recipients;
    }
}


export default Mail