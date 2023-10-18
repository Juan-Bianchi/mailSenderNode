import Mail from "../../models/Mail";

interface Strategy {
    sendMail(mail: Mail): Promise<boolean>;
}

export default Strategy;