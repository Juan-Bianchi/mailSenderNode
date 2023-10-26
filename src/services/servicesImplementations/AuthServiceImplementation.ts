import AuthService from '../AuthService'
import LoginDTO from "../../dtos/LoginDTO";
import Jwtoken from "../../utils/ultisImplementations/JwtokenImpl";
import User from "../../models/User";
import AuthResponseDTO from '../../dtos/AuthResponseDTO';
import RegisterDTO from '../../dtos/RegisterDTO';
import UncreatedUser from '../../dtos/UncreatedUser.interface';
import LoginError from '../../errors/LoginError';
import RegisterError from '../../errors/RegisterError';
import prisma from '../../../database/client';
import UserRepository from '../../repositories/UserRepository';
import Encrypter from '../../utils/Encrypter';


class AuthServiceImplementation implements AuthService {

    userRep: UserRepository;
    encrypter: Encrypter;
    jwt: Jwtoken;

    constructor(userRep: UserRepository, encrypter: Encrypter, jwt: Jwtoken) {
        this.userRep = userRep;
        this.encrypter =encrypter;
        this.jwt = jwt;
    }

    async register(newUser: RegisterDTO): Promise<boolean> {
        const transactionResult: boolean = await prisma.$transaction(async () => {
            let userIsOk: boolean = newUser && Object.keys(newUser).length !== 0;
            if(!userIsOk){
                throw new RegisterError("Not valid user. Send again.");
            }
            if(this.dtoHasMissingFields(newUser)){
                throw new RegisterError('There are missing fields. It is not possible to register the user.');
            }
            if(!this.emailIsCorrect(newUser.email)) {
                throw new RegisterError('The email given is not correct. Please, provide a different one');
            }
            if(!this.passwordIsCorrect(newUser.password)) {
                throw new RegisterError('Password requires 1 uppercase, 1 lowercase, 1 digit, 1 special character, min. 8 characters.');
            }
            newUser.password = await this.encrypter.encrypt(newUser.password);
            return await this.userRep.saveUser(newUser) !== null;
        })
        return transactionResult;
    }


    async login(user: LoginDTO): Promise<AuthResponseDTO> {
        let userIsOk: boolean = user && Object.keys(user).length !== 0;
        if(!userIsOk){
            throw new LoginError("Not valid user. Send again.");
        }
        if(this.dtoHasMissingFields(user)){
            throw new LoginError('There are missing fields. It is not possible to register the user.');
        }
        const savedUser: User | null = await this.userRep.getUserByEmail(user.email);
        if(!savedUser) {
            throw new LoginError('Please check your credentials and try again');
        }
        let passwordIsOk: boolean = await this.encrypter.validatePassword(user.password, user.email)
        if(!passwordIsOk) {
            throw new LoginError('Please check your credentials and try again');
        }
        const token: string = this.jwt.createJwtToken(user.userName, user.email, savedUser.role);

        return new AuthResponseDTO(token, 'Logged in');
    }


    private dtoHasMissingFields(user: UncreatedUser): boolean {
        return !user.hasOwnProperty('email') || 
               !user.hasOwnProperty('userName') ||
               !user.hasOwnProperty('password') ||
                user.email === null || user.password === null ||
                user.userName === null || user.userName === '';
    }

    private emailIsCorrect(email: string): boolean {
        const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const pattern: RegExp = new RegExp(emailRegexPattern);
        return pattern.test(email);
    }

    private passwordIsCorrect(password: string): boolean {
        const passwordRegexPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const pattern: RegExp = new RegExp(passwordRegexPattern);
        return pattern.test(password);
    }

}

export default AuthServiceImplementation;