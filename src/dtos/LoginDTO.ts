class LoginDTO {
    private email: string;
    private userName: string;

    public constructor(userName: string, email: string) {
        this.email = email;
        this.userName = userName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getUserName(): string {
        return this.userName;
    }
}

export default LoginDTO;