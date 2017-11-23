import {Component, Input, OnDestroy, OnInit} from '@angular/core';

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

}
