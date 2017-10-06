import {Subscription} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountsService} from './../../shared/account/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, ElementRef, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import {Account} from '../../shared/account/account.model';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ClipboardService} from "ngx-clipboard/dist";

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

    @ViewChild('clearClipboardElement')
    private clearClipboardElement: ElementRef;

    constructor(private route: ActivatedRoute, private router: Router,
                private accountsService: AccountsService,
                private snackBar: MdSnackBar,
                private translateService: TranslateService,
                private clipboard: ClipboardService,
                private renderer: Renderer) {
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
        // Translation
        const nameFieldTrans = this.translateService.instant(nameField);
        const textToast = this.translateService.instant('ninjaccountApp.accountsDB.details.toastMessage');

        // Config and show toast message
        const config = new MdSnackBarConfig();
        config.duration = 3000;
        this.snackBar.open(nameFieldTrans + ' ' + textToast, '', config);

        //this.startTimeout();
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
}
