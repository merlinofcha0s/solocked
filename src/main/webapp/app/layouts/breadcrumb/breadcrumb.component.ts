import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {Breadcrumb} from './breadcrumb.model';
import {TranslateService} from '@ngx-translate/core';
import {Principal} from '../../shared';
import {AccountsHomeRouteName} from '../../connected';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'jhi-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({opacity: 0.0})),
            state('*', style({opacity: 1})),
            transition('void => *, * => void', animate('500ms  ease-in-out'))
        ])
    ]
})
export class BreadcrumbComponent implements OnInit {

    breadcrumbSteps: Array<Breadcrumb>;

    constructor(private router: Router,
                private translateService: TranslateService,
                private principal: Principal) {
        this.breadcrumbSteps = [];
    }

    ngOnInit() {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .distinctUntilChanged()
            .subscribe((event: NavigationEnd) => {
                if (this.breadcrumbSteps.length === 0 && event.url !== AccountsHomeRouteName) {
                    // You come from a page reload, or directly accessing a deep page
                    for (const config of this.router.config) {
                        if (config.path === AccountsHomeRouteName) {
                            this.breadcrumbSteps.push(this.createNewStep('/' + AccountsHomeRouteName, <ActivatedRouteSnapshot>config));
                        }
                    }
                }

                if (event.url === '/') {
                    // Clear the breadcrumb, we are on the homepage
                    this.breadcrumbSteps.splice(0, this.breadcrumbSteps.length);
                } else {
                    // We are on an authenticated page (accounts, add account, etc)
                    const newStep = this.createNewStep(event.url, this.router.routerState.snapshot.root);

                    let present = false;
                    let idPresent = -1;

                    // Analyzing if the steps is present
                    for (let i = 0; i < this.breadcrumbSteps.length; i++) {
                        const step = this.breadcrumbSteps[i];
                        if (step.url === newStep.url) {
                            present = true;
                            idPresent = i;
                        }
                    }

                    // If there is more than 2 steps, it's not correct because for now we just manage one level of route
                    if (this.breadcrumbSteps.length >= 2) {
                        // We clear the second elements
                        this.breadcrumbSteps.splice(1, this.breadcrumbSteps.length);
                    }

                    if (!present) {
                        this.breadcrumbSteps.push(newStep);
                    }
                }
            });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    hasAnyAuthorityDirect(authorities: string[]): boolean {
        return this.principal.hasAnyAuthorityDirect(authorities);
    }

    createNewStep(url: string, routeSnapshot: ActivatedRouteSnapshot): Breadcrumb {
        const labelKey = this.getPageTitle(routeSnapshot);
        let label = '';

        this.translateService.get(labelKey).subscribe((title) => {
            label = title;
        });

        return new Breadcrumb(label, url);
    }
}
