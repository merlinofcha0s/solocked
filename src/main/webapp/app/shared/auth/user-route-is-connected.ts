import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Principal } from 'app/core';

@Injectable()
export class UserRouteAccessIsConnectedService implements CanActivate {
    constructor(private router: Router, private principal: Principal) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return Observable.create(observer => {
            if (this.principal.isAuthenticated()) {
                observer.next(false);
            } else {
                observer.next(true);
            }
        });
    }
}
