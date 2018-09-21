import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISrp } from 'app/shared/model/srp.model';

type EntityResponseType = HttpResponse<ISrp>;
type EntityArrayResponseType = HttpResponse<ISrp[]>;

@Injectable({ providedIn: 'root' })
export class SrpService {
    private resourceUrl = SERVER_API_URL + 'api/srps';

    constructor(private http: HttpClient) {}

    create(srp: ISrp): Observable<EntityResponseType> {
        return this.http.post<ISrp>(this.resourceUrl, srp, { observe: 'response' });
    }

    update(srp: ISrp): Observable<EntityResponseType> {
        return this.http.put<ISrp>(this.resourceUrl, srp, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISrp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISrp[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
