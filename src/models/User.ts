import Mail from './Mail'
import {Role} from '@prisma/client'


class User {
    private id: number | undefined;
    private ownEmail: string;
    private userName: string;
    private password: string;
    private mails: Mail[];
    private role: Role;
    
    
    public constructor(ownEmail: string, userName: string, password: string, mails: Mail[], role: Role, id?: number) {
        this.ownEmail = ownEmail;
        this.userName = userName;
        this.password = password;
        this.mails = mails;
        this.role = role;

        this.id = id;
    }

    public setRole(role: Role): void {
        this.role = role;
    }

    public setMails(mails: Mail[]): void {
        this.mails = mails;
    }

    public addMail(mail: Mail): void {
        this.mails.push(mail);
        mail.setSender(this);
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getOwnEmail(): string {
        return this.ownEmail;
    }

    public getUserName(): string {
        return this.userName;
    }

    public getPassword(): string {
        return this.password;
    }

    public getMails(): Mail[] {
        return this.mails;
    }

    public getRole(): Role {
        return this.role;
    }
}


export default User