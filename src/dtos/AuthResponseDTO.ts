class AuthResponseDTO {
    token: string;

    public constructor(token: string) {
        this.token = token;
    }

}

export default AuthResponseDTO;