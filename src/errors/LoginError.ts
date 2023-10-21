class LoginError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "LoginError";
      }
}

export default LoginError