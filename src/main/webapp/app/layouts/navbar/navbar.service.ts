import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class NavbarService {

    changeFontColor$: BehaviorSubject<boolean>;

    private _dataStore: {
        changeColor: boolean;
    };

    constructor() {
        this._dataStore = {changeColor: false};
        this.changeFontColor$ = new BehaviorSubject<boolean>(this._dataStore.changeColor);
    }

    changeFontColor(homePage: boolean): void {
        this._dataStore.changeColor = homePage;
        this.changeFontColor$.next(this._dataStore.changeColor);
    }

}
