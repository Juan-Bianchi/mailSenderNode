import Mail from '../../models/Mail';
import Strategy from '../interface/Strategy'

class SendingPovider {
    private strategy: Strategy;

    public constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    public sendMail(mail: Mail): Promise<boolean> {
        return this.strategy.sendMail(mail);
    }
}

export default SendingPovider;