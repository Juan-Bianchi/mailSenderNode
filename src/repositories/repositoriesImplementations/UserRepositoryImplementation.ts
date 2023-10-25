import { UserEntity, Role } from "@prisma/client";
import UserRepository from "../UserRepository";
import MailRepositoryImplementation from "./MailRepositoryImplementation";
import User from "../../models/User";
import Mail from "../../models/Mail";
import prisma from "../../../database/client";
import RegisterDTO from "../../dtos/RegisterDTO";
import DatabaseError from "../../errors/DatabaseError";

const mailRep = new MailRepositoryImplementation();

class UserRepositoryImplementation implements UserRepository {
    
    async getUsers(): Promise<User []> {
        const userEntities: UserEntity [] = await prisma.userEntity.findMany(); 
        const usersPromises: Promise<User>[] =  userEntities.map(async (userEntity) => {
            const mails: Mail [] = await mailRep.getMailsByUserId(userEntity.id);
            return new User(userEntity.email, userEntity.userName, userEntity.password,
                            mails, userEntity.role, userEntity?.id)
        });

        return Promise.all(usersPromises);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const userEntity: UserEntity | null = await prisma.userEntity.findUnique({
            where: {
                email: email
            }
        })

        if(!userEntity)
            return userEntity;

        const userPromise: User = await (async function (this: UserRepositoryImplementation, userEntity: UserEntity) {
            const mails: Mail [] = await mailRep.getMailsByUserId(userEntity.id);
            const user: User =  new User(userEntity.email, userEntity.userName, userEntity.password,
            mails, userEntity.role, userEntity.id);
    
            return user;
        
        }).call(this, userEntity)

        return userPromise;
        
    }

    async getUserById(id: number): Promise<User | null> {
        const userEntity: UserEntity | null = await prisma.userEntity.findUnique({
            where: {
                id: id
            }
        })

        if(!userEntity)
            return null;

        const userPromise: User = await (async function (this: UserRepositoryImplementation, userEntity: UserEntity) {
            const mails: Mail [] = await mailRep.getMailsByUserId(userEntity.id);
            const user: User =  new User(userEntity.email, userEntity.userName, userEntity.password,
            mails, userEntity.role, userEntity.id);
    
            return user;
        
        }).call(this, userEntity)
        
        return userPromise;

    }

    async saveUser(newUser: RegisterDTO): Promise<UserEntity> {
        const role: Role = newUser.userName.toLocaleLowerCase().includes('admin')? Role.ADMIN: Role.USER;
        try {
            const user: UserEntity = await prisma.userEntity.create({
                data: {
                  userName: newUser.userName,
                  email: newUser.email,
                  password: newUser.password,
                  role: role
                },
            })
            return user;
        }
        catch(error) {
            throw new DatabaseError('User could not be registered, already a user with the email given.')
        }
    }

    async updateUser(user: User): Promise<UserEntity> {
        const userUpdated: UserEntity = await prisma.userEntity.update({
            where: {
                email: user.ownEmail,
            },
            data: {
                userName: user.userName,
                email: user.ownEmail,
                password: user.password,
                role: user.role
            },
        })
        return userUpdated;
    }

}

export default UserRepositoryImplementation;