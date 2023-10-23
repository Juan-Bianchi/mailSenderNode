import { UserEntity, Role } from "@prisma/client";
import UserRepository from "../UserRepository";
import MailRepositoryImplementation from "./MailRepositoryImplementation";
import User from "../../models/User";
import Mail from "../../models/Mail";
import prisma from "../../../database/client";
import RegisterDTO from "../../dtos/RegisterDTO";
import ConstraintError from "../../errors/ConstraintError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    public async getUserById(id: number): Promise<User | null> {
        try {
            const userEntity: UserEntity | null = await prisma.userEntity.findUnique({
                where: {
                    id: id
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

    public async saveUser(newUser: RegisterDTO): Promise<UserEntity> {
        const role: Role = newUser.getUserName().toLocaleLowerCase().includes('admin')? Role.ADMIN: Role.USER;
        try {
            const user: UserEntity = await prisma.userEntity.create({
                data: {
                  userName: newUser.getUserName(),
                  email: newUser.getEmail(),
                  password: newUser.getPassword(),
                  role: role
                },
            })
            return user;
        }
        catch(error) {
            if(error instanceof PrismaClientKnownRequestError){
                console.log('prueba')
                throw new ConstraintError('User could not be registered, already a user with the email given.')
            }
            throw error;
        }
    }

    public async updateUser(user: User): Promise<UserEntity> {
        try {
            const userUpdated: UserEntity = await prisma.userEntity.update({
                where: {
                  email: user.getOwnEmail(),
                },
                data: {
                    userName: user.getUserName(),
                    email: user.getOwnEmail(),
                    password: user.getPassword(),
                    role: user.getRole()
                },
              })
              return userUpdated;
        }
        catch(error) {
            throw error;
        }
    }

}

export default UserRepositoryImplementation;