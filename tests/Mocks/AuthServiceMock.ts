import AuthResponseDTO from "../../src/dtos/AuthResponseDTO";
import LoginDTO from "../../src/dtos/LoginDTO";
import RegisterDTO from "../../src/dtos/RegisterDTO";
import DatabaseError from "../../src/errors/DatabaseError";
import LoginError from "../../src/errors/LoginError";
import PasswordValidationError from "../../src/errors/PasswordValidationError";
import RegisterError from "../../src/errors/RegisterError";
import TokenValidationError from "../../src/errors/TokenValidationError";
import AuthService from "../../src/services/AuthService";



class AuthServiceMock implements AuthService {

    async register(newUser: RegisterDTO): Promise<boolean> {
        if(newUser.email.includes('register')) {
            throw new RegisterError("Register error");
        }
        if(newUser.email.includes('database')) {
            throw new DatabaseError("Database error");
        }
        if(newUser.userName.includes('unknown')) {
            throw new Error('Unknown error');
        }
        return true;
    }

    async login(user: LoginDTO): Promise<AuthResponseDTO> {
        if(user.password.includes('password')) {
            throw new PasswordValidationError("Password error");
        }
        if(user.email.includes('login')) {
            throw new LoginError("Login error");
        }
        if(user.email.includes('token')) {
            throw new TokenValidationError("Token error");
        }
        if(user.userName.includes('unknown')) {
            throw new Error('Unknown error');
        }
        const token: string = 'token';

        return new AuthResponseDTO(token, 'Logged in');
    }

}

export default AuthServiceMock