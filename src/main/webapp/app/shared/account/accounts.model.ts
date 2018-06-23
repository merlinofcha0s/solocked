import { Account } from './account.model';
import {Version} from './version.enum';
import {OperationAccountType} from './operation-account-type.enum';

export class Accounts {
    public accounts: Array<Account>;
    public authenticationKey: string;
    public version: Version;
    public nbAccounts: number;
    public operationAccountType: OperationAccountType;

    constructor(
        accounts?: Array<Account>,
        authenticationKey?: string
    ) {
        this.accounts = accounts ? accounts : [];
        this.authenticationKey = authenticationKey ? authenticationKey : '';
        this.nbAccounts = 0;
    }
}
