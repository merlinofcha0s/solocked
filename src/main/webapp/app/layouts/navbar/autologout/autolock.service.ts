import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'util';
import { LoginService } from '../../../core/login/login.service';
import { AccountsDBService } from 'app/entities/accounts-db';

@Injectable({ providedIn: 'root' })
export class AutolockService {
    totalTime = 600;
    remainingTime$: BehaviorSubject<number>;
    timer: Observable<number>;
    timerSubscription: Subscription;

    isOnAddAccountPage: boolean;

    private _dataStore: {
        remainingTime: number;
    };

    constructor(
        private loginService: LoginService,
        private router: Router,
        private addAccountService: AccountsDBService,
        private ngZone: NgZone
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
    }

    startTimer() {
        this.ngZone.runOutsideAngular(() => {
            this.timer = Observable.timer(100, 1000)
                .map(i => this.totalTime - i)
                .take(this.totalTime + 1);

            this._dataStore.remainingTime = this.totalTime;
            this.timerSubscription = this.timer.subscribe(
                secondRemaining => {
                    this.remainingTime$.next(secondRemaining);
                },
                error => {},
                () => {
                    if (this.router.url === '/accounts/add') {
                        this.addAccountService.autoSaveCurrentAccount$.next('init');
                    } else {
                        this.autoLogout();
                    }
                }
            );
        });
    }

    private autoLogout() {
        this.loginService.logout();
        this.router.navigate(['']);
    }

    resetTimer() {
        this.timerSubscription.unsubscribe();
        // Restart the timer
        this.startTimer();
    }
}
