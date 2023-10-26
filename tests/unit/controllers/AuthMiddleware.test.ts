import request from 'supertest';
import {app, server} from '../../../src/index';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken'


describe('checkToken', () => {
    it('it should response with 403 if no token is provided', async () => {
        const response = await request(app).get('/api/users')
        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Token is not correct');
    })
})

describe('checkToken', () => {
    it('it should response with 403 if token is expired', async () => {
        const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW5KdWFuIiwiZW1haWwiOiJjaGFsbGVuZ2VfcHJ1ZWJhX2p1YW5Ab3V0bG9vay5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2OTgyNjg1OTYsImV4cCI6MTY5ODI3MjE5Nn0.Vlke2v5jZqrO2eFONaR-o5BvHfWhQxvpRWA7m_ZF21Y'
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('jwt expired');
    })
})

describe('checkToken', () => {
    it('it should response with 403 if token is invalid', async () => {
        const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW5KdWFuIiwiZW1haWwiOiJjaGFsbGVuZ2VfcHJ1ZWJhX2p1YW5Ab3V0bG9vay5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2OTgyNjg1OTYsImV4cCI6MTY5ODI3MjE5Nn0.Vlke2v5jZqrO2eFONaR-o5BvHfWh'
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('invalid signature');
    })
})

describe('checkToken', () => {
    it('it should response with 403 if user is role is not valid', async () => {
        const user: string = 'user';
        const mail: string = 'mail@mail.com'
        const role: string = 'wrong'
        const token: string = jwt.sign({user, mail, role} , 'secret' , { expiresIn: '1h' });
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Role is not valid');
    })
})


describe('verifyAdminRole', () => {
    it('it should response with 403 if user is not an ADMIN', async () => {
        const user: string = 'user';
        const mail: string = 'mail@mail.com'
        const role: string = Role.USER
        const token: string = jwt.sign({user, mail, role} , 'secret' , { expiresIn: '1h' });
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Role is not admin, you are not allowed to access this data.');
    })
})

describe('verifyAdminRole', () => {
    it('it should reach the next part of the response', async () => {
        const user: string = 'user';
        const mail: string = 'mail@mail.com'
        const role: string = Role.ADMIN
        const token: string = jwt.sign({user, mail, role} , 'secret' , { expiresIn: '1h' });
        const response = await request(app).get('/api/users').set("Authorization", `Bearer ${token}`)

        expect.assertions(1);
        expect(response.status).toBe(200);
    })
})

afterAll(async () => {
    server.close();
});