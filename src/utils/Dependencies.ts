import Mailjet from "../mailProviders/classes/Mailjet";
import Sendgrid from "../mailProviders/classes/Sendgrid";
import Strategy from "../mailProviders/interface/Strategy";
import MailRepository from "../repositories/MailRepository";
import UserRepository from "../repositories/UserRepository";
import MailRepositoryImplementation from "../repositories/repositoriesImplementations/MailRepositoryImplementation";
import UserRepositoryImplementation from "../repositories/repositoriesImplementations/UserRepositoryImplementation";
import AuthService from "../services/AuthService";
import MailService from "../services/MailService";
import UserService from "../services/UserService";
import AuthServiceImplementation from "../services/servicesImplementations/AuthServiceImplementation";
import MailServiceImplementation from "../services/servicesImplementations/MailServiceImplementation";
import UserServiceImplementations from "../services/servicesImplementations/UserServiceImplementations";
import Encrypter from "./Encrypter";
import EncrypterImpl from "./ultisImplementations/EncrypterImpl";
import JwtokenImpl from "./ultisImplementations/JwtokenImpl";


let mailService: MailService;
let userService: UserService;
let authService: AuthService;
let userRep: UserRepository;
let encrypter: Encrypter;
const jwt: JwtokenImpl = new JwtokenImpl();
let mailRep: MailRepository;
let mailjet: Strategy;
let sendgrid: Strategy;


userRep = new UserRepositoryImplementation()
encrypter = new EncrypterImpl(userRep);
authService = new AuthServiceImplementation(userRep, encrypter, jwt);
mailRep = new MailRepositoryImplementation();
mailjet = new Mailjet();
sendgrid = new Sendgrid();
mailService = new MailServiceImplementation(mailRep, userRep, mailjet, sendgrid);
userService = new UserServiceImplementations(userRep);

export{authService, userService, mailService}