import bcrypt from 'bcryptjs'
import UserRepositoryImplementation from '../repositories/repositoriesImplementations/UserRepositoryImplementation';
import PasswordValidationError from '../errors/PasswordValidationError';

const userRep = new UserRepositoryImplementation();

class EncrypterImpl {
        
    async encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async validatePassword(password: string, email: string): Promise<boolean> {
        const user = await userRep.getUserByEmail(email);
        if(!user)
            throw new PasswordValidationError('Email is not correct. Please verify')

        return bcrypt.compare(password, user.password);
    }
}

export default EncrypterImpl;