import { MailEntity, UserEntity } from "@prisma/client";
import Mail from "../../../src/models/Mail";
import MailSentDTO from "../../../src/dtos/MailSentDTO";
import MailRepositoryImplementation from "../../../src/repositories/repositoriesImplementations/MailRepositoryImplementation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import UserRepositoryImplementation from "../../../src/repositories/repositoriesImplementations/UserRepositoryImplementation";
import RegisterDTO from "../../../src/dtos/RegisterDTO";
import prisma from "../../../database/client";

const mailRep = new MailRepositoryImplementation();
const userRep = new UserRepositoryImplementation();
let mailEntity: MailEntity;
let mailEntity2: MailEntity;
let mail: Mail;
let mail2: Mail;
let mailDto: MailSentDTO;
let mailDto2: MailSentDTO;
let user: UserEntity;


beforeAll(()=> {
    mailEntity =  {
        id: 1,
        subject: 'Testing',
        message: 'This is a testing email',
        recipients: ['testing1@mail.com', 'testing2@mail.com'],
        date: new Date('2022-12-18T00:00:00'),
        userId: 1
    }
    mailEntity2 = {... mailEntity, id: 2}
    mail = new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity.date, mailEntity.id);
    mail2 = new Mail(mailEntity2.subject, mailEntity2.message, mailEntity2.recipients, mailEntity2.date, mailEntity2.id)
    mailDto = new MailSentDTO(mail);
    mailDto2 = new MailSentDTO(mail2);
})

afterAll( async ()=> {
    await prisma.mailEntity.deleteMany();
    await prisma.userEntity.deleteMany();
})


describe('saveMail', () => {
    it('should save a new Mail', async () => {
        expect.assertions(4);
        user = await userRep.saveUser(new RegisterDTO('fakeUser88', 'fakeMail88@mail.com', 'Test1234#'))
        mailEntity = await mailRep.saveMail(mailDto, user.id);
        mailEntity2 = await mailRep.saveMail(mailDto2, user.id);

        expect(mailEntity.date).toEqual(mailDto.date);
        expect(mailEntity.subject).toEqual(mailDto.subject);
        expect(mailEntity.message).toEqual(mailDto.message);
        expect(mailEntity.recipients).toEqual(mailDto.recipients);
    })
})


describe('saveMail', () => {
    it('should throw if an error is generated', async () => {
        let error: Error = new PrismaClientKnownRequestError(
            'Database error',{
                code: 'P2022',
                meta: { target: ['email'] },
                clientVersion: '2.19.0'
            });
        
        expect.assertions(1);
        await expect(mailRep.saveMail(mailDto, 55555)).rejects.toThrowError(error);        
    })
})


describe('getMailsByDateAndId', () => {
    it('should get Mails from a User on a date', async () => {
        const date = mailEntity.date;

        expect.assertions(3);

        const mails: Mail[] = await mailRep.getMailsByDateAndId(user.id, date);
        expect(mails).toHaveLength(2); // Must be two emails within the date range
        expect(mails[0].id).toEqual(mailEntity.id);
        expect(mails[1].id).toEqual(mailEntity2.id);        
    })
})


describe('getMailsByDateAndId', () => {
    it('should get an empty array when user id not correct or user does not have mails', async () => {
        const userId = 100000;
        const date = new Date('2022-12-18T00:00:00');

        expect.assertions(1);

        expect(await mailRep.getMailsByDateAndId(userId, date)).toEqual([]);
    })
})


describe('getMailsByUserId', () => {
    it('should get Mails from a User by the id provided', async () => {

        mailEntity2 = {... mailEntity2, userId: user.id}
        
        expect.assertions(3);

        const mails: Mail[] = await mailRep.getMailsByUserId(user.id);

        expect(mails).toHaveLength(2); // Must be two emails of the same user
        expect(mails[0].id).toEqual(mailEntity.id);
        expect(mails[1].id).toEqual(mailEntity2.id);
        
    })
})


describe('getMailsByUserId', () => {
    it('should get an empty array when user id not correct or user does not have mails', async () => {
        expect.assertions(1);
        expect(await mailRep.getMailsByUserId(1)).toEqual([]);
    })
})