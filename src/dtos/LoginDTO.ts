class LoginDTO {
    private email: string;
    private userName: string;
    private password: string;

    public constructor(userName: string, email: string, password: string) {
        this.email = email;
        this.userName = userName;
        this.password = password;
    }

    public getEmail(): string {
        return this.email;
    }

    public getUserName(): string {
        return this.userName;
    }

    public getPassword(): string {
        return this.password;
    }
}

export default LoginDTO;