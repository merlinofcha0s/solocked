export interface ISrp {
    id?: number;
    salt?: string;
    verifier?: any;
    userLogin?: string;
    userId?: number;
}

export class Srp implements ISrp {
    constructor(public id?: number, public salt?: string, public verifier?: any, public userLogin?: string, public userId?: number) {}
}
