class PasswordValidationError extends Error{
    name: string;
    
    constructor(message: string) {
        super(message);
        this.name = "PasswordValidationError";
      }
}

export default PasswordValidationError