import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IAccountsDB } from 'app/shared/model/accounts-db.model';

@Component({
    selector: 'jhi-accounts-db-detail',
    templateUrl: './accounts-db-detail.component.html'
})
export class AccountsDBDetailComponent implements OnInit {
    accountsDB: IAccountsDB;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ accountsDB }) => {
            this.accountsDB = accountsDB;
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
}
