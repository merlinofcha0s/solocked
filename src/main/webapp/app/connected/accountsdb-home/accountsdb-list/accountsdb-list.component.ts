import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {Router} from '@angular/router';

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
export class AccountsdbListComponent implements OnInit, OnChanges {

    @Input() accounts: Array<Account>;
    @Input() terms: string;

    indexKey: number;

    selected: Array<boolean>;

    constructor(public dialog: MatDialog,
                private router: Router) {
    }

    ngOnInit() {
        this.resetSelectorState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.terms) {
            this.resetSelectorState();
        }
    }

    openConfirmationDeleteDialog(idToDelete: number) {
        this.dialog.open(AccountsdbDeleteComponent, {
            data: {
                id: idToDelete
            }
        });
    }

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowDown') {
            this.onKeydown();
        }

        if (event.key === 'ArrowUp') {
            this.onKeyup();
        }

        if (event.key === 'Enter') {
            this.onEnter();
            event.preventDefault();
        }
    }

    onKeydown() {
        if (this.indexKey === this.accounts.length - 1) {
            this.indexKey = this.accounts.length - 1;
            this.selected[this.indexKey] = true;
        } else {
            if (this.indexKey === 0) {
                if (this.selected[this.indexKey]) {
                    this.selected[this.indexKey] = false;
                    this.indexKey++;
                }
                this.selected[this.indexKey] = true;

            } else {
                this.selected[this.indexKey] = false;
                this.indexKey++;
                this.selected[this.indexKey] = true;
            }
        }
    }

    onKeyup() {
        if (this.indexKey === 0) {
            this.indexKey = 0;
        } else {
            this.selected[this.indexKey] = false;
            this.indexKey--;
            this.selected[this.indexKey] = true;
        }
    }

    onEnter() {
        const accountSelected = this.accounts[this.indexKey];
        this.router.navigate(['/accounts/edit', accountSelected.id]);
    }

    resetSelectorState() {
        this.indexKey = 0;
        this.selected = [];
    }
}
