import {Directive, ElementRef, Renderer2} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';

@Directive({
    selector: '[jhiCheckBilling]'
})
export class CheckBillingDirective {

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private paymentService: PaymentService) {

        this.paymentService.paymentWarning$.subscribe((paymentWarning) => {
            if (!paymentWarning.isValid || !paymentWarning.isPaid) {
                renderer.addClass(el.nativeElement, 'disable-button');
            }
        });

        this.paymentService.isInPaymentWarning();
    }
}
