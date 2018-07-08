import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IAccountsDB } from 'app/shared/model/accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-accounts-db-update',
    templateUrl: './accounts-db-update.component.html'
})
export class AccountsDBUpdateComponent implements OnInit {
    private _accountsDB: IAccountsDB;
    isSaving: boolean;

    users: IUser[];

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private accountsDBService: AccountsDBService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ accountsDB }) => {
            this.accountsDB = accountsDB;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.accountsDB.id !== undefined) {
            this.subscribeToSaveResponse(this.accountsDBService.update(this.accountsDB));
        } else {
            this.subscribeToSaveResponse(this.accountsDBService.create(this.accountsDB));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IAccountsDB>>) {
        result.subscribe((res: HttpResponse<IAccountsDB>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    get accountsDB() {
        return this._accountsDB;
    }

    set accountsDB(accountsDB: IAccountsDB) {
        this._accountsDB = accountsDB;
    }
}
