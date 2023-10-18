import { UserEntity, PrismaClient } from "@prisma/client";
import MailRepository from "./MailRepository";
import User from '../models/User'
import Mail from '../models/Mail'

class UserRepository {

    private prisma: PrismaClient;
    private mailRepository: MailRepository;

    public constructor(prisma: PrismaClient, mailRepository: MailRepository) {
        this.prisma = prisma;
        this.mailRepository = mailRepository;
    }

    public async getUsers(): Promise<User []> {

        const userEntities: UserEntity [] = await this.prisma.userEntity.findMany(); 
        const usersPromises: Promise<User>[] =  userEntities.map(async (userEntity) => {
            const mails: Mail [] = await this.mailRepository.getMailsByUserId(userEntity.id);
            return new User(userEntity.email, userEntity.userName, userEntity.password,
                            mails, userEntity.role, userEntity?.id)
        });

        return Promise.all(usersPromises);
    }

    public async getUserById(id: number): Promise<User | null> {
        const userEntity: UserEntity | null = await this.prisma.userEntity.findUnique({
            where: {
                id: id
            }
        })

        if(!userEntity)
          return userEntity;

        const userPromise: Promise<User> = (async function (this: UserRepository, userEntity: UserEntity) {
          const mails: Mail [] = await this.mailRepository.getMailsByUserId(userEntity.id);
          const user: User =  new User(userEntity.email, userEntity.userName, userEntity.password,
           mails, userEntity.role, userEntity.id);

           return user;
        }).call(this, userEntity)
        
        return userPromise;
    }
}

export default UserRepository;