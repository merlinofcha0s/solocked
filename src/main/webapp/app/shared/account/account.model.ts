export class Account {
    public id: number;
    public name: string;
    public number: number;
    public username: string;
    public password: string;
    public notes?: string;
    public tags: Array<string>;

    constructor(
        username: string,
        password: string,
        name: string,
        id?: number
    ) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.tags = new Array<string>();
        this.id = id ? id : 0;
    }
}
