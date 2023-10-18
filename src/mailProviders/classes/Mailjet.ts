import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import Strategy from '../interface/Strategy';
import Mail from '../../models/Mail';


class Mailjet implements Strategy{
    private mailjet: Client;
    private lastStatus: string;

    public constructor(){
        this.mailjet = new Client({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE
        });
        this.lastStatus = 'NOTHING SENT YET';
    }

    public async sendMail(mail: Mail): Promise<boolean> {

        try{
            const data: SendEmailV3_1.Body = {
                Messages: [
                    {
                    From: {
                        Email: 'pilot@test.com',
                    },
                    To: [
                        {
                        Email: 'passenger@test.com',
                        },
                    ],
                    TemplateErrorReporting: {
                        Email: 'reporter@test.com',
                        Name: 'Reporter',
                    },
                    Subject: 'Your email flight plan!',
                    HTMLPart: '<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
                    TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
                    },
                ],
                };
            
                const result: LibraryResponse<SendEmailV3_1.Response> = await this.mailjet
                        .post('send', { version: 'v3.1' })
                        .request(data);
            
                const {Status: status} = result.body.Messages[0];
                console.log(status);
                this.lastStatus = status.toLocaleUpperCase();
                return status.includes('201');
        }
        catch(e){
            throw e;
            return false;
        }
    }
}

export default Mailjet;