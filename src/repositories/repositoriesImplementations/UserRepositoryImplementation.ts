import { PrismaClient, UserEntity } from "@prisma/client";
import UserRepository from "../UserRepository";
import MailRepositoryImplementation from "./MailRepositoryImplementation";
import User from "../../models/User";
import Mail from "../../models/Mail";



class UserRepositoryImplementation implements UserRepository {
    
    private prisma: PrismaClient;
    private mailRepositoryImpl: MailRepositoryImplementation;

    public constructor(prisma: PrismaClient, mailRepositoryImpl: MailRepositoryImplementation) {
        this.prisma = prisma;
        this.mailRepositoryImpl = mailRepositoryImpl;
    }

    public async getUsers(): Promise<User []> {
        try {
            const userEntities: UserEntity [] = await this.prisma.userEntity.findMany(); 
            const usersPromises: Promise<User>[] =  userEntities.map(async (userEntity) => {
                const mails: Mail [] = await this.mailRepositoryImpl.getMailsByUserId(userEntity.id);
                return new User(userEntity.email, userEntity.userName, userEntity.password,
                                mails, userEntity.role, userEntity?.id)
            });
    
            return Promise.all(usersPromises);
        }
        catch(e) {
            throw e;
        }
        finally {
            await this.prisma.$disconnect;
        }
    }

    public async getUserById(id: number): Promise<User | null> {
        try {
            const userEntity: UserEntity | null = await this.prisma.userEntity.findUnique({
                where: {
                    id: id
                }
            })
    
            if(!userEntity)
              return userEntity;
    
            const userPromise: Promise<User> = (async function (this: UserRepositoryImplementation, userEntity: UserEntity) {
                const mails: Mail [] = await this.mailRepositoryImpl.getMailsByUserId(userEntity.id);
                const user: User =  new User(userEntity.email, userEntity.userName, userEntity.password,
                mails, userEntity.role, userEntity.id);
        
                return user;
            
            }).call(this, userEntity)
            
            return userPromise;
        }
        catch(e) {
            throw e;
        }
        finally {
            await this.prisma.$disconnect;
        }
    }

}

export default UserRepositoryImplementation;