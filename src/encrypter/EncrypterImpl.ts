import bcrypt from 'bcryptjs'
import UserRepositoryImplementation from '../repositories/repositoriesImplementations/UserRepositoryImplementation';


class EncrypterImpl {
    
    private userRepository: UserRepositoryImplementation;

    public constructor(userRepository: UserRepositoryImplementation) {
      this.userRepository = userRepository;
    }
    
    public async encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async validatePassword(password: string, email: string): Promise<boolean> {
        const encryptedPass = await this.userRepository.getUserByEmail(email);
        if(!encryptedPass)
            throw new Error('Email is not correct. Please verify')

        return bcrypt.compare(password, encryptedPass.getOwnEmail());
    }
}

export default EncrypterImpl;