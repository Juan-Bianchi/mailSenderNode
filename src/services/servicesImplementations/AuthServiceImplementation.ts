import LoginDTO from "../../dtos/LoginDTO";
import EncrypterImpl from "../../encrypter/EncrypterImpl";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";

class AuthServiceImplementation implements AuthService {

    private userRepImpl: UserRepositoryImplementation;
    private encrypter: EncrypterImpl;

    public constructor (userRepImpl: UserRepositoryImplementation, encrypter: EncrypterImpl) {
        this.userRepImpl = userRepImpl;
        this.encrypter = encrypter;
    }

    public async register(newUser: RegisterDTO): Promise<boolean> {
        let userIsOk: boolean = newUser && Object.keys(newUser).length === 0;
        if(!userIsOk){
            throw new Error("Not valid user. Send again.");
        }
        if(this.registerDTOHasMissingFields(newUser)){
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


    login(): void {
        
    }
    logout(): void {
        throw new Error("Method not implemented.");
    }

    private registerDTOHasMissingFields(user: RegisterDTO): boolean {
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