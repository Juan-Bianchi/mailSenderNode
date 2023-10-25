import Mail from './Mail'
import {Role} from '@prisma/client'


class User {
    id: number | undefined | null;
    ownEmail: string;
    userName: string;
    password: string;
    mails: Mail[];
    role: Role;
    
    
    public constructor(ownEmail: string, userName: string, password: string, mails: Mail[], role: Role, id?: number) {
        this.ownEmail = ownEmail;
        this.userName = userName;
        this.password = password;
        this.mails = mails;
        this.role = role;

        this.id = id;
    }

}


export default User