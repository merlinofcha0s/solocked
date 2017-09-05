import { Account } from './account.model';
import {Version} from './version.enum';

export class Accounts {
    public accounts: Array<Account>;
    public authenticationKey: string;
    public seq: number;
    public version: Version;

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
