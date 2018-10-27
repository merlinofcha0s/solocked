import { Component, Input } from '@angular/core';

@Component({
    selector: 'jhi-infos-button',
    templateUrl: './infos-button.component.html',
    styleUrls: ['infos-buttons.scss']
})
export class InfosButtonComponent {
    @Input() isInNavbar: boolean;

    constructor() {}
}
