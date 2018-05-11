import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper} from '../../shared';
import {Principal} from '../../shared';
import {AutolockService} from '../navbar/autologout/autolock.service';
import {ProfileService} from '../profiles/profile.service';
import fontawesome from '@fortawesome/fontawesome';
import {WarnBrowserComponent} from './warn-browser/warn-browser.component';
import {MatDialog} from '@angular/material';
import {AccountsService} from "../../shared/account/accounts.service";

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
        'name': 'SoLocked',
        'url': 'https://solocked.com',
        'description': 'All your accounts in one place.',
    };

    inProduction: boolean;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private router: Router,
                private principal: Principal,
                private autolockService: AutolockService,
                private profileService: ProfileService,
                private dialog: MatDialog,
                private renderer: Renderer2,
                private accountsService: AccountsService) {
    }

    ngOnInit() {
        this.initEventRouter();
        this.initTrackingAndChat();
        this.initFontAwesome5();
        this.detectEdge();
    }

    initEventRouter() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
                this.isLoginPage = event.url === '/';
                this.backgroundBodyManagement();
                this.cacheDB();
            }
        });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
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
        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            const inTest = profileInfo.inTest;
            if (inTest) {
                // document.write('<script type="text/javascript">// ProductionAnalyticsCodeHere</script>');
            } else if (!inTest && this.inProduction) {
                const matomoScript = document.createElement("script");
                matomoScript.type = "text/javascript";
                matomoScript.innerHTML = "let _paq = _paq || [];\n" +
                    "  /* tracker methods like \"setCustomDimension\" should be called before \"trackPageView\" */\n" +
                    "  _paq.push(['trackPageView']);\n" +
                    "  _paq.push(['enableLinkTracking']);\n" +
                    "  (function() {\n" +
                    "    let u=\"//piwik.solocked.com/\";\n" +
                    "    _paq.push(['setTrackerUrl', u+'piwik.php']);\n" +
                    "    _paq.push(['setSiteId', '1']);\n" +
                    "    let d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
                    "    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);\n" +
                    "  })();";

                document.getElementsByTagName('head')[0].appendChild(matomoScript);
            }

            if (inTest) {
                const crispScript = document.createElement("script");
                crispScript.type = "text/javascript";
                crispScript.innerHTML = "window.$crisp = [];\n" +
                    "  window.CRISP_WEBSITE_ID = \"3805f1d2-26b3-4732-93e9-03df5b14cf50\";\n" +
                    " (function () {\n" +
                    "  d = document;\n" +
                    "  s = d.createElement(\"script\");\n" +
                    "  s.src = \"https://client.crisp.chat/l.js\";\n" +
                    "  s.async = 1;\n" +
                    "  d.getElementsByTagName(\"head\")[0].appendChild(s);" +
                    "  })();";
                document.getElementsByTagName('head')[0].appendChild(crispScript);
            }

            if (this.inProduction) {
                const crispScript = document.createElement("script");
                crispScript.type = "text/javascript";
                crispScript.innerHTML = "window.$crisp = [];\n" +
                    "  window.CRISP_WEBSITE_ID = \"2c9882e7-06bf-4f8c-9881-06a59390b9ae\";\n" +
                    " (function () {\n" +
                    "  d = document;\n" +
                    "  s = d.createElement(\"script\");\n" +
                    "  s.src = \"https://client.crisp.chat/l.js\";\n" +
                    "  s.async = 1;\n" +
                    "  d.getElementsByTagName(\"head\")[0].appendChild(s);" +
                    "  })();";
                document.getElementsByTagName('head')[0].appendChild(crispScript);
            }
        });
    }

    /* tslint:enable */

    initFontAwesome5() {
        const config = fontawesome.config;
        config.autoReplaceSvg = 'nest';
    }

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

    backgroundBodyManagement() {
        if (this.isLoginPage) {
            this.renderer.addClass(document.body, 'background-offline');
        } else {
            this.renderer.removeClass(document.body, 'background-offline');
        }
    }

    private cacheDB() {
        if(this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])){
            this.accountsService.getAccountsList();
        }
    }
}
