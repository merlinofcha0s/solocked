import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { JhiLanguageHelper, Principal } from 'app/core';
import { AutolockService } from 'app/layouts/navbar/autologout/autolock.service';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { MatDialog } from '@angular/material';
import { WarnBrowserComponent } from 'app/layouts/main/warn-browser/warn-browser.component';
import { AccountsDBService } from 'app/entities/accounts-db';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {
    isLoginPage: boolean;
    schema = {
        '@context': 'http://schema.org',
        '@type': 'Application',
        name: 'SoLocked',
        url: 'https://solocked.com',
        description: 'All your accounts in one place.'
    };

    inProduction: boolean;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private principal: Principal,
        private autolockService: AutolockService,
        private profileService: ProfileService,
        private dialog: MatDialog,
        private renderer: Renderer2,
        private accountsService: AccountsDBService
    ) {}

    ngOnInit() {
        this.initEventRouter();
        this.initTrackingAndChat();
        this.detectEdge();

        this.principal.identity(true).then(account => this.principal.initDefaultLanguage(account));
    }

    initEventRouter() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
                this.isLoginPage = event.url === '/';
                this.cacheDB();
            }
        });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    resetAutolockTime() {
        if (this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            this.autolockService.resetTimer();
        }
    }

    /* tslint:disable */
    initTrackingAndChat() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            const inTest = profileInfo.inTest;
            if (inTest) {
                // document.write('<script type="text/javascript">// ProductionAnalyticsCodeHere</script>');
            } else if (!inTest && this.inProduction) {
                const matomoScript = document.createElement('script');
                matomoScript.type = 'text/javascript';
                matomoScript.innerHTML =
                    'var _paq = _paq || [];\n' +
                    '  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */\n' +
                    "  _paq.push(['trackPageView']);\n" +
                    "  _paq.push(['enableLinkTracking']);\n" +
                    '  (function() {\n' +
                    '    let u="//piwik.solocked.com/";\n' +
                    "    _paq.push(['setTrackerUrl', u+'piwik.php']);\n" +
                    "    _paq.push(['setSiteId', '1']);\n" +
                    "    let d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
                    "    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);\n" +
                    '  })();';

                document.getElementsByTagName('head')[0].appendChild(matomoScript);
            }

            if (inTest || this.inProduction) {
                const livezillaScript = document.createElement('script');
                livezillaScript.type = 'text/javascript';
                livezillaScript.id = '2e41582019ee1eae4f223abddca4d665';
                livezillaScript.src = 'https://support.solocked.com/script.php?id=2e41582019ee1eae4f223abddca4d665';
                document.getElementsByTagName('head')[0].appendChild(livezillaScript);
            }
        });
    }

    /* tslint:enable */

    detectEdge() {
        // Get IE or Edge browser version
        const version = this.isEdge();
        if (version >= 12) {
            this.dialog.open(WarnBrowserComponent, {});
        }
    }

    isEdge() {
        const ua = window.navigator.userAgent;
        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        // other browser
        return false;
    }

    private cacheDB() {
        if (this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            this.accountsService.getAccountsList();
        }
    }
}
