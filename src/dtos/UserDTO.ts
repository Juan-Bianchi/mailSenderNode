import MailSentDTO from './MailSentDTO'
import {Role} from '@prisma/client'
import User from '../models/User'

class UserDTO {
    private id: number;
    private ownEmail: string;
    private userName: string;
    private mails: MailSentDTO[];
    private role: Role;
    
    
    public constructor(user: User) {
        this.ownEmail = user.getOwnEmail();
        this.userName = user.getUserName();
        this.mails = user.getMails().map(mail => new MailSentDTO(mail));
        this.role = user.getRole();
        this.id = user.getId() as number;
    }

    public getId(): number {
        return this.id;
    }

    public getOwnEmail(): string {
        return this.ownEmail;
    }

    public getUserName(): string {
        return this.userName;
    }

    public getMails(): MailSentDTO[] {
        return this.mails;
    }
    
    public getRoles(): Role {
        return this.role;
    }
}


export default UserDTO