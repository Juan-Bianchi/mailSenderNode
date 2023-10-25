import PasswordValidationError from "../../../src/errors/PasswordValidationError";
import EncrypterImpl from "../../../src/utils/ultisImplementations/EncrypterImpl";
import UserRepositoryMock from "../../Mocks/UserRepositoryMock";
import bcrypt from 'bcryptjs'

const userRep: UserRepositoryMock = new UserRepositoryMock();
const encrypter: EncrypterImpl = new EncrypterImpl(userRep);

describe('validatePassword', ()=> {
    it('should return if the password provided belongs to the user', async () => {
        expect.assertions(1);
        expect(await encrypter.validatePassword('Aa12345@', 'encryptedUser@mail.com')).toEqual(true);
    })
})

describe('validatePassword', ()=> {
    it('should throw if email does not belong to any user', async () => {
        expect.assertions(1);
        await expect(encrypter.validatePassword('fakePassword1%', 'null@mail.com')).rejects.toThrow(PasswordValidationError);
    })
})

describe('encrypt', ()=> {
    it('should return the encrypted password prevously provided', async () => {
        expect.assertions(1);
        let encryptedPassword = await encrypter.encrypt('Aa12345@')
        expect(await bcrypt.compare('Aa12345@', encryptedPassword) ).toEqual(true);
    })
})