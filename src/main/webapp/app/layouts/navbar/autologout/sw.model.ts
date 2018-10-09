export class SwModel {
    public state: string;
    public data: string;

    constructor(state: string, data?: string) {
        this.state = state;
        this.data = data;
    }
}
