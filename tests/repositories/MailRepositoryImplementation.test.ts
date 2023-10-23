import { prismaMock } from '../../database/singleton'
import MailRepositoryImplementation from '../../src/repositories/repositoriesImplementations/MailRepositoryImplementation'
import Mail from '../../src/models/Mail';
import MailSentDTO from '../../src/dtos/MailSentDTO';
import { MailEntity } from '@prisma/client';
import {expect, jest, test} from '@jest/globals';
import ConstraintError from '../../src/errors/ConstraintError';
import GetVerbError from '../../src/errors/GetVerbError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


const mailRep = new MailRepositoryImplementation();
let mailEntity: MailEntity;
let mailEntity2: MailEntity;
let mail: Mail;
let mail2: Mail;
let mailDto: MailSentDTO;
let mailDto2: MailSentDTO;


beforeEach(()=> {
    mailEntity =  {
        id: 1,
        subject: 'Testing',
        message: 'This is a testing email',
        recipients: ['testing1@mail.com', 'testing2@mail.com'],
        date: new Date('2022-12-18T00:00:00'),
        userId: 1
    }
    mailEntity2 = {... mailEntity, id: 2, date: new Date('2022-12-18T00:00:00')}
    mail = new Mail(mailEntity.subject, mailEntity.message, mailEntity.recipients, mailEntity.date, mailEntity.id);
    mail2 = new Mail(mailEntity2.subject, mailEntity2.message, mailEntity2.recipients, mailEntity2.date, mailEntity2.id)
    mailDto = new MailSentDTO(mail);
    mailDto2 = new MailSentDTO(mail2);
})

afterEach(() => {
    // restore replaced property
    jest.restoreAllMocks();
});


describe('saveMail', () => {
    it('should save a new Mail', async () => {
        prismaMock.mailEntity.create.mockResolvedValue(mailEntity)
        expect.assertions(1);
        expect(await mailRep.saveMail(mailDto, mailEntity.userId)).toEqual(mailEntity);
    })
})


describe('saveMail', () => {
    it('should throw if an error is generated', async () => {
        let error: Error = new PrismaClientKnownRequestError(
            'There is a unique constraint that is being violated.',{
                code: 'P2022',
                meta: { target: ['email'] },
                clientVersion: '2.19.0'
            });
        
        expect.assertions(2);
        prismaMock.mailEntity.create.mockRejectedValue(error);
        await expect(mailRep.saveMail(mailDto, mailEntity.userId)).rejects.toThrowError();
        error = new Error('Unknonwn error')
        prismaMock.mailEntity.create.mockRejectedValue(error);
        await expect(mailRep.saveMail(mailDto, mailEntity.userId)).rejects.toThrowError();
        
    })
})


describe('getMailsByDateAndId', () => {
    it('should get Mails from a User on a date', async () => {

        const userId = 1;
        const date = new Date('2022-12-18T00:00:00');
        const expectedStartDate = new Date('2022-12-18T00:00:00.000');
        const expectedEndDate = new Date('2022-12-19T00:00:00.000');

        expect.assertions(4);

        prismaMock.mailEntity.findMany.mockResolvedValue([mailEntity, mailEntity2]);
        const mails: Mail[] = await mailRep.getMailsByDateAndId(userId, date);

        expect(mails).toHaveLength(2); // Must be two emails within the date range
        expect(mails[0].getId()).toEqual(1);
        expect(mails[1].getId()).toEqual(2);

        expect(prismaMock.mailEntity.findMany).toHaveBeenCalledWith({
            where: {
              date: {
                gte: expectedStartDate,
                lt: expectedEndDate,
              },
              userId,
            },
        });
        
    })
})


describe('getMailsByDateAndId', () => {
    it('should throw when an error occuours', async () => {
        const userId = 1;
        const date = new Date('2022-12-18T00:00:00');

        expect.assertions(1);

        prismaMock.mailEntity.findMany.mockRejectedValue(new GetVerbError('Error while retrieving mails'));
        await expect(mailRep.getMailsByDateAndId(userId, date)).rejects.toThrowError();
    })
})




