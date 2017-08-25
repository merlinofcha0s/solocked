import { Account } from './account.model';
export class Accounts {
    public accounts: Array<Account>;
    public authenticationKey: string;
    public seq: number;

    constructor(
        accounts?: Array<Account>,
        authenticationKey?: string,
        seq?: number
    ) {
        this.accounts = accounts ? accounts : new Array<Account>();
        this.authenticationKey = authenticationKey ? authenticationKey : '';
        this.seq = seq ? seq : 0;
    }
}
