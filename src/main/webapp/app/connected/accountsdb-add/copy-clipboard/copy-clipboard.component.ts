import { Component, Input, OnInit } from '@angular/core';
import { SnackUtilService } from '../../../shared/snack/snack-util.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-copy-clipboard',
    templateUrl: './copy-clipboard.component.html',
    styleUrls: ['./copy-clipboard.component.scss']
})
export class CopyClipboardComponent implements OnInit {
    @Input() contentToCopy: string;
    @Input() keyNameField: string;

    constructor(private snackUtilsService: SnackUtilService, private translateService: TranslateService) {}

    ngOnInit() {}

    notifyCopyToClipboard(nameField: string) {
        const nameFieldTrans = this.translateService.instant(nameField);
        this.snackUtilsService.openSnackBar('ninjaccountApp.accountsDB.details.toastMessage', 3000, 'check-circle', {
            nameField: nameFieldTrans
        });
    }
}
