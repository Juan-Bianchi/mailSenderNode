import LoginDTO from "../../../src/dtos/LoginDTO"
import RegisterDTO from "../../../src/dtos/RegisterDTO"
import LoginError from "../../../src/errors/LoginError"
import RegisterError from "../../../src/errors/RegisterError"
import AuthServiceImplementation from "../../../src/services/servicesImplementations/AuthServiceImplementation"
import Jwtoken from "../../../src/utils/Jwtoken"
import JwtokenImpl from "../../../src/utils/ultisImplementations/JwtokenImpl"
import EncrypterMock from "../../Mocks/EncrypterMock"
import UserRepositoryMock from "../../Mocks/UserRepositoryMock"

const userRep: UserRepositoryMock = new UserRepositoryMock()
const encrypter: EncrypterMock = new EncrypterMock()
const jwt: Jwtoken = new JwtokenImpl()
const authService: AuthServiceImplementation = new AuthServiceImplementation(userRep, encrypter, jwt);

describe('register', () => {
    it('should register a new User', async () => {
        const registerDto: RegisterDTO = new RegisterDTO('fakeUser', 'fakeMail77@mail.com', 'Test1234$');
        expect.assertions(1);
        expect(await authService.register(registerDto)).toEqual(true);
    })
})

describe('register', () => {
    it('should throw if email is not ok', async () => {
        const registerDto: RegisterDTO = new RegisterDTO('fakeUser', 'fakeMail77', 'Test1234#');
        expect.assertions(1);
        await expect(authService.register(registerDto)).rejects.toThrow(RegisterError);
    })
})

describe('register', () => {
    it('should throw if password is not ok', async () => {
        const registerDto: RegisterDTO = new RegisterDTO('fakeUser', 'fakeMail77@mail.com', '123');
        expect.assertions(1);
        await expect(authService.register(registerDto)).rejects.toThrow(RegisterError);
    })
})

describe('register', () => {
    it('should throw if there is a missing field', async () => {
        const registerDto: RegisterDTO = new RegisterDTO('', 'fakeMail77@mail.com', 'Test1234#');
        expect.assertions(1);
        await expect(authService.register(registerDto)).rejects.toThrow(RegisterError);
    })
})

describe('login', () => {
    it('should login an existing User', async () => {
        const loginDto: LoginDTO = new LoginDTO('fakeUser', 'fakeMail77@mail.com', 'Test1234#');
        expect.assertions(1);
        expect((await authService.login(loginDto)).status).toEqual('Logged in');
    })
})

describe('login', () => {
    it('should throw if email is not ok', async () => {
        const loginDto: LoginDTO = new LoginDTO('fakeUser', 'null@mail.com', 'Test1234#');
        expect.assertions(1);
        await expect(authService.login(loginDto)).rejects.toThrow(LoginError);
    })
})

describe('login', () => {
    it('should throw if password is not ok', async () => {
        const loginDto: LoginDTO = new LoginDTO('fakeUser', 'badPass@mail.com', 'badPass');
        expect.assertions(1);
        await expect(authService.login(loginDto)).rejects.toThrow(LoginError);
    })
})

describe('login', () => {
    it('should throw if there is a missing field', async () => {
        const loginDto: LoginDTO = new LoginDTO('', 'fakeMail77@mail.com', 'Test1234#');
        expect.assertions(1);
        await expect(authService.login(loginDto)).rejects.toThrow(LoginError);
    })
})

