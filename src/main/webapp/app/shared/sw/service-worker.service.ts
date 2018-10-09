import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SwModel } from 'app/layouts/navbar/autologout/sw.model';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
    swReceiver$: BehaviorSubject<SwModel>;

    constructor() {
        this.swReceiver$ = new BehaviorSubject<SwModel>(new SwModel(''));
        this.initHandlerReceiveEventFromSW();
    }

    initHandlerReceiveEventFromSW() {
        if ('serviceWorker' in navigator) {
            console.log('Handler registered');
            navigator.serviceWorker.addEventListener('message', event => {
                console.log('receiver: ' + event.data);

                this.swReceiver$.next(JSON.parse(event.data));
            });
        }
    }

    sendMessageToSW(msg: string): void {
        if ('serviceWorker' in navigator) {
            console.log('angular send message : ' + msg);
            navigator.serviceWorker.controller.postMessage(msg);
        }
    }

    sendMessageToAutolock(autolockModel: SwModel) {
        this.sendMessageToSW(JSON.stringify(autolockModel));
    }
}
