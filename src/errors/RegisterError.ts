class RegisterError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "RegisterError";
      }
}

export default RegisterError