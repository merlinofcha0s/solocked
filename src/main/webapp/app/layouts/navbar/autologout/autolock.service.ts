import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isUndefined } from 'util';
import { LoginService } from '../../../core/login/login.service';
import { AccountsDBService } from 'app/entities/accounts-db';
import { ServiceWorkerService } from 'app/shared/sw/service-worker.service';
import { SwModel } from 'app/layouts/navbar/autologout/sw.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutolockService {
    totalTime = 600;
    remainingTime$: BehaviorSubject<number>;
    timerSubscription: Subscription;
    autoSaveWaiting: boolean;
    isOnAddAccountPage: boolean;

    private _dataStore: {
        remainingTime: number;
    };

    constructor(
        private loginService: LoginService,
        private router: Router,
        private addAccountService: AccountsDBService,
        private swService: ServiceWorkerService
    ) {
        this._dataStore = { remainingTime: this.totalTime };
        this.remainingTime$ = new BehaviorSubject<number>(this._dataStore.remainingTime);

        // Case where the user logout, we can't unsubscribe when logout cause of circular dependencies
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/') {
                    if (!isUndefined(this.timerSubscription)) {
                        this.timerSubscription.unsubscribe();
                    }
                }
            }
        });

        this.addAccountService.autoSaveCurrentAccount$.subscribe(state => {
            if (state === 'end') {
                this.autoLogout();
            }
        });

        this.swService.swReceiver$.subscribe((autolockModel: SwModel) => {
            switch (autolockModel.state) {
                case 'countdown':
                    this.remainingTime$.next(Number(autolockModel.data));
                    break;
                case 'logout':
                    this.autoLogout();
            }
        });
    }

    startTimer() {
        this.swService.sendMessageToSwByObject(new SwModel('start-autolock'));
    }

    private autoLogout() {
        if (this.router.url === '/accounts/add' && !this.autoSaveWaiting) {
            this.autoSaveWaiting = true;
            this.addAccountService.autoSaveCurrentAccount$.next('init');
        } else {
            this.autoSaveWaiting = false;
            this.loginService.logout();
            this.router.navigate(['']);
        }
    }

    resetTimer() {
        this.swService.sendMessageToSwByObject(new SwModel('reset-autolock'));
    }
}
