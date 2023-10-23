import User from './User'

class Mail {
    private id: number | undefined;
    private sender: User | undefined;
    private subject: string;
    private message: string;
    private recipients: string[];
    private date: Date;

    public constructor(subject: string, message: string, recipients: string[], date: Date, id?: number) {
        this.subject = subject;
        this.message = message;
        this.recipients = recipients;
        this.date = date;

        this.id = id; // optional
    }

    public setId(id: number) {
        this.id = id;
    }

    public setSender(user: User): void {
        this.sender = user;
    }

    public setDate(date: Date): void {
        this.date = date;
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