interface AuthService {
    register(newUser: RegisterDTO):Promise<boolean>;
    login():void;
    logout():void;
}