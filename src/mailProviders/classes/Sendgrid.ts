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
        try {
            const msg = {
                to: 'test@example.com',
                from: 'test@example.com',
                subject: 'Sending with Twilio SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
            await sgMail.send(msg);
            return true;
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
            return false;
        }
    }
}