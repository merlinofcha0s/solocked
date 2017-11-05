import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutolockService} from './autolock.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-autolock',
    templateUrl: './autolock.component.html',
    styleUrls: ['./autolock.component.scss']
})
export class AutolockComponent implements OnInit, OnDestroy {

    remainingTime: string;
    progressTimeValue = 0;

    remainingTime$: BehaviorSubject<number>;
    remainingTimeSub: Subscription;

    constructor(private autolockService: AutolockService) {
        this.remainingTime$ = this.autolockService.remainingTime$;
    }

    ngOnInit() {
       this.remainingTimeSub = this.remainingTime$
            .subscribe((secondRemaining) => {
                const minutes = Math.floor(secondRemaining / 60);
                const seconds = secondRemaining - minutes * 60;
                this.remainingTime = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
                this.progressTimeValue = (secondRemaining / this.autolockService.totalTime) * 100;
            });
        this.autolockService.startTimer();
    }

    ngOnDestroy(): void {
        this.remainingTimeSub.unsubscribe();
    }

}
