import UncreatedUser from "./UncreatedUser.interface";

class RegisterDTO implements UncreatedUser {
    userName: string;
    email: string;
    password: string;

    public constructor(userName: string, email: string, password: string) {
        this.email = email;
        this.password = password;
        this.userName = userName;
    }

}

export default RegisterDTO;