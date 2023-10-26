class AuthResponseDTO {
    token: string;
    status: string;

    public constructor(token: string, status: string) {
        this.token = token;
        this.status = status
    }

}

export default AuthResponseDTO;