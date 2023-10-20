import User from '../models/User'

interface UserRepository {
    getUsers(): Promise<User []>;
    getUserByEmail(email: string): Promise<User | null>;
    saveUser(newUser: RegisterDTO): Promise<boolean>;
}

export default UserRepository;