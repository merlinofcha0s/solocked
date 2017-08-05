import { Account } from './account.model';
export class Accounts {
    public accounts: Array<Account>;
    public authenticationKey: string;

    constructor(
        accounts?: Array<Account>,
        authenticationKey?: string
    ) {
        this.accounts = accounts ? accounts : new Array<Account>();
        this.authenticationKey = authenticationKey ? authenticationKey : '';
    }
}
