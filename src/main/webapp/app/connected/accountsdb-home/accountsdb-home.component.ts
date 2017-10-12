import {AccountsService} from './../../shared/account/accounts.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Account} from '../../shared/account/account.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment, PlanType} from '../../entities/payment/payment.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-accountdb-home',
    templateUrl: './accountsdb-home.component.html',
    styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit, OnDestroy {

    accounts$: BehaviorSubject<Array<Account>>;
    accountsSub: Subscription;
    accounts: Array<Account>;
    allAccountsPaginated: Array<Account>;
    counter: number;

    filter: string;

    constructor(private accountsService: AccountsService) {
        this.counter = 0;
        this.allAccountsPaginated = new Array<Account>();
    }

    ngOnInit() {
        this.initAccountsList();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
    }

    initAccountsList() {
        this.accounts$ = this.accountsService.accounts$;
        this.accountsService.getAccountsList();

        this.accountsSub = this.accounts$.subscribe((accounts) => {
            this.accounts = accounts;
            this.getNextPage();
        });
    }

    getNextPage() {
        let offset = 0;
        const pageSize = 2;
        for (let i = this.counter; i < this.accounts.length; i++) {
            this.allAccountsPaginated.push(this.accounts[i]);
            offset += 1;
            if (offset === pageSize) {
                break;
            }
        }
        this.counter += offset;
    }
}
