import request from 'supertest';
import {app, server} from '../../src/index';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken'
import prisma from '../../database/client';


describe('Admin', () => {
    it('should register a new Admin User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'adminUser@example.com',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(3);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('adminUser@example.com');
        expect(response.body.userName).toBe('testUser');
    });

    it('should login the Admin User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'adminUser@example.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Logged in');
    });

    it('should get all users', async () => {
        const user: string = 'testUser';
        const mail: string = 'adminUser@example.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, mail, role} , 'secret' , { expiresIn: '1h' });
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1)

    });


})

describe('Average User', () => {
    it('should register a new User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'challenge_prueba_juan@outlook.com',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(3);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('challenge_prueba_juan@outlook.com');
        expect(response.body.userName).toBe('testUser');
    });

    it('should login the avarage User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'challenge_prueba_juan@outlook.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Logged in');
    });

    it('it should send an email', async () => {
        const user: string = 'testUser';
        const email: string = 'challenge_prueba_juan@outlook.com'
        const role: string = Role.USER
        const token: string = jwt.sign({user, email, role} , 'secret' , { expiresIn: '1h' });
        const sender = 'challenge_prueba_juan@outlook.com';
        const subject = 'subject';
        const message = 'message';
        const recipients = ['recipient1@example.com', 'recipient2@example.com'];
        const date = new Date();
        
        const response = await request(app)
                            .post('/api/mails')
                            .set("Authorization", `Bearer ${token}`)
                            .send({sender, subject, message, recipients, date})
        
        expect.assertions(2);
        expect(response.status).toBe(200);
        expect(response.body.subject).toBe('subject');
    })
})


afterAll(async () => {
    await prisma.mailEntity.deleteMany();
    await prisma.userEntity.deleteMany();
    server.close();
});

