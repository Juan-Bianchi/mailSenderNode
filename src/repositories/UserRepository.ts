import User from '../models/User'

interface UserRepository {
    getUsers(): Promise<User []>;
    getUserById(id: number): Promise<User | null>;
}

export default UserRepository;