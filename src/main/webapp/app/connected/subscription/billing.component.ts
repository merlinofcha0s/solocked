import {Component, OnInit} from '@angular/core';

declare var $crisp: any;

@Component({
    selector: 'jhi-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    onChoosePlan() {
        // TODO REST POINT PAYPAL
    }
}
