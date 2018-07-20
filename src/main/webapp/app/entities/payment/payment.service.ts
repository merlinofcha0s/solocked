import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPayment, Payment, PlanType } from 'app/shared/model/payment.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaymentWarning } from 'app/entities/payment/payment-warning.model';
import { JhiDateUtils } from 'ng-jhipster';
import { Principal } from '../../core/auth/principal.service';
import { ReturnPayment } from 'app/account/register/dto/return-payment.model';
import { InitPayment } from 'app/account/register/dto/init-payment.model';
import { CompletePayment } from 'app/account/register/dto/complete-payment.model';

type EntityResponseType = HttpResponse<IPayment>;
type EntityArrayResponseType = HttpResponse<IPayment[]>;

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private resourceUrl = SERVER_API_URL + 'api/payments';

    payment$: BehaviorSubject<Payment>;
    paymentWarning$: BehaviorSubject<PaymentWarning>;

    private _dataStore: {
        payment: Payment;
        paymentWarning: PaymentWarning;
    };

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils, private principal: Principal) {
        this._dataStore = {
            payment: new Payment(),
            paymentWarning: new PaymentWarning(false, true, true, '', false)
        };
        this.payment$ = new BehaviorSubject<Payment>(this._dataStore.payment);
        this.paymentWarning$ = new BehaviorSubject<PaymentWarning>(this._dataStore.paymentWarning);
    }

    create(payment: IPayment): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(payment);
        return this.http
            .post<IPayment>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(payment: IPayment): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(payment);
        return this.http
            .put<IPayment>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPayment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPayment[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(payment: IPayment): IPayment {
        const copy: IPayment = Object.assign({}, payment, {
            subscriptionDate:
                payment.subscriptionDate != null && payment.subscriptionDate.isValid()
                    ? payment.subscriptionDate.format(DATE_FORMAT)
                    : null,
            validUntil: payment.validUntil != null && payment.validUntil.isValid() ? payment.validUntil.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.subscriptionDate = res.body.subscriptionDate != null ? moment(res.body.subscriptionDate) : null;
        res.body.validUntil = res.body.validUntil != null ? moment(res.body.validUntil) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((payment: IPayment) => {
            payment.subscriptionDate = payment.subscriptionDate != null ? moment(payment.subscriptionDate) : null;
            payment.validUntil = payment.validUntil != null ? moment(payment.validUntil) : null;
        });
        return res;
    }

    getPaymentByLogin() {
        if (this.isAuthenticatedAndNotAdmin()) {
            this.http
                .get(this.resourceUrl + '-by-login', { observe: 'response' })
                .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res), map((res: HttpResponse<IPayment>) => res.body)))
                .subscribe((payment: HttpResponse<IPayment>) => {
                    this._dataStore.payment = payment.body;
                    this.payment$.next(this._dataStore.payment);
                    this.isInPaymentWarning();
                });
        }
    }

    isInPaymentWarning() {
        const payment = this._dataStore.payment;
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
    }

    accountNotValidUntil(payment: Payment): boolean {
        const validUntil = payment.validUntil.toDate();
        return validUntil < new Date();
    }

    isAuthenticatedAndNotAdmin(): boolean {
        return this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN']);
    }

    clean(): void {
        const newPayment = new Payment();
        newPayment.id = 0;
        newPayment.planType = PlanType.UNKNOWN;

        this._dataStore = {
            payment: newPayment,
            paymentWarning: new PaymentWarning(false, true, true, '', false)
        };
        this.payment$.next(this._dataStore.payment);
        this.paymentWarning$.next(this._dataStore.paymentWarning);
    }

    initOneTimePaymentWorkflow(planType: PlanType, login: string): Observable<HttpResponse<ReturnPayment>> {
        const initPaymentDTO = new InitPayment(planType, login);
        return this.http.post<ReturnPayment>('api/init-one-time-payment', initPaymentDTO, { observe: 'response' });
    }

    completeOneTimePaymentWorkflow(paymentId: string, payerId: string): Observable<HttpResponse<ReturnPayment>> {
        const completePaymentDTO = new CompletePayment(paymentId, payerId, '');
        return this.http.post<ReturnPayment>('api/complete-one-time-payment', completePaymentDTO, { observe: 'response' });
    }

    initRecurringPaymentWorkflow(planType: PlanType): Observable<HttpResponse<ReturnPayment>> {
        const initPaymentDTO = new InitPayment(planType);
        return this.http.post<ReturnPayment>('api/init-recurring-payment', initPaymentDTO, { observe: 'response' });
    }

    completeRecurringPaymentWorkflow(token: string): Observable<HttpResponse<ReturnPayment>> {
        const completePaymentDTO = new CompletePayment('', '', token);
        return this.http.post<ReturnPayment>('api/complete-recurring-payment', completePaymentDTO, { observe: 'response' });
    }

    cancelRecurringPaymentWorkflow(): Observable<HttpResponse<ReturnPayment>> {
        return this.http.post<ReturnPayment>('api/cancel-recurring-payment', null, { observe: 'response' });
    }
}
