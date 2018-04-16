import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {SnackComponent} from './snack.component';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class SnackUtilService {

    constructor(private translateService: TranslateService,
                private snackBar: MatSnackBar) {
    }

    openSnackBar(messageKey: string, duration: number, iconCode: string, params?: any) {
        const message = this.translateService.instant(messageKey, params);
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = duration;
        config.data = {icon: iconCode, text: message};
        this.snackBar.openFromComponent(SnackComponent, config);
    }

    openSnackBarWithConfig(config: MatSnackBarConfig) {
        this.snackBar.openFromComponent(SnackComponent, config);
    }
}
