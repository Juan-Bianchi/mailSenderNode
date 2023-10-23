import UncreatedUser from "./UncreatedUser.interface";

class LoginDTO implements UncreatedUser{
    email: string;
    userName: string;
    password: string;

    public constructor(userName: string, email: string, password: string) {
        this.email = email;
        this.userName = userName;
        this.password = password;
    }

}

export default LoginDTO;