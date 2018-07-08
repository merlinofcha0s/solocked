import { browser } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { PaymentComponentsPage, PaymentUpdatePage } from './payment.page-object';

describe('Payment e2e test', () => {
    let navBarPage: NavBarPage;
    let paymentUpdatePage: PaymentUpdatePage;
    let paymentComponentsPage: PaymentComponentsPage;

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

    it('should load create Payment page', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentUpdatePage = new PaymentUpdatePage();
        expect(paymentUpdatePage.getPageTitle()).toMatch(/ninjaccountApp.payment.home.createOrEditLabel/);
        paymentUpdatePage.cancel();
    });

    it('should create and save Payments', () => {
        paymentComponentsPage.clickOnCreateButton();
        paymentUpdatePage.setSubscriptionDateInput('2000-12-31');
        expect(paymentUpdatePage.getSubscriptionDateInput()).toMatch('2000-12-31');
        paymentUpdatePage.setPriceInput('5');
        expect(paymentUpdatePage.getPriceInput()).toMatch('5');
        paymentUpdatePage.planTypeSelectLastOption();
        paymentUpdatePage
            .getPaidInput()
            .isSelected()
            .then(selected => {
                if (selected) {
                    paymentUpdatePage.getPaidInput().click();
                    expect(paymentUpdatePage.getPaidInput().isSelected()).toBeFalsy();
                } else {
                    paymentUpdatePage.getPaidInput().click();
                    expect(paymentUpdatePage.getPaidInput().isSelected()).toBeTruthy();
                }
            });
        paymentUpdatePage.setValidUntilInput('2000-12-31');
        expect(paymentUpdatePage.getValidUntilInput()).toMatch('2000-12-31');
        paymentUpdatePage.setLastPaymentIdInput('lastPaymentId');
        expect(paymentUpdatePage.getLastPaymentIdInput()).toMatch('lastPaymentId');
        paymentUpdatePage
            .getRecurringInput()
            .isSelected()
            .then(selected => {
                if (selected) {
                    paymentUpdatePage.getRecurringInput().click();
                    expect(paymentUpdatePage.getRecurringInput().isSelected()).toBeFalsy();
                } else {
                    paymentUpdatePage.getRecurringInput().click();
                    expect(paymentUpdatePage.getRecurringInput().isSelected()).toBeTruthy();
                }
            });
        paymentUpdatePage.setBillingPlanIdInput('billingPlanId');
        expect(paymentUpdatePage.getBillingPlanIdInput()).toMatch('billingPlanId');
        paymentUpdatePage.setTokenRecurringInput('tokenRecurring');
        expect(paymentUpdatePage.getTokenRecurringInput()).toMatch('tokenRecurring');
        paymentUpdatePage.userSelectLastOption();
        paymentUpdatePage.save();
        expect(paymentUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});
