import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBPopupService } from './accounts-db-popup.service';
import { AccountsDBService } from './accounts-db.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-accounts-db-dialog',
    templateUrl: './accounts-db-dialog.component.html'
})
export class AccountsDBDialogComponent implements OnInit {

    accountsDB: AccountsDB;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private accountsDBService: AccountsDBService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
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

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.accountsDB.id !== undefined) {
            this.subscribeToSaveResponse(
                this.accountsDBService.update(this.accountsDB));
        } else {
            this.subscribeToSaveResponse(
                this.accountsDBService.create(this.accountsDB));
        }
    }

    private subscribeToSaveResponse(result: Observable<AccountsDB>) {
        result.subscribe((res: AccountsDB) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: AccountsDB) {
        this.eventManager.broadcast({ name: 'accountsDBListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-accounts-db-popup',
    template: ''
})
export class AccountsDBPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private accountsDBPopupService: AccountsDBPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.accountsDBPopupService
                    .open(AccountsDBDialogComponent as Component, params['id']);
            } else {
                this.accountsDBPopupService
                    .open(AccountsDBDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
