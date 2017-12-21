import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBPopupService } from './accounts-db-popup.service';
import { AccountsDBService } from './accounts-db.service';

@Component({
    selector: 'jhi-accounts-db-delete-dialog',
    templateUrl: './accounts-db-delete-dialog.component.html'
})
export class AccountsDBDeleteDialogComponent {

    accountsDB: AccountsDB;

    constructor(
        private accountsDBService: AccountsDBService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.accountsDBService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'accountsDBListModification',
                content: 'Deleted an accountsDB'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-accounts-db-delete-popup',
    template: ''
})
export class AccountsDBDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private accountsDBPopupService: AccountsDBPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.accountsDBPopupService
                .open(AccountsDBDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
