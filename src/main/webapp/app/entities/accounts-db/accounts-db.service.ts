import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAccountsDB } from 'app/shared/model/accounts-db.model';

type EntityResponseType = HttpResponse<IAccountsDB>;
type EntityArrayResponseType = HttpResponse<IAccountsDB[]>;

@Injectable({ providedIn: 'root' })
export class AccountsDBService {
    private resourceUrl = SERVER_API_URL + 'api/accounts-dbs';

    constructor(private http: HttpClient) {}

    create(accountsDB: IAccountsDB): Observable<EntityResponseType> {
        return this.http.post<IAccountsDB>(this.resourceUrl, accountsDB, { observe: 'response' });
    }

    update(accountsDB: IAccountsDB): Observable<EntityResponseType> {
        return this.http.put<IAccountsDB>(this.resourceUrl, accountsDB, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IAccountsDB>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAccountsDB[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
