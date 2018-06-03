import {AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {Register} from './register.service';
import {EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE, LoginModalService} from '../../shared';
import {HttpErrorResponse} from '@angular/common/http';
import {PlanType} from '../../entities/payment';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

    confirmPasswordValue: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;
    loading: boolean;
    loadingLabel: string;
    passwordMatch: boolean;

    maxPassword = 50;

    signUpLabel: string;

    constructor(private languageService: JhiLanguageService,
                private loginModalService: LoginModalService,
                private registerService: Register,
                private elementRef: ElementRef,
                private renderer: Renderer,
                @Inject(DOCUMENT) private document: any,
                private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.success = false;
        this.loading = false;
        this.registerAccount = {};
        this.signUpLabel = 'register.form.button';
        this.loadingLabel = 'register.form.loading';

        this.completePayment();
    }

    ngAfterViewInit() {
        // this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPasswordValue) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
            this.loading = true;
            this.languageService.getCurrent().then((key) => {
                this.registerAccount.langKey = key;
                if (this.registerAccount.planType === PlanType.FREE) {
                    this.saveForFree();
                } else {
                    this.saveWithPayment();
                }
            });
        }
    }

    saveForFree() {
        this.registerService.save(this.registerAccount).subscribe((response) => {
            this.loading = false;
            this.success = true;
        }, (response: HttpErrorResponse) => this.processError(response));
    }

    saveWithPayment() {
        this.registerService.save(this.registerAccount)
            .flatMap(() => {
                this.loadingLabel = 'register.form.loadingpayment';
                return this.registerService.initPaymentWorkflow(this.registerAccount.planType, this.registerAccount.login);
            }).subscribe((response) => {
            this.loading = false;
            this.document.location.href = response.body['redirect_url'];
        }, (response: HttpErrorResponse) => this.processError(response));
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = 'ERROR';
            this.loading = false;
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = 'ERROR';
            this.loading = false;
        } else if (response.status === 417) {
            this.errorEmailExists = 'ERROR';
            this.loading = false;
        } else {
            this.error = 'ERROR';
            this.loading = false;
        }
    }

    onChoosePlan(planType: PlanType) {
        switch (planType) {
            case PlanType.FREE:
                this.signUpLabel = 'register.form.buttonFree';
                break;
            case PlanType.PREMIUMMONTH:
            case PlanType.PREMIUMYEAR:
                this.signUpLabel = 'register.form.buttonPayed';
        }
        this.registerAccount.planType = planType;
    }

    completePayment() {
        const payerId = this.route.snapshot.queryParams['PayerID'];
        const paymentId = this.route.snapshot.queryParams['paymentId'];
        if (!isUndefined(payerId) && !isUndefined(paymentId)) {
            console.log('paypal mode');
            console.log('payerId : ' + payerId);
            console.log('paymentId : ' + paymentId);
            this.registerService.completePaymentWorkflow(paymentId, payerId)
                .subscribe((response) => {
                    console.log('body completed : ' + response.body);
                    this.success = true;
                });
        }
    }
}
