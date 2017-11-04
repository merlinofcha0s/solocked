import {Injectable} from '@angular/core';
import {LoginService} from "../../../shared/login/login.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class AutolockService {

    totalTime = 120;
    remainingTime$: BehaviorSubject<number>;
    timer: Observable<number>;
    timerSubscription: Subscription;

    private _dataStore: {
        remainingTime: number;
    };

    constructor(private loginService: LoginService
        , private router: Router) {
        this._dataStore = {remainingTime: this.totalTime};
        this.remainingTime$ = new BehaviorSubject<number>(this._dataStore.remainingTime);
    }

    startTimer() {
        this.timer = Observable
            .timer(100, 1000)
            .map(i => this.totalTime - i)
            .take(this.totalTime + 1);

        this._dataStore.remainingTime = this.totalTime;
        this.timerSubscription = this.timer.subscribe(secondRemaining => {
                this.remainingTime$.next(secondRemaining);
            }
            , error => {
            }
            , () => {
                this.loginService.logout();
                this.router.navigate(['/']);
            });
    }

    resetTimer() {
       this.timerSubscription.unsubscribe();
       //Restart the timer
       this.startTimer();
    }

}
