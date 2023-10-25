import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
import { ParsedQs } from "qs";
import MailSentDTO from "../../src/dtos/MailSentDTO";
import MailService from "../../src/services/MailService";

class MailServiceMock implements MailService {

    getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        throw new Error("Method not implemented.");
    }
    getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        throw new Error("Method not implemented.");
    }
    sendMail(mail: MailSentDTO, email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    buildDTO(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): MailSentDTO {
        throw new Error("Method not implemented.");
    }

}

export default MailServiceMock;