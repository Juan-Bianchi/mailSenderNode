import request from 'supertest';
import {app, server} from '../../../src/index';
import { authService } from '../../../src/utils/Dependencies';
import RegisterError from '../../../src/errors/RegisterError';
import DatabaseError from '../../../src/errors/DatabaseError';
import AuthResponseDTO from '../../../src/dtos/AuthResponseDTO';
import PasswordValidationError from '../../../src/errors/PasswordValidationError';
import LoginError from '../../../src/errors/LoginError';
import TokenValidationError from '../../../src/errors/TokenValidationError';


describe('/register', () => {
    it('should register a new User', async () => {
        const userData = {
            userName: 'testUser',
            password: 'securePassword123!',
            email: 'user@example.com',
        };

        jest.spyOn(authService, 'register').mockImplementation( async ()=> {
            return true;
        })
    
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

        jest.spyOn(authService, 'register').mockImplementation( async ()=> {
            throw new RegisterError("Register error");
        })
    
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

        jest.spyOn(authService, 'register').mockImplementation( async ()=> {
            throw new DatabaseError("Database error");
        })
    
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

        jest.spyOn(authService, 'register').mockImplementation( async ()=> {
            throw new Error('Unknown error');
        })
    
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

        jest.spyOn(authService, 'login').mockImplementation( async () => {
            const token: string = 'token';
            return new AuthResponseDTO(token, 'Logged in'); 
        })
    
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

        jest.spyOn(authService, 'login').mockImplementation( async () => {
            throw new PasswordValidationError("Password error");
        })
    
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

        jest.spyOn(authService, 'login').mockImplementation( async () => {
            throw new LoginError("Login error");
        })
    
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

        jest.spyOn(authService, 'login').mockImplementation( async () => {
            throw new TokenValidationError("Token error");
        })
    
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

        jest.spyOn(authService, 'login').mockImplementation( async () => {
            throw new Error('Unknown error');
        })
    
        const response = await request(app).post('/api/login')
            .send(userData);

        expect.assertions(1);
        expect(response.statusCode).toBe(403);
    });
})

afterAll(async () => {
    server.close();
});

