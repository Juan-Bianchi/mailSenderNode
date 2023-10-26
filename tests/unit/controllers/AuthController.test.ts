import request from 'supertest';
import {app, server} from '../../../src/index';


describe('/register', () => {
    it('should register a new User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'user@example.com',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(4);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('user@example.com');
        expect(response.body.password).toBe('securePassword123!');
        expect(response.body.userName).toBe('testUser');
    });
})

describe('/register', () => {
    it('should respond a 403 status code when email is not correct', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'register',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Register error');
    });
})

describe('/register', () => {
    it('should respond a 403 status code when email is already used', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'database@mail.com',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Database error');
    });
})

describe('/register', () => {
    it('should respond a 403 status code when an unknown error is thrown', async () => {
        const userData = {
            userName: 'unknown',
            password: 'securePassword123!',
            email: 'mail@mail.com',
        };
    
        const response = await request(app).post('/api/register').send(userData);

        expect.assertions(1);
        expect(response.statusCode).toBe(403);
    });
})


describe('/login', () => {
    it('should login a User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'user@example.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Logged in');
    });
})


describe('/login', () => {
    it('should respond a 403 status code when password is not correct', async () => {
        const userData = {
            userName: 'testUser',
            password: 'password!',
            email: 'register',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Password error');
    });
})

describe('/login', () => {
    it('should respond a 403 status code when email is not ok', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'login@mail.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Login error');
    });
})

describe('/login', () => {
    it('should respond a 403 status code when token is not ok', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'token@mail.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(2);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Token error');
    });
})

describe('/login', () => {
    it('should respond a 403 status code when an unknown error is thrown', async () => {
        const userData = {
            userName: 'unknown',
            password: 'securePassword123!',
            email: 'mail@mail.com',
        };
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(1);
        expect(response.statusCode).toBe(403);
    });
})

afterAll(async () => {
    server.close();
});

