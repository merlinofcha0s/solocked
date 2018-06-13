export class CompletePayment {
    constructor(
        public paymentId: string,
        public payerId: string,
        public token: string
    ) {
    }
}
