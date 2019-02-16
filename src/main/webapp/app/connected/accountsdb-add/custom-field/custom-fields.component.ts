import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { isUndefined } from 'util';
import { DeleteDialogComponent } from 'app/connected/accountsdb-add/payment-custom-block/delete-payment-line/delete-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'jhi-custom-fields',
    templateUrl: './custom-fields.component.html',
    styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {
    maxKey = 60;
    maxValue = 100;

    isKeyFieldHided: Array<boolean>;

    @Input() customs$: BehaviorSubject<FormArray>;

    customs: FormArray;

    private deleteCustomField: MatDialogRef<DeleteDialogComponent>;

    constructor(private translateService: TranslateService, private dialog: MatDialog) {
        this.isKeyFieldHided = [];
    }

    ngOnInit() {
        this.customs$.subscribe(customs => {
            this.customs = customs;
            for (let _i = 0; _i < customs.controls.length; _i++) {
                this.hideKeyField(_i);
            }
        });
    }

    onDeleteCustomField(index: number) {
        this.deleteCustomField = this.dialog.open(DeleteDialogComponent, {
            data: {
                title: 'ninjaccountApp.accountsDB.paymentblock.deletecustomfield.title',
                snackMessage: 'ninjaccountApp.accountsDB.paymentblock.deletecustomfield.snack',
                customFieldName: this.customs.controls[index].get('keyField').value
            }
        });

        this.deleteCustomField.afterClosed().subscribe(result => {
            if (!isUndefined(result) && result) {
                this.isKeyFieldHided.splice(index, 1);
                this.customs.controls.splice(index, 1);
            }
        });
    }

    generateValuePlaceholder(index: number) {
        let placeholder = this.translateService.instant('ninjaccountApp.accountsDB.add.custom.value') + '(' + (index + 1) + ')';
        if (this.customs.controls[index].get('keyField') && this.customs.controls[index].get('keyField').value !== '') {
            placeholder = this.customs.controls[index].get('keyField').value;
        }

        return placeholder;
    }

    hideKeyField(index: number) {
        if (this.customs.controls[index].get('keyField').value) {
            this.isKeyFieldHided[index] = true;
        } else {
            this.isKeyFieldHided[index] = false;
        }
    }

    onEditLabel(index: number) {
        this.isKeyFieldHided[index] = false;
    }
}
