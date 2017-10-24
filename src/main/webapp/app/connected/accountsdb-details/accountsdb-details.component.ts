import {Subscription} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountsService} from './../../shared/account/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Account} from '../../shared/account/account.model';
import {MatSnackBar, MatSnackBarConfig, MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {AccountsdbDeleteComponent} from './accountsdb-delete/accountsdb-delete.component';
import {SnackComponent} from "../../shared/snack/snack.component";

@Component({
    selector: 'jhi-accountsdb-details',
    templateUrl: './accountsdb-details.component.html',
    styleUrls: ['./accountsdb-details.component.scss']
})
export class AccountsdbDetailsComponent implements OnInit, OnDestroy {

    private routeObservable: Subscription;
    account$: BehaviorSubject<Account>;
    private id: number;
    showPassword: boolean;
    tooltipPosition = 'above';

    constructor(private route: ActivatedRoute, private router: Router,
                private accountsService: AccountsService,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.routeObservable = this.route.params.subscribe((params) => {
            this.id = +params['id'];
            this.initAccountDetail(this.id);
        });
    }

    ngOnDestroy(): void {
        this.routeObservable.unsubscribe();
    }

    initAccountDetail(id: number) {
        this.account$ = this.accountsService.account$;
        this.accountsService.getAccount(id);
    }

    showHidePassword(showOrHide: boolean) {
        this.showPassword = showOrHide;
    }

    notifyCopyToClipboard(nameField: string) {
        // Translation
        const nameFieldTrans = this.translateService.instant(nameField);
        const textToast = this.translateService.instant('ninjaccountApp.accountsDB.details.toastMessage');

        // Config and show toast message
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;
        config.data = {icon: 'fa-check-circle-o', text: nameFieldTrans + ' ' + textToast}
        this.snackBar.openFromComponent(SnackComponent, config);

        // this.startTimeout();
    }

    startTimeout() {
        // Observable.timer(1000, 1000)
        //     .timeInterval()
        //     .pluck('interval')
        //     .take(5).subscribe(
        //     (x) => console.log(x),
        //     (e) => console.log(e),
        //     () => {
        //         this.clearClipboard();
        //         const config = new MdSnackBarConfig();
        //         config.duration = 3000;
        //         this.snackBar.open('Clipboard Cleared !', '', config);
        //     });
    }

    openConfirmationDeleteDialog(idAccounts: number) {
        this.dialog.open(AccountsdbDeleteComponent, {
            data: {
                id: idAccounts
            }
        });
    }
}
