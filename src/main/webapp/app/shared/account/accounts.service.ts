import { Account } from './account.model';
import { Accounts } from './accounts.model';
import { Injectable } from '@angular/core';
import { AccountType } from './account-type.model';

@Injectable()
export class AccountsService {

    constructor() { }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        accountsInitialized.authenticationKey = this.getRandomString(22);
        const sampleAccount = new Account('username', 'password', 'title', AccountType.Default);
        accountsInitialized.accounts.push(sampleAccount);

        return accountsInitialized;
    }

    getRandomString(length: number) {
        let text = ''
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return text;
    }

}
