import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { WaiterComponent } from 'app/shared/waiter/waiter.component';
import { LoginModalService } from 'app/core';
import { Register } from 'app/account';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PaymentService } from 'app/entities/payment';
import { PlanType } from 'app/shared/model/payment.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE, PAYPAL_COMMUNICATION_PROBLEM_TYPE } from 'app/shared';
import { isUndefined } from 'util';
import { MatDialog, MatDialogRef } from '@angular/material';

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
    errorInitPaypal: string;
    errorCompletePaypal: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;
    loading: boolean;
    loadingLabel: string;
    passwordMatch: boolean;

    maxPassword = 50;

    signUpLabel: string;

    modeFinalizingPayment: boolean;
    finalizingPaymentDialogRef: MatDialogRef<WaiterComponent>;

    constructor(
        private languageService: JhiLanguageService,
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer,
        @Inject(DOCUMENT) private document: any,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private paymentService: PaymentService
    ) {}

    ngOnInit() {
        this.success = false;
        this.loading = false;
        this.registerAccount = {};
        this.signUpLabel = 'register.form.button';
        this.loadingLabel = 'register.form.loading';
    }

    ngAfterViewInit() {
        this.completePayment();
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
            this.languageService.getCurrent().then(key => {
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
        this.registerService.save(this.registerAccount).subscribe(
            response => {
                this.loading = false;
                this.success = true;
            },
            (response: HttpErrorResponse) => this.processError(response)
        );
    }

    saveWithPayment() {
        this.registerService
            .save(this.registerAccount)
            .flatMap(() => {
                this.loadingLabel = 'register.form.loadingpayment';
                return this.paymentService.initOneTimePaymentWorkflow(this.registerAccount.planType, this.registerAccount.login);
            })
            .subscribe(
                response => {
                    this.document.location.href = response.body.returnUrl;
                },
                (response: HttpErrorResponse) => this.processError(response)
            );
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = 'ERROR';
        } else if (response.status === 417) {
            this.errorEmailExists = 'ERROR';
        } else if (response.status === 503 && response.error.type === PAYPAL_COMMUNICATION_PROBLEM_TYPE) {
            if (this.modeFinalizingPayment) {
                this.errorCompletePaypal = 'ERROR';
                this.finalizingPaymentDialogRef.close();
            } else {
                this.errorInitPaypal = 'ERROR';
            }
        } else {
            this.error = 'ERROR';
        }
        this.loading = false;
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
        const token = this.route.snapshot.queryParams['token'];
        if (!isUndefined(payerId) && !isUndefined(paymentId)) {
            this.modeFinalizingPayment = true;
            this.openWaiterFinalizer();
            this.completePaymentService(paymentId, payerId);
        } else if (token !== undefined) {
            this.errorCompletePaypal = 'ERROR';
        }
    }

    private completePaymentService(paymentId, payerId) {
        this.paymentService.completeOneTimePaymentWorkflow(paymentId, payerId).subscribe(
            response => {
                const returnPayment = response.body;

                if (returnPayment.status === 'success') {
                    this.success = true;
                    this.finalizingPaymentDialogRef.close();
                } else {
                    this.error = 'Problem when payment occurs';
                }
            },
            (response: HttpErrorResponse) => this.processError(response)
        );
    }

    private openWaiterFinalizer() {
        this.finalizingPaymentDialogRef = this.dialog.open(WaiterComponent, {
            disableClose: true,
            data: { keyMessage: 'register.form.waitingcompletepayment' }
        });
    }
}
