import {AccountsService} from './../../shared/account/accounts.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Account} from '../../shared/account/account.model';
import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment, PlanType} from '../../entities/payment/payment.model';

@Component({
    selector: 'jhi-accountdb-home',
    templateUrl: './accountsdb-home.component.html',
    // styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit {

    accounts$: BehaviorSubject<Array<Account>>;
    payment$: BehaviorSubject<Payment>;
    filter: string;
    paymentType = PlanType;

    constructor(private accountsService: AccountsService, private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.initAccountsList();
        this.initPaymentService();
    }

    initAccountsList() {
        this.accounts$ = this.accountsService.accounts$;
        this.accountsService.getAccountsList();
    }

    initPaymentService() {
        this.payment$ = this.paymentService.payment$;
        this.paymentService.getPaymentByLogin();
    }

    onDelete(id: number) {
        this.accountsService.deleteAccount(id);
    }

}
