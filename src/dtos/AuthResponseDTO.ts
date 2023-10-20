class AuthResponseDTO {
    private token: string;

    public constructor(token: string) {
        this.token = token;
    }

    public getToken(){
        return this.token;
    }
}