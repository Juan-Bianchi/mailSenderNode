import UserDTO from "../dtos/UserDTO";

interface UserService {
    getAllUsers(): Promise<UserDTO[]>
}

export default UserService;