export class PaymentWarning {
    constructor(
        public isInFreeMode: boolean,
        public isPaid: boolean,
        public isValid: boolean,
        public warningMessage: string,
        public hasToBeForbidden: boolean
    ) {

    }
}
