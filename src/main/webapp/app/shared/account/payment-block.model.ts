export class Payment {

    public date: Date;
    public amount: number;
    public method: string;
    public code: string;
    public notes: string;

    constructor(date: Date, amount: number, method: string, code: string, notes: string) {
        this.date = date;
        this.amount = amount;
        this.method = method;
        this.code = code;
        this.notes = notes;
    }
}
