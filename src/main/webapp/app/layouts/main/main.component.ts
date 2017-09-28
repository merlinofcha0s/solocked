import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {JhiLanguageHelper, StateStorageService} from '../../shared';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit {

    loginPage: boolean;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private router: Router,
                private $storageService: StateStorageService,
                private renderer: Renderer2) {
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
            if (event instanceof NavigationEnd) {
                if (event.url === '/') {
                    // const body = document.getElementsByTagName('body')[0];
                    // body.classList.add('background-offline');
                    this.loginPage = true;
                } else {
                    // const body = document.getElementsByTagName('body')[0];
                    // body.classList.remove("background-offline");
                    this.loginPage = false;
                }
            }
        });
    }
}
