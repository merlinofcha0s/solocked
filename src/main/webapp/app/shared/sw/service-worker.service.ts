import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SwModel } from 'app/layouts/navbar/autologout/sw.model';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
    swReceiver$: BehaviorSubject<SwModel>;

    constructor() {
        this.swReceiver$ = new BehaviorSubject<SwModel>(new SwModel(''));
        this.initHandlerReceiveEventFromSW();
        this.initHandlerRefreshForNewSWVersion();
    }

    initHandlerReceiveEventFromSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', event => {
                this.swReceiver$.next(JSON.parse(event.data));
            });
        }
    }

    sendMessageToSW(msg: string): void {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.controller.postMessage(msg);
        }
    }

    sendMessageToAutolock(autolockModel: SwModel) {
        this.sendMessageToSW(JSON.stringify(autolockModel));
    }

    initHandlerRefreshForNewSWVersion() {
        let refreshing;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });
        }
    }
}
