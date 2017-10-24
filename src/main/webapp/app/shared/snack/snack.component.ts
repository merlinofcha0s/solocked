import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
    selector: 'jhi-snack',
    templateUrl: './snack.component.html',
    styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    ngOnInit(): void {
    }

}
