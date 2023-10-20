import LoginDTO from "../dtos/LoginDTO";

interface AuthService {
    register(newUser: RegisterDTO):Promise<boolean>;
    login(user: LoginDTO):Promise<AuthResponseDTO>;
    logout():void;
}

export default AuthService;