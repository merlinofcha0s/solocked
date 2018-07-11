import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IPayment } from 'app/shared/model/payment.model';
import { Principal } from '../../core/auth/principal.service';
import { PaymentService } from 'app/entities/payment/payment.service';

@Component({
    selector: 'jhi-payment',
    templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit, OnDestroy {
    payments: IPayment[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private paymentService: PaymentService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.paymentService.query().subscribe(
            (res: HttpResponse<IPayment[]>) => {
                this.payments = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPayments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPayment) {
        return item.id;
    }

    registerChangeInPayments() {
        this.eventSubscriber = this.eventManager.subscribe('paymentListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
