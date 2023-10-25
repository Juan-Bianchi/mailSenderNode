import { MailEntity, Role } from "@prisma/client";
import MailSentDTO from "../../src/dtos/MailSentDTO";
import Mail from "../../src/models/Mail";
import User from "../../src/models/User";
import MailRepository from "../../src/repositories/MailRepository";
import DatabaseError from "../../src/errors/DatabaseError";

class MailRepositoryMock implements MailRepository {

    async getMailsByDateAndId(userId: number, date: Date): Promise<Mail[]> {
        if(userId === 0) {
            return [];
        }

        if(userId === 1000) {
            let mails = new Array<Mail>
            for(let i=0; i < 1001; i++) {
                mails.push(new Mail('Testing', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], date));
            };
            return mails;
        }

        const user1 = new User('fakeEmail@mail.com', 'fakeUser', 'fakePassword1%', [], Role.USER, 1);
        const mail = new Mail('Testing', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], date);
        const mail2 = new Mail('Testing', 'This is a testing email', ['testing1@mail.com', 'testing2@mail.com'], date);
        mail.sender = user1;
        mail2.sender = user1;
        let mails = new Array<Mail>;
        mails.push(mail);
        mails.push(mail2);

        return mails;
    }

    async getMailsByUserId(userId: number): Promise<Mail[]> {
        if(userId === 1000) {
            return [];
        }

        const user1 = new User('fakeEmail@mail.com', 'fakeUser', 'fakePassword1%', [], Role.USER, 1);
        const mail = new Mail('Testing', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        const mail2 = new Mail('Testing', 'This is a testing email', ['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        mail.sender = user1;
        mail2.sender = user1;
        
        return [mail, mail2];
    }


    async saveMail(mail: MailSentDTO, userId: number): Promise<MailEntity> {
        if(userId === 1){
            throw new DatabaseError('Database error')
        }

        const mailEntity: MailEntity =  {
            id : mail.id as number,
            subject: mail.subject,
            message: mail.message,
            recipients: mail.recipients,
            date: mail.date,
            userId: userId
        }

        return mailEntity; 
    }

}

export default MailRepositoryMock