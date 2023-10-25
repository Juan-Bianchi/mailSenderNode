import { $Enums, Role, UserEntity } from "@prisma/client";
import RegisterDTO from "../../src/dtos/RegisterDTO";
import User from "../../src/models/User";
import UserRepository from "../../src/repositories/UserRepository";
import Mail from "../../src/models/Mail";

class UserRepositoryMock implements UserRepository {

    async getUsers(): Promise<User[]> {
        return [new User('fakemail88@mail.com', 'fakeUser', 'fakePassword1%', 
        [new Mail('Testing', 'This is a testing email', ['testing1@mail.com', 'testing2@mail.com'], 
        new Date('2022-12-18T00:00:00'))], Role.USER, 10),
         new User('fakemail89@mail.com', 'fakeUser2', 'fakePassword1%', [], Role.USER, 11)]
    }

    async getUserByEmail(email: string): Promise<User | null> {
        let user1 = new User(email, 'fakeUser', '$2a$10$zEvaeCjMhOzxpBzIHyhmSuYRkFJi.nHhmjcs9/GwtwrFfZRP97qiO', [], Role.USER, 10);
        if(email.includes('error')) {
            user1.id = null;
            return user1;
        }
        if(email.includes('null')){
            return null;
        }
        if(email.includes('1000')){
            user1.id = 1000;
        }
        return user1;
    }

    async getUserById(id: number): Promise<User | null> {
        let user1 = new User('fakeMail@mail.com', 'fakeUser', 'fakePassword1%', [], Role.USER, id);
        if(id === 1000){
            return null;
        }
        return user1;
    }


    async saveUser(newUser: RegisterDTO): Promise<UserEntity> {
        if(newUser.email.includes('repeated')){
            throw new Error();
        }

        const userEntity: UserEntity = {
            id: 1,
            email: newUser.email,
            userName: newUser.userName,
            password: newUser.password,
            role: newUser.email.includes('admin')? Role.ADMIN: Role.USER
        }

        return userEntity;
    }


    async updateUser(user: User): Promise<UserEntity> {
        const userEntity: UserEntity = {
            id: 1,
            email: user.ownEmail,
            userName: user.userName,
            password: user.password,
            role: user.role
        }
        return userEntity;
    }

}

export default UserRepositoryMock;