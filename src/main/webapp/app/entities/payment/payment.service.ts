import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {Payment} from './payment.model';
import {createRequestOption, Principal} from '../../shared';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentWarning} from './payment-warning.model';
import {PlanType} from './index';

export type EntityResponseType = HttpResponse<Payment>;

@Injectable()
export class PaymentService {

    private resourceUrl = SERVER_API_URL + 'api/payments';

    payment$: BehaviorSubject<Payment>;
    paymentWarning$: BehaviorSubject<PaymentWarning>;

    private _dataStore: {
        payment: Payment,
        paymentWarning: PaymentWarning;
    };

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils, private principal: Principal) {
        this._dataStore = {
            payment: new Payment(), paymentWarning: new PaymentWarning(false, true,
                true, '', false)
        };
        this.payment$ = new BehaviorSubject<Payment>(this._dataStore.payment);
        this.paymentWarning$ = new BehaviorSubject<PaymentWarning>(this._dataStore.paymentWarning);
    }

    create(payment: Payment): Observable<EntityResponseType> {
        const copy = this.convert(payment);
        return this.http.post<Payment>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(payment: Payment): Observable<EntityResponseType> {
        const copy = this.convert(payment);
        return this.http.put<Payment>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Payment>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Payment[]>> {
        const options = createRequestOption(req);
        return this.http.get<Payment[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<Payment[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Payment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Payment[]>): HttpResponse<Payment[]> {
        const jsonResponse: Payment[] = res.body;
        const body: Payment[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Payment.
     */
    private convertItemFromServer(payment: Payment): Payment {
        const copy: Payment = Object.assign({}, payment);
        copy.subscriptionDate = this.dateUtils
            .convertLocalDateFromServer(payment.subscriptionDate);
        copy.validUntil = this.dateUtils
            .convertLocalDateFromServer(payment.validUntil);
        return copy;
    }

    /**
     * Convert a Payment to a JSON which can be sent to the server.
     */
    private convert(payment: Payment): Payment {
        const copy: Payment = Object.assign({}, payment);
        copy.subscriptionDate = this.dateUtils
            .convertLocalDateToServer(payment.subscriptionDate);
        copy.validUntil = this.dateUtils
            .convertLocalDateToServer(payment.validUntil);
        return copy;
    }

    getPaymentByLogin() {
        if (this.isAuthenticatedAndNotAdmin()) {
            this.http.get(this.resourceUrl + '-by-login', {observe: 'response'})
                .map((res: HttpResponse<Payment>) => res.body)
                .subscribe((payment: Payment) => {
                    this._dataStore.payment = payment;
                    this.payment$.next(this._dataStore.payment);
                });
        }
    }

    isInPaymentWarning() {
        if (this.isAuthenticatedAndNotAdmin()) {
            this.payment$.subscribe((payment) => {
                if (payment.id !== undefined) {
                    let isInFreeMode = false;
                    let isPaid = true;
                    let isValid = true;
                    let warningMessage = '';
                    let hasToBeForbidden = false;
                    const isAuthenticatedAndNotAdmin = this.isAuthenticatedAndNotAdmin();
                    if (isAuthenticatedAndNotAdmin) {
                        if (payment.planType.toString() === PlanType.FREE) {
                            isInFreeMode = true;
                            isPaid = true;
                            isValid = true;
                            warningMessage = 'ninjaccountApp.payment.warningfreemode';
                        } else if (!payment.paid || this.accountNotValidUntil(payment)) {
                            isPaid = false;
                            isInFreeMode = false;
                            isValid = false;
                            hasToBeForbidden = true;
                            warningMessage = 'ninjaccountApp.payment.warningnotpaidmode';
                        }
                    }
                    const paymentWarning = new PaymentWarning(isInFreeMode, isPaid, isValid, warningMessage, hasToBeForbidden);
                    this._dataStore.paymentWarning = paymentWarning;
                    this.paymentWarning$.next(paymentWarning);
                } else {
                    this.getPaymentByLogin();
                }
            });
        }
    }

    accountNotValidUntil(payment: Payment): boolean {
        const validUntil = new Date(payment.validUntil);
        return validUntil < new Date();
    }

    isAuthenticatedAndNotAdmin(): boolean {
        return this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN']);
    }

    clean(): void {
        this._dataStore = {
            payment: new Payment(), paymentWarning: new PaymentWarning(false, true,
                true, '', false)
        };
        this.payment$.next(this._dataStore.payment);
        this.paymentWarning$.next(this._dataStore.paymentWarning);
    }
}
