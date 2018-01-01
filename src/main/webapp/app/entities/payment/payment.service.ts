import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {JhiDateUtils} from 'ng-jhipster';
import { SERVER_API_URL } from '../../app.constants';

import {Payment} from './payment.model';
import {createRequestOption, ResponseWrapper} from '../../shared';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PaymentService {

    private resourceUrl =  SERVER_API_URL + 'api/payments';

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

    getPaymentByLogin() {
        this.http.get(this.resourceUrl + '-by-login')
            .map((res: Response) => res.json())
            .subscribe((payment: Payment) => {
                this._dataStore.payment = payment;
                this.payment$.next(this._dataStore.payment);
            });
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
