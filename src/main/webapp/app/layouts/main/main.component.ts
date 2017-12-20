import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper} from '../../shared';
import {Principal} from '../../shared/auth/principal.service';
import {AutolockService} from '../navbar/autologout/autolock.service';
import {ProfileService} from "../profiles/profile.service";

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
        , private profileService: ProfileService) {
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.initEventRouter();
        this.initTracking();
    }

    initEventRouter() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
            if (event instanceof NavigationEnd) {
                if (event.url === '/') {
                    this.loginPage = true;
                } else {
                    this.loginPage = false;
                }
            }
        });
    }

    resetAutolockTime() {
        if (this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            this.autolockService.resetTimer();
        }
    }

    initTracking() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            const inProduction = profileInfo.inProduction;
            const inTest = profileInfo.inTest;
            if (inTest) {
                //document.write('<script type="text/javascript">// ProductionAnalyticsCodeHere</script>');
            } else if (!inTest && inProduction) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.innerHTML = "<script type=\"text/javascript\">\n" +
                    "  var _paq = _paq || [];\n" +
                    "  /* tracker methods like \"setCustomDimension\" should be called before \"trackPageView\" */\n" +
                    "  _paq.push(['trackPageView']);\n" +
                    "  _paq.push(['enableLinkTracking']);\n" +
                    "  (function() {\n" +
                    "    var u=\"//piwik.solocked.com/\";\n" +
                    "    _paq.push(['setTrackerUrl', u+'piwik.php']);\n" +
                    "    _paq.push(['setSiteId', '1']);\n" +
                    "    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
                    "    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);\n" +
                    "  })();\n" +
                    "</script>";

                document.getElementsByTagName('head')[0].appendChild(script);

            }
        });
    }

}
