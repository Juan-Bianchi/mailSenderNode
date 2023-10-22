import { prismaMock } from '../../database/singleton'
import MailRepositoryImplementation from '../../src/repositories/repositoriesImplementations/MailRepositoryImplementation'
import Mail from '../../src/models/Mail';
import MailSentDTO from '../../src/dtos/MailSentDTO';
import { MailEntity } from '@prisma/client';


const mailRep = new MailRepositoryImplementation();
const mailEntity: MailEntity =  {
    id: 1,
    subject: 'Testing',
    message: 'This is a testing email',
    recipients: ['testing1@mail.com', 'testing2@mail.com'],
    date: new Date('2022-12-18T00:00:00'),
    userId: 28
}
const mail = new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity.date, mailEntity.id);
const mailDto = new MailSentDTO(mail);


describe('saveMail', () => {
    it('should save a new Mail', async () => {
        prismaMock.mailEntity.create.mockResolvedValue(mailEntity)
        expect.assertions(1);
        expect(await mailRep.saveMail(mailDto, mailEntity.userId)).toEqual(mailEntity);
    })
})


describe('saveMail', () => {
    it('should throw if an error is generated', async () => {
        const error: Error = new Error('PK Duplicada')
        expect.assertions(1);
        prismaMock.mailEntity.create.mockRejectedValue(error);
        await expect(mailRep.saveMail(mailDto, mailEntity.userId)).rejects.toThrowError();

    })
})


describe('getMailsByDateAndId', () => {
    it('should get Mails from a User on a date', async () => {

        const mailsEntities: MailEntity[] = new Array<MailEntity>;
        const mails: Mail[] = new Array<Mail>;
        for(let i: number = 1; i < 3; i++) {
            prismaMock.mailEntity.create.mockResolvedValue({...mailEntity, id: i})
            const mail1 = new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity.date, i);
            const mailDto1 = new MailSentDTO(mail1);
            await mailRep.saveMail(mailDto1, i);
            mailsEntities.push({...mailEntity, id: i});
            mails.push(new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity.date, i));
        }

        prismaMock.mailEntity.findMany.mockResolvedValue(mailsEntities);

        expect.assertions(1);
        expect(await mailRep.getMailsByDateAndId(28, new Date('2022-12-18T00:00:00'))).toEqual(mails);
    })
})

