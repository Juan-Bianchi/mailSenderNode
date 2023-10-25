import { Role, UserEntity } from "@prisma/client";
import prisma from "../../../database/client";
import RegisterDTO from "../../../src/dtos/RegisterDTO";
import UserRepositoryImplementation from "../../../src/repositories/repositoriesImplementations/UserRepositoryImplementation";
import User from "../../../src/models/User";
import DatabaseError from "../../../src/errors/DatabaseError";

const userRep = new UserRepositoryImplementation();
let userEntity: UserEntity;
let userEntity2: UserEntity;
let user: User | null;
let user2: User | null;
let registerDTO : RegisterDTO = new RegisterDTO('fakeUser', 'fakeMail@mail.com', 'Test1234#');
let registerDTO2 : RegisterDTO = new RegisterDTO('fakeUserAdmin', 'fakeMail1@mail.com', 'Test1234#');


afterAll( async ()=> {
    await prisma.mailEntity.deleteMany();
    await prisma.userEntity.deleteMany();
})



describe('saveUser', ()=> {
    it('should save and give a role fullfiling the business logic', async () => {
        expect.assertions(5);
        userEntity = await userRep.saveUser(registerDTO) as UserEntity; //Role User
        userEntity2 = await userRep.saveUser(registerDTO2) as UserEntity; //Role Admin

        expect(userEntity.userName).toEqual(registerDTO.userName);
        expect(userEntity.email).toEqual(registerDTO.email);
        expect(userEntity.password).toEqual(registerDTO.password);
        expect(userEntity.role).toEqual(Role.USER);
        expect(userEntity2.role).toEqual(Role.ADMIN);
    })
})

describe('saveUser', ()=> {
    it('should throw when an error occours', async () => {
        expect.assertions(1);
        await expect(userRep.saveUser(registerDTO)).rejects.toThrow(DatabaseError) // user already saved
    })
})

describe('getUsers', ()=> {
    it('should get all users in the data base', async () => {
        expect.assertions(3);
        const users = await userRep.getUsers();
        expect(users).toHaveLength(2);
        expect(users[0].ownEmail).toEqual('fakeMail@mail.com');
        expect(users[1].ownEmail).toEqual('fakeMail1@mail.com');
    })
})

describe('getUserByEmail', ()=> {
    it('should get a unique user found using the email in the data base', async () => {
        userEntity = await userRep.saveUser(new RegisterDTO('fakeUser', 'fakeMail5@mail.com', 'Test1234#')) as UserEntity;

        expect.assertions(1);
        expect((await userRep.getUserByEmail(userEntity.email) as User).id).toEqual(userEntity.id);
    })
})

describe('getUserByEmail', ()=> {
    it('should get a null when not found the email in the data base', async () => {
        const response = await userRep.getUserByEmail('fakemail');  // not existing email
        expect(response).toBeNull;
    })
})

describe('getUserById', ()=> {
    it('should get a unique user found using the id in the data base', async () => {
        userEntity2 = await userRep.saveUser(new RegisterDTO('fakeUser', 'fakeMail6@mail.com', 'Test1234#')) as UserEntity;
        expect.assertions(1);
        expect((await userRep.getUserById(userEntity2.id) as User).id as number).toEqual(userEntity2.id);
    })
})

describe('getUserById', ()=> {
    it('should get a null when not found the id in the data base', async () => {
        const response = await userRep.getUserById(8888888);  // not existing id
        expect(response).toBeNull;
    })
})

describe('updateUser', ()=> {
    it('should update a user in the data base', async ()=> {
        user2 = await userRep.getUserById(userEntity2.id);
        if (user2 != null) {
            expect.assertions(3);
            expect(user2.role = Role.ADMIN) // it was previously an ADMIN
            user2.role = Role.USER // change role and then update
            userEntity2 = await userRep.updateUser(user2);
            expect(userEntity2.id).toEqual(user2.id);
            expect(userEntity2.email).toEqual(user2.ownEmail);
            expect(userEntity2.role).toEqual(user2.role);
        }
    })
})

