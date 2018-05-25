import {Component, OnInit} from '@angular/core';

declare var $crisp: any;

@Component({
    selector: 'jhi-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    onChoosePlan() {
        // TODO REST POINT PAYPAL
    }
}
