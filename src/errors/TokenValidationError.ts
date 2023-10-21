class TokenValidationError extends Error{
    name: string;
    
    constructor(message: string) {
        super(message);
        this.name = "TokenValidationError";
      }
}

export default TokenValidationError