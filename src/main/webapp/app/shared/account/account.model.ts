export class Account {
    public name: string;
    public number: number;
    public username: string;
    public password: string;
    public notes?: string;
    public tags: Array<string>;

    constructor(
        username: string,
        password: string,
        name: string
    ) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.tags = new Array<string>();
    }
}
