import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-home-information',
    templateUrl: './home-information.component.html',
    styleUrls: ['home-information.scss']
})
export class HomeInformationComponent {
    constructor(private router: Router) {}

    register() {
        this.router.navigate(['/register']);
    }
}
