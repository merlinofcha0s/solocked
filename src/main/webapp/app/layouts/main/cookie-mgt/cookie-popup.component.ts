import { Component, OnInit } from '@angular/core';
import { CookieMgtService } from 'app/layouts/main/cookie-mgt/cookie-mgt.service';

@Component({
    selector: 'jhi-cookie-popup',
    templateUrl: './cookie-popup.component.html',
    styleUrls: ['./cookie-popup.component.scss']
})
export class CookiePopupComponent implements OnInit {
    constructor(private cookieMgtService: CookieMgtService) {}

    ngOnInit(): void {}

    onAcceptSettings() {
        this.cookieMgtService.acceptSettings(true, true);
    }

    onNoSettings() {
        this.cookieMgtService.noSettings();
    }
}
