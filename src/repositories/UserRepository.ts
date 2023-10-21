import RegisterDTO from '../dtos/RegisterDTO';
import User from '../models/User'

interface UserRepository {
    getUsers(): Promise<User []>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    saveUser(newUser: RegisterDTO): Promise<boolean>;
    updateUser(user: User): Promise<void>;
}

export default UserRepository;