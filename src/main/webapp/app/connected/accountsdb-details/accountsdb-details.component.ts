import {Subscription} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountsService} from './../../shared/account/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Account} from '../../shared/account/account.model';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

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
                private snackBar: MdSnackBar,
                private translateService: TranslateService) {
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

    onDelete(id: number) {
        this.accountsService.deleteAccount(id);
        this.router.navigate(['/accounts']);
    }

    showHidePassword(showOrHide: boolean) {
        this.showPassword = showOrHide;
    }

    notifyCopyToClipboard(nameField: string) {
        const config = new MdSnackBarConfig();
        config.duration = 3000;

        const nameFieldTrans = this.translateService.instant(nameField);
        const textToast = this.translateService.instant('ninjaccountApp.accountsDB.details.toastMessage');

        this.snackBar.open(nameFieldTrans + ' ' + textToast, '', config);
    }
}
