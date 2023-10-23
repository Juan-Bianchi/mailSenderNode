import MailSentDTO from './MailSentDTO'
import {Role} from '@prisma/client'
import User from '../models/User'

class UserDTO {
    id: number;
    ownEmail: string;
    userName: string;
    mails: MailSentDTO[];
    role: Role;
    
    
    public constructor(user: User) {
        this.ownEmail = user.ownEmail;
        this.userName = user.userName;
        this.mails = user.mails.map(mail => new MailSentDTO(mail));
        this.role = user.role;
        this.id = user.id as number;
    }
}


export default UserDTO