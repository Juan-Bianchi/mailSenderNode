import Strategy from "../../src/mailProviders/interface/Strategy";
import Mail from "../../src/models/Mail";

class SendgridMock implements Strategy {
    
    public async sendMail(mail: Mail): Promise<boolean> {
        if(mail.subject.includes('mailjetErrorSendgrid')){
            return false;
        }
        return true;
    }
}

export default SendgridMock;