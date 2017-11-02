import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {SERVER_API_URL} from '../../app.constants';

import {AccountsDB} from './accounts-db.model';
import {createRequestOption, ResponseWrapper} from '../../shared';

@Injectable()
export class AccountsDBService {

    private resourceUrl = SERVER_API_URL + 'api/accounts-dbs';

    constructor(private http: Http) { }

    create(accountsDB: AccountsDB): Observable<AccountsDB> {
        const copy = this.convert(accountsDB);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(accountsDB: AccountsDB): Observable<AccountsDB> {
        const copy = this.convert(accountsDB);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<AccountsDB> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    getDbUserConnected(): Observable<AccountsDB> {
        return this.http.get(`${this.resourceUrl}/getDbUserConnected`).map((res: Response) => {
            return res.json();
        });
    }

    updateDBUserConnected(accountsDB: AccountsDB): Observable<AccountsDB> {
        const copy = this.convert(accountsDB);
        return this.http.put(`${this.resourceUrl}/updateDbUserConnected`, copy).map((res: Response) => {
            if (res.ok) {
                return res.json();
            } else {
                return Observable.throw(res.statusText);
            }

        });
    }

    getActualMaxAccount(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'api/accounts-dbs/get-actual-max-account').map((res: Response) => res.json());
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to AccountsDB.
     */
    private convertItemFromServer(json: any): AccountsDB {
        const entity: AccountsDB = Object.assign(new AccountsDB(), json);
        return entity;
    }

    /**
     * Convert a AccountsDB to a JSON which can be sent to the server.
     */
    private convert(accountsDB: AccountsDB): AccountsDB {
        const copy: AccountsDB = Object.assign({}, accountsDB);
        return copy;
    }
}
