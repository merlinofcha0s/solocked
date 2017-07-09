import { BaseEntity } from './../../shared';

export class AccountsDB implements BaseEntity {
    constructor(
        public id?: number,
        public database?: string,
        public userId?: number,
    ) {
    }
}
