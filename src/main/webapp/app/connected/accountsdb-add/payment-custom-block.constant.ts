export class PaymentCustomBlockConstant {
    private static _placeholderMethod = 'My method';
    private static _placeholderCode = 'MYCODE';
    private static _placeholderNotes = 'My notes !';

    constructor() {
    }

    static get placeholderMethod(): string {
        return this._placeholderMethod;
    }

    static get placeholderCode(): string {
        return this._placeholderCode;
    }

    static get placeholderNotes(): string {
        return this._placeholderNotes;
    }
}
