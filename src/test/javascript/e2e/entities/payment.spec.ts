import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Payment e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentDialogPage: PaymentDialogPage;
    let paymentComponentsPage: PaymentComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Payments', () => {
        navBarPage.goToEntity('payment');
        paymentComponentsPage = new PaymentComponentsPage();
        expect(paymentComponentsPage.getTitle()).toMatch(/ninjaccountApp.payment.home.title/);

    });

    it('should load create Payment dialog', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentDialogPage = new PaymentDialogPage();
        expect(paymentDialogPage.getModalTitle()).toMatch(/ninjaccountApp.payment.home.createOrEditLabel/);
        paymentDialogPage.close();
    });

    it('should create and save Payments', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentDialogPage.setSubscriptionDateInput('2000-12-31');
        expect(paymentDialogPage.getSubscriptionDateInput()).toMatch('2000-12-31');
        paymentDialogPage.setPriceInput('5');
        expect(paymentDialogPage.getPriceInput()).toMatch('5');
        paymentDialogPage.planTypeSelectLastOption();
        paymentDialogPage.getPaidInput().isSelected().then(function (selected) {
            if (selected) {
                paymentDialogPage.getPaidInput().click();
                expect(paymentDialogPage.getPaidInput().isSelected()).toBeFalsy();
            } else {
                paymentDialogPage.getPaidInput().click();
                expect(paymentDialogPage.getPaidInput().isSelected()).toBeTruthy();
            }
        });
        paymentDialogPage.userSelectLastOption();
        paymentDialogPage.save();
        expect(paymentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentDialogPage {
    modalTitle = element(by.css('h4#myPaymentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    subscriptionDateInput = element(by.css('input#field_subscriptionDate'));
    priceInput = element(by.css('input#field_price'));
    planTypeSelect = element(by.css('select#field_planType'));
    paidInput = element(by.css('input#field_paid'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSubscriptionDateInput = function (subscriptionDate) {
        this.subscriptionDateInput.sendKeys(subscriptionDate);
    }

    getSubscriptionDateInput = function () {
        return this.subscriptionDateInput.getAttribute('value');
    }

    setPriceInput = function (price) {
        this.priceInput.sendKeys(price);
    }

    getPriceInput = function () {
        return this.priceInput.getAttribute('value');
    }

    setPlanTypeSelect = function (planType) {
        this.planTypeSelect.sendKeys(planType);
    }

    getPlanTypeSelect = function () {
        return this.planTypeSelect.element(by.css('option:checked')).getText();
    }

    planTypeSelectLastOption = function () {
        this.planTypeSelect.all(by.tagName('option')).last().click();
    }
    getPaidInput = function () {
        return this.paidInput;
    }
    userSelectLastOption = function () {
        this.userSelect.all(by.tagName('option')).last().click();
    }

    userSelectOption = function (option) {
        this.userSelect.sendKeys(option);
    }

    getUserSelect = function () {
        return this.userSelect;
    }

    getUserSelectedOption = function () {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}