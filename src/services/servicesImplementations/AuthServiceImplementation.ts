import AuthService from '../AuthService'
import LoginDTO from "../../dtos/LoginDTO";
import EncrypterImpl from "../../encrypter/EncrypterImpl";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";
import Jwtoken from "../../authMiddleware/Jwtoken";
import User from "../../models/User";


class AuthServiceImplementation implements AuthService {

    private userRepImpl: UserRepositoryImplementation;
    private encrypter: EncrypterImpl;
    private jwt: Jwtoken;

    public constructor (userRepImpl: UserRepositoryImplementation, encrypter: EncrypterImpl, jwt: Jwtoken) {
        this.userRepImpl = userRepImpl;
        this.encrypter = encrypter;
        this.jwt = jwt;
    }

    public async register(newUser: RegisterDTO): Promise<boolean> {
        let userIsOk: boolean = newUser && Object.keys(newUser).length === 0;
        if(!userIsOk){
            throw new Error("Not valid user. Send again.");
        }
        if(this.dtoHasMissingFields(newUser)){
            throw new Error('There are missing fields. It is not possible to register the user.');
        }
        if(!this.emailIsCorrect) {
            throw new Error('The email given is not correct. Please, provide a different one');
        }
        if(!this.passwordIsCorrect) {
            throw new Error('Password requires 1 uppercase, 1 lowercase, 1 digit, 1 special character, min. 8 characters.');
        }
        newUser.setPassword(await this.encrypter.encrypt(newUser.getPassword()));
        return await this.userRepImpl.saveUser(newUser);
    }


    public async login(user: LoginDTO): Promise<AuthResponseDTO> {
        let userIsOk: boolean = user && Object.keys(user).length === 0;
        if(!userIsOk){
            throw new Error("Not valid user. Send again.");
        }
        if(this.dtoHasMissingFields(user)){
            throw new Error('There are missing fields. It is not possible to register the user.');
        }
        const savedUser: User | null = await this.userRepImpl.getUserByEmail(user.getEmail());
        if(!savedUser) {
            throw new Error('Please check your credentials and try again');
        }
        const passwordIsOk: boolean = await this.encrypter.validatePassword(user.getPassword(), user.getEmail())
        if(!passwordIsOk) {
            throw new Error('Please check your credentials and try again');
        }
        const token: string = this.jwt.createJwtToken(user.getUserName(), user.getEmail(), savedUser.getRole());

        return new AuthResponseDTO(token);
    }


    logout(): void {
        throw new Error("Method not implemented.");
    }

    private dtoHasMissingFields(user: RegisterDTO | LoginDTO): boolean {
        return !user.hasOwnProperty('email') || 
               !user.hasOwnProperty('userName') ||
               !user.hasOwnProperty('password') ||
               !user.getEmail() || !user.getPassword() ||
               !user.getUserName();
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