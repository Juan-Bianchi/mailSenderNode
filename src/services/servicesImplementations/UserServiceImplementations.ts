import UserDTO from "../../dtos/UserDTO";
import UserService from "../UserService";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";

const userRep = new UserRepositoryImplementation();

class UserServiceImplementations implements UserService {
    async getAllUsers(): Promise<UserDTO[]> {
        const usersDTO: UserDTO[] = (await userRep.getUsers()).map((user) => new UserDTO(user));
        return usersDTO;
    }
}

export default UserServiceImplementations;

