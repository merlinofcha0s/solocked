import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PaymentService} from '../../entities/payment';

@Injectable()
export class BillingRouteAccessService implements CanActivate {

    constructor(private paymentService: PaymentService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.paymentService.paymentWarning$
            .flatMap((paymentWarning) => {
                return Observable.create(observer => {
                    observer.next(paymentWarning.isValid || paymentWarning.isPaid);
                });
            });
    }
}
