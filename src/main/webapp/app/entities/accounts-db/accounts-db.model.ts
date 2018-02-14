import {BaseEntity} from './../../shared';
import {OperationAccountType} from '../../shared/account/operation-account-type.enum';

export class AccountsDB implements BaseEntity {
    constructor(
        public id?: number,
        public initializationVector?: string,
        public databaseContentType?: string,
        public database?: any,
        public nbAccounts?: number,
        public sum?: string,
        public userId?: number,
        public operationAccountType?: OperationAccountType
    ) {
    }
}
