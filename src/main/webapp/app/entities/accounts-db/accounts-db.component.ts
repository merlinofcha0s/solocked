import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiAlertService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { IAccountsDB } from 'app/shared/model/accounts-db.model';
import { Principal } from 'app/core';
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
        private accountsDBService: AccountsDBService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.accountsDBService.query().subscribe(
            (res: HttpResponse<IAccountsDB[]>) => {
                this.accountsDBS = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
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

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
