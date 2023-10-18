import UserDTO from "../../dtos/UserDTO";
import UserService from "../UserService";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";

class UserServiceImplementations implements UserService {
    private UserRepositoryImpl: UserRepositoryImplementation;

    public constructor(UserRepositoryImpl: UserRepositoryImplementation) {
        this.UserRepositoryImpl = UserRepositoryImpl;
    }

    public async getAllUsers(): Promise<UserDTO[]> {
        const usersDTO: UserDTO[] = (await this.UserRepositoryImpl.getUsers()).map(user => new UserDTO(user));
        return usersDTO;
    }
}

export default UserService;

