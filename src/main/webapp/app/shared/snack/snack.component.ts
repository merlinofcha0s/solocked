import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import {Router} from '@angular/router';

@Component({
    selector: 'jhi-snack',
    templateUrl: './snack.component.html',
    styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    goToAction(url: string) {
        this.router.navigate([url]);
    }
}
