import UserDTO from "../../dtos/UserDTO";
import UserService from "../UserService";
import UserRepositoryImplementation from "../../repositories/repositoriesImplementations/UserRepositoryImplementation";
import UserRepository from "../../repositories/UserRepository";



class UserServiceImplementations implements UserService {

    userRep: UserRepository;

    constructor(userRep: UserRepository) {
        this.userRep = userRep;
    }

    async getAllUsers(): Promise<UserDTO[]> {
        const usersDTO: UserDTO[] = (await this.userRep.getUsers()).map((user) => new UserDTO(user));
        return usersDTO;
    }
}

export default UserServiceImplementations;

