import { OperationAccountType } from 'app/shared/account/operation-account-type.enum';

export interface IAccountsDB {
    id?: number;
    initializationVector?: string;
    databaseContentType?: string;
    database?: any;
    nbAccounts?: number;
    sum?: string;
    userLogin?: string;
    userId?: number;
    operationAccountType?: OperationAccountType;
    salt?: string;
    verifier?: string;
}

export class AccountsDB implements IAccountsDB {
    constructor(
        public id?: number,
        public initializationVector?: string,
        public databaseContentType?: string,
        public database?: any,
        public nbAccounts?: number,
        public sum?: string,
        public userLogin?: string,
        public userId?: number,
        public operationAccountType?: OperationAccountType,
        public salt?: string,
        public verifier?: string
    ) {}
}
