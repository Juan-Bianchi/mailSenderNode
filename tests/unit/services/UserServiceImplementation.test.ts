import UserServiceImplementations from "../../../src/services/servicesImplementations/UserServiceImplementations";
import UserRepositoryMock from "../../Mocks/UserRepositoryMock";

const userRep: UserRepositoryMock = new UserRepositoryMock()
const userServ: UserServiceImplementations = new UserServiceImplementations(userRep);

describe('getUsers', ()=> {
    it('should get all users in the data base', async () => {
        expect.assertions(3);
        const users = await userServ.getAllUsers();
        expect(users).toHaveLength(2);
        expect(users[0].ownEmail).toEqual('fakemail88@mail.com');
        expect(users[1].ownEmail).toEqual('fakemail89@mail.com');
    })
})