import Mail from '../models/Mail'

interface  MailRepository{
    
    getMailById(id: number): Promise<Mail | null>;
    getMailsByDateAndId(id: number, date: Date ) : Promise<Mail[]>;
    getMailsByUserId(userId: number): Promise<Mail[]>;
}

export default MailRepository;

