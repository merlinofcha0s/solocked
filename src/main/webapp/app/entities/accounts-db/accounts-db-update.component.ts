import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IAccountsDB } from 'app/shared/model/accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-accounts-db-update',
    templateUrl: './accounts-db-update.component.html'
})
export class AccountsDBUpdateComponent implements OnInit {
    accountsDB: IAccountsDB;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected dataUtils: JhiDataUtils,
        protected jhiAlertService: JhiAlertService,
        protected accountsDBService: AccountsDBService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ accountsDB }) => {
            this.accountsDB = accountsDB;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
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

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountsDB>>) {
        result.subscribe((res: HttpResponse<IAccountsDB>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
