import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
import { ParsedQs } from "qs";
import MailSentDTO from "../../src/dtos/MailSentDTO";
import MailService from "../../src/services/MailService";
import GetVerbError from "../../src/errors/GetVerbError";
import PostVerbError from "../../src/errors/PostVerbError";
import DatabaseError from "../../src/errors/DatabaseError";

class MailServiceMock implements MailService {

    async getMailsByDateAndId(id: number, date: Date): Promise<MailSentDTO[]> {
        console.log(id, date)
        throw new Error("Method not implemented.");
    }


    async getMailsByUserId(userId: number): Promise<MailSentDTO[]> {
        console.log(userId)
        throw new Error("Method not implemented.");
    }


    async sendMail(mail: MailSentDTO, email: string): Promise<boolean> {
        if(email.includes('null')){
            throw new GetVerbError('Not user found with this id.');
        }
        if(email.includes('1000')) {
            throw new PostVerbError('Mail could not be sent. You have exceeded the maximum amount of sent emails for today.');
        }
        if(mail.sender.includes('wrong')){
            throw new DatabaseError('Mail could not be sent. Please try again later');
        }
        if(mail.sender.includes('unknown')){
            throw new Error('Forbidden');
        }
        return true
    }


    buildDTO(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): MailSentDTO {
        console.log(req)
        throw new Error("Method not implemented.");
    }

}

export default MailServiceMock;