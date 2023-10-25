import MailRepositoryImplementation from "../src/repositories/repositoriesImplementations/MailRepositoryImplementation";
import Mail from "../src/models/Mail";
import MailSentDTO from "../src/dtos/MailSentDTO";
import UserRepositoryImplementation from "../src/repositories/repositoriesImplementations/UserRepositoryImplementation";
import RegisterDTO from "../src/dtos/RegisterDTO";

const setEnvironment:()=>void = () => {

    const userRep = new UserRepositoryImplementation();
    let registerDTO1: RegisterDTO = new RegisterDTO('adminTest', process.env.MY_MAIL as string, 'Test1234#');

    userRep.saveUser(registerDTO1);


    /*const mailRep = new MailRepositoryImplementation();
    let mailDto: MailSentDTO = new MailSentDTO(new Mail('Mail test', 'this is an example for testing', ['mockMail1@mail.com', 'mockMail2@mail.com'], new Date()));
    let mailDto2: MailSentDTO = new MailSentDTO(new Mail('Mail test 2', 'this is an example for testing', ['mockMail1@mail.com', 'mockMail2@mail.com'], new Date()));
    let mailDto3: MailSentDTO = new MailSentDTO(new Mail('Mail test 3', 'this is an example for testing', ['mockMail1@mail.com', 'mockMail2@mail.com'], new Date()));
    let registerDTO2: RegisterDTO = new RegisterDTO('userTest', 'testing@fake.com', 'Test1234#');*/
}

export default setEnvironment;