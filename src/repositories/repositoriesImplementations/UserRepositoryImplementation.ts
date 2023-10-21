import { UserEntity, Role } from "@prisma/client";
import UserRepository from "../UserRepository";
import MailRepositoryImplementation from "./MailRepositoryImplementation";
import User from "../../models/User";
import Mail from "../../models/Mail";
import {prisma} from '../../index'
import RegisterDTO from "../../dtos/RegisterDTO";

const mailRep = new MailRepositoryImplementation();

class UserRepositoryImplementation implements UserRepository {
    
    public async getUsers(): Promise<User []> {
        try {
            const userEntities: UserEntity [] = await prisma.userEntity.findMany(); 
            const usersPromises: Promise<User>[] =  userEntities.map(async (userEntity) => {
                const mails: Mail [] = await mailRep.getMailsByUserId(userEntity.id);
                return new User(userEntity.email, userEntity.userName, userEntity.password,
                                mails, userEntity.role, userEntity?.id)
            });
    
            return Promise.all(usersPromises);
        }
        catch(e) {
            throw e;
        }
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            const userEntity: UserEntity | null = await prisma.userEntity.findUnique({
                where: {
                    email: email
                }
            })
    
            if(!userEntity)
              return userEntity;
    
            const userPromise: Promise<User> = (async function (this: UserRepositoryImplementation, userEntity: UserEntity) {
                const mails: Mail [] = await mailRep.getMailsByUserId(userEntity.id);
                const user: User =  new User(userEntity.email, userEntity.userName, userEntity.password,
                mails, userEntity.role, userEntity.id);
        
                return user;
            
            }).call(this, userEntity)
            
            return userPromise;
        }
        catch(e) {
            throw e;
        }

    }

    public async saveUser(newUser: RegisterDTO): Promise<boolean> {
        const role: Role = newUser.getUserName().toLocaleLowerCase().includes('admin')? Role.ADMIN: Role.USER;
        try {
            await prisma.userEntity.create({
                data: {
                  userName: newUser.getUserName(),
                  email: newUser.getEmail(),
                  password: newUser.getPassword(),
                  role: role,
                },
            })
            return true;
        }
        catch(e) {
            throw e;
        }
    }

}

export default UserRepositoryImplementation;