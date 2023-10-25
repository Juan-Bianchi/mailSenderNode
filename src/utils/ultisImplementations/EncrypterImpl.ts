import bcrypt from 'bcryptjs'
import PasswordValidationError from '../../errors/PasswordValidationError';
import Encrypter from '../Encrypter';
import UserRepository from '../../repositories/UserRepository';


class EncrypterImpl implements Encrypter{

    userRep: UserRepository;

    constructor(userRep: UserRepository) {
        this.userRep = userRep;
    }
        
    async encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async validatePassword(password: string, email: string): Promise<boolean> {
        const user = await this.userRep.getUserByEmail(email);
        if(!user)
            throw new PasswordValidationError('Email is not correct. Please verify')

        return bcrypt.compare(password, user.password);
    }
}

export default EncrypterImpl;