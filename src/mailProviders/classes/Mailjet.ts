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
            const recipients = mail.getRecipients().map(recipient => {
                return {
                    Email: `${recipient}`
                }
            });

            const data: SendEmailV3_1.Body = {
                Messages: [
                    {
                    From: {
                        Email: `${mail.getSender()?.getOwnEmail()}`,
                        Name: 'Mailjet Sender'
                    },
                    To: [
                        ... recipients
                    ],
                    
                    Subject: mail.getSubject(),
                    HTMLPart: '<h3>This is my note sender application!!</h3><br />May the delivery force be with you!',
                    TextPart: mail.getMessage(),
                    },
                ]
            };
            
            const result: LibraryResponse<SendEmailV3_1.Response> = await this.mailjet
                    .post('send', { version: 'v3.1' })
                    .request(data);

            return await (async ()=> {
                    const {Status: status} = result.body.Messages[0];
                    console.log(status);
                    this.lastStatus = status.toLocaleUpperCase();

                    return status.includes('success')
            })();
        }
        catch(e){
            throw e;
        }
    }
}

export default Mailjet;