import {AccountsService} from './../../shared/account/accounts.service';
import {Account} from '../../shared/account/account.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Subscription} from 'rxjs/Subscription';
import {Principal} from '../../shared';

declare var $crisp: any;

@Component({
    selector: 'jhi-accountdb-home',
    templateUrl: './accountsdb-home.component.html',
    styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit, OnDestroy {

    featuredAccountsSub: Subscription;
    accountsSub: Subscription;
    accounts: Array<Account>;
    allAccountsPaginated: Array<Account>;
    featuredAccounts: Array<Account>;
    counter: number;
    pageSize = 2;

    seeAll = false;

    constructor(private accountsService: AccountsService,
                private paymentService: PaymentService,
                private principal: Principal) {
        this.counter = 0;
        this.allAccountsPaginated = new Array<Account>();
        this.featuredAccounts = new Array<Account>();
    }

    ngOnInit() {
        this.initAccountsList();
        this.paymentService.getPaymentByLogin();
        this.initCrispData();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
        this.featuredAccountsSub.unsubscribe();
    }

    initAccountsList() {
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;

            // In case of the user has clicked on the featured :
            // we have to update the list and set paginator at the exact same place as the user was
            if (this.counter !== 0) {
                this.allAccountsPaginated = new Array<Account>();
                this.pageSize = this.counter;
                this.counter = 0;
            }

            this.getNextPage();
        });

        this.featuredAccountsSub = this.accountsService.featuredAccounts$.subscribe((featuredAccounts) => {
            this.featuredAccounts = featuredAccounts;
        });

        this.accountsService.getAccountsList();
        this.accountsService.getFeaturedAccountsList();
    }

    getNextPage() {
        let offset = 0;
        for (let i = this.counter; i < this.accounts.length; i++) {
            this.allAccountsPaginated.push(this.accounts[i]);
            offset += 1;
            if (offset === this.pageSize) {
                break;
            }
        }
        this.counter += offset;
    }

    initCrispData() {
        this.principal.identity(true).then((account) => {
            $crisp.push(['set', 'user:nickname', account.login]);
        });
    }
}
