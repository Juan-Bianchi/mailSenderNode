interface Encrypter {
    encrypt(password: string): Promise<string>;
    validatePassword(password: string, email: string): Promise<boolean>;
}

export default Encrypter;