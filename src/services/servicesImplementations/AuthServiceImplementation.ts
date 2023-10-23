import AuthService from '../AuthService'
import LoginDTO from "../../dtos/LoginDTO";
import EncrypterImpl from "../../utils/EncrypterImpl";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";
import Jwtoken from "../../utils/Jwtoken";
import User from "../../models/User";
import AuthResponseDTO from '../../dtos/AuthResponseDTO';
import RegisterDTO from '../../dtos/RegisterDTO';
import UncreatedUser from '../../dtos/UncreatedUser.interface';
import LoginError from '../../errors/LoginError';
import RegisterError from '../../errors/RegisterError';
import prisma from '../../../database/client';


const userRep = new UserRepositoryImplementation();
const encrypter = new EncrypterImpl();
const jwt = new Jwtoken();


class AuthServiceImplementation implements AuthService {

    async register(newUser: RegisterDTO): Promise<boolean> {
        const transactionResult: boolean = await prisma.$transaction(async () => {
            let userIsOk: boolean = newUser && Object.keys(newUser).length !== 0;
            if(!userIsOk){
                throw new RegisterError("Not valid user. Send again.");
            }
            if(this.dtoHasMissingFields(newUser)){
                throw new RegisterError('There are missing fields. It is not possible to register the user.');
            }
            if(!this.emailIsCorrect) {
                throw new RegisterError('The email given is not correct. Please, provide a different one');
            }
            if(!this.passwordIsCorrect) {
                throw new RegisterError('Password requires 1 uppercase, 1 lowercase, 1 digit, 1 special character, min. 8 characters.');
            }
            newUser.password = await encrypter.encrypt(newUser.password);
            return await userRep.saveUser(newUser) !== null;
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
        const savedUser: User | null = await userRep.getUserByEmail(user.email);
        if(!savedUser) {
            throw new LoginError('Please check your credentials and try again');
        }
        const passwordIsOk: boolean = await encrypter.validatePassword(user.password, user.email)
        if(!passwordIsOk) {
            throw new LoginError('Please check your credentials and try again');
        }
        const token: string = jwt.createJwtToken(user.userName, user.email, savedUser.role);

        return new AuthResponseDTO(token);
    }


    logout(): void {
        throw new Error("Method not implemented.");
    }

    private dtoHasMissingFields(user: UncreatedUser): boolean {
        return !user.hasOwnProperty('email') || 
               !user.hasOwnProperty('userName') ||
               !user.hasOwnProperty('password') ||
                user.email === null || user.password === null ||
                user.userName === null;
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