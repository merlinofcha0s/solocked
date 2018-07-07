import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBService } from './accounts-db.service';

@Component({
    selector: 'jhi-accounts-db-detail',
    templateUrl: './accounts-db-detail.component.html'
})
export class AccountsDBDetailComponent implements OnInit, OnDestroy {

    accountsDB: AccountsDB;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private accountsDBService: AccountsDBService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAccountsDBS();
    }

    load(id) {
        this.accountsDBService.find(id)
            .subscribe((accountsDBResponse: HttpResponse<AccountsDB>) => {
                this.accountsDB = accountsDBResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAccountsDBS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'accountsDBListModification',
            (response) => this.load(this.accountsDB.id)
        );
    }
}
