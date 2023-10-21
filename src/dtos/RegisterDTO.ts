import UncreatedUser from "./UncreatedUser.interface";

class RegisterDTO implements UncreatedUser {
    private userName: string;
    private email: string;
    private password: string;

    public constructor(userName: string, email: string, password: string) {
        this.email = email;
        this.password = password;
        this.userName = userName;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    public getUserName(): string {
        return this.userName;
    }

    public setPassword(password: string): void{
        this.password = password;
    }
}

export default RegisterDTO;