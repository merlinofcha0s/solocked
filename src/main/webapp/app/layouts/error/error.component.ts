import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-error',
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    errorMessage: string;
    error403: boolean;
    pageTitle: string;
    okMessage: string;
    action: string;
    actionLabel: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(routeData => {
            if (routeData.pageTitle) {
                this.pageTitle = routeData.pageTitle;
            }
            if (routeData.error403) {
                this.error403 = routeData.error403;
            }
            if (routeData.errorMessage) {
                this.errorMessage = routeData.errorMessage;
            }
            if (routeData.okMessage) {
                this.okMessage = routeData.okMessage;
            }
            if (routeData.action) {
                this.action = routeData.action;
            }
            if (routeData.actionLabel) {
                this.actionLabel = routeData.actionLabel;
            }
        });
    }
}
