import AuthResponseDTO from "../dtos/AuthResponseDTO";
import LoginDTO from "../dtos/LoginDTO";
import RegisterDTO from "../dtos/RegisterDTO";

interface AuthService {
    register(newUser: RegisterDTO):Promise<boolean>;
    login(user: LoginDTO):Promise<AuthResponseDTO>;
    logout():void;
}

export default AuthService;