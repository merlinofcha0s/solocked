import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Payment } from './payment.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class PaymentService {

    private resourceUrl = SERVER_API_URL + 'api/payments';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(payment: Payment): Observable<Payment> {
        const copy = this.convert(payment);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(payment: Payment): Observable<Payment> {
        const copy = this.convert(payment);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Payment> {
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

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Payment.
     */
    private convertItemFromServer(json: any): Payment {
        const entity: Payment = Object.assign(new Payment(), json);
        entity.subscriptionDate = this.dateUtils
            .convertLocalDateFromServer(json.subscriptionDate);
        return entity;
    }

    /**
     * Convert a Payment to a JSON which can be sent to the server.
     */
    private convert(payment: Payment): Payment {
        const copy: Payment = Object.assign({}, payment);
        copy.subscriptionDate = this.dateUtils
            .convertLocalDateToServer(payment.subscriptionDate);
        return copy;
    }
}
