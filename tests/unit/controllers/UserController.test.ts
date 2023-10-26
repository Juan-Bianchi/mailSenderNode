import request from 'supertest';
import {app, server} from '../../../src/index';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { userService } from '../../../src/utils/ServiceCreator';
import GetVerbError from '../../../src/errors/GetVerbError';
import prisma from '../../../database/client';

describe('/users', () => {
    it('should get all users', async () => {
        const user: string = 'user';
        const mail: string = 'mail@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, mail, role} , 'secret' , { expiresIn: '1h' });
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2)

    });
})

describe('/users', () => {
    it('should handle GetVerbError', async () => {
        const user = 'user';
        const mail = 'mail@mail.com';
        const role = Role.ADMIN;
        const token = jwt.sign({ user, mail, role }, 'secret', { expiresIn: '1h' });

        jest.spyOn(userService, 'getAllUsers').mockImplementation(() => {
            throw new GetVerbError('Error while getting users');
        });

        const response = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`)

        expect.assertions(2);
        expect(response.text).toBe('Error while getting users');
        expect(response.status).toBe(403);
    });
})

describe('/users', () => {
    it('should handle unknown error', async () => {
        const user = 'user';
        const mail = 'mail@mail.com';
        const role = Role.ADMIN;
        const token = jwt.sign({ user, mail, role }, 'secret', { expiresIn: '1h' });

        jest.spyOn(userService, 'getAllUsers').mockImplementation(() => {
            throw new Error('Forbidden');
        });

        const response = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`)

        expect.assertions(2);
        expect(response.text).toBe('Forbidden');
        expect(response.status).toBe(403);
    });
});

afterAll(async () => {
    server.close();
});