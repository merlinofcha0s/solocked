import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

    constructor(private translateService: TranslateService) {
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
        this.isKeyFieldHided.splice(index, 1);
        this.customs.controls.splice(index, 1);
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
