import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'jhi-edit-inline',
    templateUrl: './edit.inline.tile.component.html',
    styleUrls: ['./edit.inline.tile.component.scss']
})
export class EditInlineTileComponent implements OnInit, OnDestroy {

    over: boolean;
    edit: boolean;

    @Input() placeholder: string;
    @Input() value: string;
    @Input() type: string;

    currencyType: boolean;
    stringType: boolean;
    notesType: boolean;

    constructor() {
        console.log('value: ' + this.value);
    }

    ngOnInit() {
        console.log('value init: ' + this.value);
        if (this.type === 'currency') {
            this.currencyType = true;
        } else if (this.type === 'string') {
            this.stringType = true;
        } else {
            this.notesType = true;
        }
    }

    ngOnDestroy(): void {
    }

    onClickOutSide(event: any) {
        if (event && event['value'] === true) {
            this.edit = false;
            this.over = false;
            if (this.value === '') {
                this.createPlaceholder();
            }
        }
    }

    getInputType(): string {
        if (this.currencyType) {
            return 'number';
        } else {
            return 'text';
        }
    }

    createPlaceholder() {
        if (this.value === '') {
            this.value = this.placeholder;
        }
    }

    clearPlaceholder() {
        if (this.value === this.placeholder) {
            this.value = '';
        }
    }
}
