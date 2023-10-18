import UserRepository from "../../repositories/UserRepository";
import MailService from "./MailServiceImplementation";
import User from "../../models/User";
import UserDTO from "../../dtos/UserDTO";
import UserService from "../UserService";

class UserServiceImplementations implements UserService {

    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getAllUsers(): Promise<UserDTO[]> {
        const usersDTO: UserDTO[] = (await this.userRepository.getUsers()).map(user => new UserDTO(user));
        return usersDTO;
    }
}

export default UserService;

