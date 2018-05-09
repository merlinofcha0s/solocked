import {Component, Input, OnInit} from '@angular/core';
import {Account} from '../../../shared/account/account.model';
import {MatDialog} from '@angular/material';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {AccountsdbDeleteComponent} from '../../accountsdb-delete/accountsdb-delete.component';

@Component({
    selector: 'jhi-accountsdb-list',
    templateUrl: './accountsdb-list.component.html',
    styleUrls: ['./accountsdb-list.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({opacity: 0.0, transform: 'translateY(100%)'})),
            state('*', style({opacity: 1, transform: 'translateY(0)'})),
            transition('void => *, * => void', animate('200ms  ease-in-out'))
        ]),
        trigger('noResult', [
            state('void', style({opacity: 0.0, transform: 'translateX(100%)'})),
            state('*', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *, * => void', animate('400ms  ease-in-out'))
        ])
    ]
})
export class AccountsdbListComponent implements OnInit {

    @Input() accounts: Array<Account>;
    @Input() terms: string;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    openConfirmationDeleteDialog(idToDelete: number) {
        this.dialog.open(AccountsdbDeleteComponent, {
            data: {
                id: idToDelete
            }
        });
    }
}
