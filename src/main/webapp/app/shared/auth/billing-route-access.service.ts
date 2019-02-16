import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PaymentService } from '../../entities/payment/payment.service';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BillingRouteAccessService implements CanActivate {
    constructor(private paymentService: PaymentService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.paymentService.paymentWarning$.pipe(
            flatMap(paymentWarning => {
                return Observable.create(observer => {
                    observer.next(paymentWarning.isValid || paymentWarning.isPaid);
                });
            })
        );
    }
}
