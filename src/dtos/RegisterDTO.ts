class RegisterDTO {
    private userName: string;
    private email: string;
    private password: string;

    public constructor(userName: string, email: string, password: string) {
        this.email = email;
        this.password = password;
        this.userName = userName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getUserName(): string {
        return this.userName;
    }

    public setPassword(password: string): void{
        this.password = password;
    }
}