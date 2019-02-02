import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IAccountsDB } from 'app/shared/model/accounts-db.model';
import { AccountService } from 'app/core';
import { AccountsDBService } from './accounts-db.service';

@Component({
    selector: 'jhi-accounts-db',
    templateUrl: './accounts-db.component.html'
})
export class AccountsDBComponent implements OnInit, OnDestroy {
    accountsDBS: IAccountsDB[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected accountsDBService: AccountsDBService,
        protected jhiAlertService: JhiAlertService,
        protected dataUtils: JhiDataUtils,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.accountsDBService
            .query()
            .pipe(
                filter((res: HttpResponse<IAccountsDB[]>) => res.ok),
                map((res: HttpResponse<IAccountsDB[]>) => res.body)
            )
            .subscribe(
                (res: IAccountsDB[]) => {
                    this.accountsDBS = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInAccountsDBS();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IAccountsDB) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInAccountsDBS() {
        this.eventSubscriber = this.eventManager.subscribe('accountsDBListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
