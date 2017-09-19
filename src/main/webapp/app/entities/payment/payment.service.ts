import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Payment } from './payment.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class PaymentService {

    private resourceUrl = 'api/payments';

    payment$: BehaviorSubject<Payment>;

    private _dataStore: {
        payment: Payment
    };

    constructor(private http: Http, private dateUtils: JhiDateUtils) {
        this._dataStore = {payment: new Payment()};
        this.payment$ = new BehaviorSubject<Payment>(this._dataStore.payment);
    }

    create(payment: Payment): Observable<Payment> {
        const copy = this.convert(payment);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(payment: Payment): Observable<Payment> {
        const copy = this.convert(payment);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Payment> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
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

    getPaymentByLogin() {
        this.http.get(this.resourceUrl + '-by-login')
            .map((res: Response) => this.convertResponse(res))
            .subscribe((resWrap: ResponseWrapper) => {
                this._dataStore.payment = resWrap.json;
                this.payment$.next(this._dataStore.payment);
            });
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.subscriptionDate = this.dateUtils
            .convertLocalDateFromServer(entity.subscriptionDate);
    }

    private convert(payment: Payment): Payment {
        const copy: Payment = Object.assign({}, payment);
        copy.subscriptionDate = this.dateUtils
            .convertLocalDateToServer(payment.subscriptionDate);
        return copy;
    }
}
