import MailServiceImplementation from "../../../src/services/servicesImplementations/MailServiceImplementation"
import MailRepositoryMock from "../../Mocks/MailRepositoryMock"
import MailjetMock from "../../Mocks/MailjetMock"
import SendgridMock from "../../Mocks/SendgridMock";
import UserRepositoryMock from "../../Mocks/UserRepositoryMock"
import { Role } from "@prisma/client";
import User from "../../../src/models/User";
import Mail from "../../../src/models/Mail";
import MailSentDTO from "../../../src/dtos/MailSentDTO";
import GetVerbError from "../../../src/errors/GetVerbError";
import PostVerbError from "../../../src/errors/PostVerbError";

const mailRep: MailRepositoryMock = new MailRepositoryMock();
const userRep: UserRepositoryMock = new UserRepositoryMock();
const mailjet: MailjetMock = new MailjetMock();
const sendgrid: SendgridMock = new SendgridMock();

const mailServ: MailServiceImplementation = new MailServiceImplementation(mailRep, userRep, mailjet, sendgrid);
const user1 = new User('fakeEmail@mail.com', 'fakeUser', 'fakePassword1%', [], Role.USER, 10);


describe('sendMail', () => {
    it('should send a new Mail', async () => {
        const mail = new Mail('mailjetErrorSendgrid', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        const mailDto = new MailSentDTO(mail);
        expect.assertions(1);
        expect(await mailServ.sendMail(mailDto, 'fakeEmail@mail.com')).toEqual(true);
    })
})

describe('sendMail', () => {
    it('should throw an exception if userId is null', async () => {
        const mail = new Mail('Testing', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        const mailDto = new MailSentDTO(mail);
        
        await expect(mailServ.sendMail(mailDto, 'error@mail.com')).rejects.toThrow(GetVerbError);
    })
})

describe('sendMail', () => {
    it('should throw an exception if email sending limit is exceeded', async () => {
        const mail = new Mail('Testing', 'This is a testing email',['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        const mailDto = new MailSentDTO(mail);
        
        await expect(mailServ.sendMail(mailDto, 'fakeEmail1000@mail.com')).rejects.toThrow(PostVerbError);
    })
})

describe('sendMail', () => {
    it('should throw an exception if neither mailjet nor sendgrid could send the mail', async () => {
        const mail = new Mail('mailjetErrorSendgrid', 'mailjetError',['testing1@mail.com', 'testing2@mail.com'], new Date('2022-12-18T00:00:00'));
        const mailDto = new MailSentDTO(mail);
        
        await expect(mailServ.sendMail(mailDto, 'mailjetErrorSendgrid@mail.com')).rejects.toThrow(PostVerbError);
    })
})

describe('getMailsByDateAndId', () => {
    it('should get Mails from a User on a date', async () => {
        expect.assertions(1);
        expect(await mailServ.getMailsByDateAndId(10, new Date('2022-12-18T00:00:00'),)).toHaveLength(2)
    })
})

describe('getMailsByUserId', () => {
    it('should get Mails from a User with the id given', async () => {
        expect.assertions(1);
        expect(await mailServ.getMailsByUserId(10)).toHaveLength(2)
    })
})
