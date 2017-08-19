import { AccountType } from './account-type.model';

export class Account {
    public name: string;
    public number: number;
    public username: string;
    public password: string;
    public loginURL?: string;
    public notes?: string;
    public contactURL?: string;
    public type: AccountType;

    constructor(
        username: string,
        password: string,
        name: string,
        type: AccountType
    ) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.type = type ? type : AccountType.Default;
    }
}
