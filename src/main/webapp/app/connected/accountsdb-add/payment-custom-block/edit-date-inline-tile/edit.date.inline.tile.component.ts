import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
    selector: 'jhi-edit-date-inline',
    templateUrl: './edit.date.inline.tile.component.html',
    styleUrls: ['./edit.date.inline.tile.component.scss']
})
export class EditDateInlineTileComponent implements OnInit, OnDestroy {

    over: boolean;
    edit: boolean;

    @Input() placeholder: Date;
    @Input() value: Date;
    @Input() readonlyMode: boolean;

    @Output() onValueChange = new EventEmitter<Date>();

    constructor() {

    }

    ngOnInit() {
    }

    ngOnDestroy(): void {

    }

    onClickOutSide(event: any) {
        if (event && event['value'] === true) {
            this.edit = false;
            this.over = false;
        }
    }

    onChangeValue(event: MatDatepickerInputEvent<Date>) {
        this.onValueChange.emit(event.value);
    }

}
