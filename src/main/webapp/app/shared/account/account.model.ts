import {Custom} from './custom-account.model';

export class Account {
    public id: number;
    public name: string;
    public number: string;
    public username: string;
    public password: string;
    public notes?: string;
    public tags: Array<string>;
    public customs: Array<Custom>;
    public featured: boolean;
    public url: string;

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
        this.customs = new Array<Custom>();
        this.id = id ? id : 0;
        this.featured = false;
    }
}
