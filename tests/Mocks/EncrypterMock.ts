import PasswordValidationError from "../../src/errors/PasswordValidationError";
import Encrypter from "../../src/utils/Encrypter";

class EncrypterMock implements Encrypter {

    async encrypt(password: string): Promise<string> {
        return `${password}encrypted`;
    }

    async validatePassword(password: string, email: string): Promise<boolean> {
        if(password.includes('error')){
            throw new PasswordValidationError('Email is not correct. Please verify')
        }
        return !email.includes('badPass');
    }
}

export default EncrypterMock;