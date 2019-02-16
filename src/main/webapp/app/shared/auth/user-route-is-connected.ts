import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from 'app/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessIsConnectedService implements CanActivate {
    constructor(private router: Router, private accountService: AccountService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return Observable.create(observer => {
            if (this.accountService.isAuthenticated()) {
                observer.next(false);
            } else {
                observer.next(true);
            }
        });
    }
}
