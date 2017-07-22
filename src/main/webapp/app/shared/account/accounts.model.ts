import { Account } from './account.model';
export class Accounts {
    public accounts: Array<Account>;

    constructor(
        accounts?: Array<Account>
    ) {
        this.accounts = accounts ? accounts : new Array<Account>();
    }
}
