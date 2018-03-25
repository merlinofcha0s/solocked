import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper} from '../../shared';
import {Principal} from '../../shared/auth/principal.service';
import {AutolockService} from '../navbar/autologout/autolock.service';
import {ProfileService} from '../profiles/profile.service';
import fontawesome from '@fortawesome/fontawesome';
import {WarnBrowserComponent} from './warn-browser/warn-browser.component';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {

    loginPage: boolean;

    constructor(private jhiLanguageHelper: JhiLanguageHelper
        , private router: Router
        , private principal: Principal
        , private autolockService: AutolockService
        , private profileService: ProfileService
        , private dialog: MatDialog) {
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
            }
            if (event instanceof NavigationEnd) {
                this.loginPage = event.url === '/';
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
            const inProduction = profileInfo.inProduction;
            const inTest = profileInfo.inTest;
            if (inTest) {
                // document.write('<script type="text/javascript">// ProductionAnalyticsCodeHere</script>');
            } else if (!inTest && inProduction) {
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

            if (inTest || inProduction) {
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

    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
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

}
