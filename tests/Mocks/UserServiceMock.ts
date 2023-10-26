import { Role } from "@prisma/client";
import UserDTO from "../../src/dtos/UserDTO";
import User from "../../src/models/User";
import UserService from "../../src/services/UserService";

class UserServiceMock implements UserService {
    async getAllUsers(): Promise<UserDTO[]> {
        return [new UserDTO(new User('user@mail.com', 'user', 'password', [], Role.USER, 1)), new UserDTO(new User('user@mail.com', 'user', 'password', [], Role.USER, 2))]
    }

}

export default UserServiceMock;