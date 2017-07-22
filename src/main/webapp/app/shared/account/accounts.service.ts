import { Account } from './account.model';
import { Accounts } from './accounts.model';
import { Injectable } from '@angular/core';
import { AccountType } from './account-type.model';

@Injectable()
export class AccountsService {

    constructor() { }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        const sampleAccount = new Account('username', 'password', 'title', AccountType.ACCOUNT);
        accountsInitialized.accounts.push(sampleAccount);

        return accountsInitialized;
    }

}
