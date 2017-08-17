import { AccountType } from './account-type.model';

export class Account {
    public name: string;
    public number: number;
    public username: string;
    public password: string;
    public loginURL?: string;
    public notes?: string;
    public contactURL: string;
    public type: AccountType;

    constructor(
        username: any,
        password: string,
        name: string,
        type: AccountType
    ) {
        this.type = type ? type : AccountType.Default;
    }
}
