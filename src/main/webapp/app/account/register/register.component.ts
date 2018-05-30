import {AfterViewInit, Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {Register} from './register.service';
import {EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE, LoginModalService} from '../../shared';
import {HttpErrorResponse} from '@angular/common/http';
import {PlanType} from '../../entities/payment';

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
    passwordMatch: boolean;

    maxPassword = 50;

    signUpLabel: string;

    constructor(private languageService: JhiLanguageService,
                private loginModalService: LoginModalService,
                private registerService: Register,
                private elementRef: ElementRef,
                private renderer: Renderer) {

    }

    ngOnInit() {
        this.success = false;
        this.loading = false;
        this.registerAccount = {};
        this.signUpLabel = 'register.form.button';
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
                this.registerService.save(this.registerAccount).subscribe(() => {
                    this.loading = true;
                    this.success = true;
                }, (response: HttpErrorResponse) => this.processError(response));
            });
        }
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
        switch (planType){
            case PlanType.FREE:
                this.signUpLabel = 'register.form.buttonFree';
                break;
            case PlanType.PREMIUMMONTH:
            case PlanType.PREMIUMYEAR:
                this.signUpLabel = 'register.form.buttonPayed';
        }
        this.registerAccount.planType = planType;
    }
}
