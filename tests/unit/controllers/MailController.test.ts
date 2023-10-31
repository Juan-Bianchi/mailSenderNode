import request from 'supertest';
import {app, server} from '../../../src/index';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { mailService } from '../../../src/utils/Dependencies';
import PostVerbError from '../../../src/errors/PostVerbError';
import GetVerbError from '../../../src/errors/GetVerbError';
import DatabaseError from '../../../src/errors/DatabaseError';


describe('/mails', () => {
    it('it should send an email', async () => {
        const user: string = 'user';
        const email: string = 'ok@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = 'ok@mail.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();

        jest.spyOn(mailService, 'sendMail').mockImplementation( async ()=> {
            return true;
        })
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(200);
        expect(response.body.subject).toBe('subject');
    })
})

describe('/mails', () => {
    it('it should handle an error if no token is provided', async () => {
        const response = await request(app).post('/api/mails')
        
        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Token is not correct');
    })
})

describe('/mails', () => {
    it('it should handle an error if emails sent limit has been exceeded', async () => {
        const user: string = 'user';
        const email: string = '1000@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = '1000@mail.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();

        jest.spyOn(mailService, 'sendMail').mockImplementation( async ()=> {
            throw new PostVerbError('Mail could not be sent. You have exceeded the maximum amount of sent emails for today.');
        })
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(403);
        expect(response.text).toBe('Mail could not be sent. You have exceeded the maximum amount of sent emails for today.');
    })
})

describe('/mails', () => {
    it('it should handle an error if user is not correct', async () => {
        const user: string = 'user';
        const email: string = 'null@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = '1000@mail.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();

        jest.spyOn(mailService, 'sendMail').mockImplementation( async ()=> {
            throw new GetVerbError('Not user found with this id.');
        })
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(403);
        expect(response.text).toBe('Not user found with this id.');
    })
})

describe('/mails', () => {
    it('it should handle an error if email could not be sent', async () => {
        const user: string = 'wrong';
        const email: string = 'wrong@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = 'wrong@mail.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();

        jest.spyOn(mailService, 'sendMail').mockImplementation( async ()=> {
            throw new DatabaseError('Mail could not be sent. Please try again later');
        })
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(403);
        expect(response.text).toBe('Mail could not be sent. Please try again later');
    })
})

describe('/mails', () => {
    it('it should handle an error if an unknown error is thrown', async () => {
        const user: string = 'wrong';
        const email: string = 'wrong@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = 'unknown@mail.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();

        jest.spyOn(mailService, 'sendMail').mockImplementation( async ()=> {
            throw new Error('Forbidden');
        })
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
    })
})

afterAll(async () => {
    server.close();
});