import { AccountType } from './account-type.model';

export class Account {
    public username?: string;
    public password?: string;
    public titre?: string;
    public type: AccountType;

    constructor(
        username?: any,
        password?: string,
        titre?: string,
        type?: AccountType
    ) {
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.titre = titre ? titre : null;
        this.type = type ? type : AccountType.ACCOUNT;
    }
}
