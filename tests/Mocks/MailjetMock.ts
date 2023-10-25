import PostVerbError from "../../src/errors/PostVerbError";
import Strategy from "../../src/mailProviders/interface/Strategy";
import Mail from "../../src/models/Mail";

class MailjetMock implements Strategy{

    public async sendMail(mail: Mail): Promise<boolean> {
        if(mail.message.includes('mailjetError')){
            return false;
        }
        return true;
    }
}

export default MailjetMock;