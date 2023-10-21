import Mail from "../../models/Mail";
import Strategy from "../interface/Strategy";
import sgMail from '@sendgrid/mail'


class Sendgrid implements Strategy {
    
    public constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
            throw new Error('SENDGRID_API_KEY is not defined in the environment.');
        }
        sgMail.setApiKey(apiKey);
    }

    public async sendMail(mail: Mail): Promise<boolean> {
        const msg = {
            to: mail.getRecipients(),
            from: `${mail.getSender()?.getOwnEmail()}`,
            subject: mail.getSubject(),
            text: mail.getMessage(),
            html: '<h3>This is my note sender application!!</h3><br />May the delivery force be with you!',
        };
        try {
            await sgMail.send(msg)
            return true;
        }
        catch (error: any) {
            if (error.response) {
                console.error(error.response.body)
            }
            return false;
        }
    }
}

export default Sendgrid;