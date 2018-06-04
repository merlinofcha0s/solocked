export class ReturnPayment {
    constructor(
        public status: string,
        public returnUrl: string,
        public id: string
    ) {
    }
}
