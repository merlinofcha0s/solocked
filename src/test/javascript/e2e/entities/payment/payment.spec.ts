import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PaymentComponentsPage, PaymentUpdatePage } from './payment.page-object';

describe('Payment e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let paymentUpdatePage: PaymentUpdatePage;
    let paymentComponentsPage: PaymentComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Payments', async () => {
        await navBarPage.goToEntity('payment');
        paymentComponentsPage = new PaymentComponentsPage();
        expect(await paymentComponentsPage.getTitle()).toMatch(/ninjaccountApp.payment.home.title/);
    });

    it('should load create Payment page', async () => {
        await paymentComponentsPage.clickOnCreateButton();
        paymentUpdatePage = new PaymentUpdatePage();
        expect(await paymentUpdatePage.getPageTitle()).toMatch(/ninjaccountApp.payment.home.createOrEditLabel/);
        await paymentUpdatePage.cancel();
    });

    it('should create and save Payments', async () => {
        await paymentComponentsPage.clickOnCreateButton();
        await paymentUpdatePage.setSubscriptionDateInput('2000-12-31');
        expect(await paymentUpdatePage.getSubscriptionDateInput()).toMatch('2000-12-31');
        await paymentUpdatePage.setPriceInput('5');
        expect(await paymentUpdatePage.getPriceInput()).toMatch('5');
        await paymentUpdatePage.planTypeSelectLastOption();
        const selectedPaid = paymentUpdatePage.getPaidInput();
        if (await selectedPaid.isSelected()) {
            await paymentUpdatePage.getPaidInput().click();
            expect(await paymentUpdatePage.getPaidInput().isSelected()).toBeFalsy();
        } else {
            await paymentUpdatePage.getPaidInput().click();
            expect(await paymentUpdatePage.getPaidInput().isSelected()).toBeTruthy();
        }
        await paymentUpdatePage.setValidUntilInput('2000-12-31');
        expect(await paymentUpdatePage.getValidUntilInput()).toMatch('2000-12-31');
        await paymentUpdatePage.setLastPaymentIdInput('lastPaymentId');
        expect(await paymentUpdatePage.getLastPaymentIdInput()).toMatch('lastPaymentId');
        const selectedRecurring = paymentUpdatePage.getRecurringInput();
        if (await selectedRecurring.isSelected()) {
            await paymentUpdatePage.getRecurringInput().click();
            expect(await paymentUpdatePage.getRecurringInput().isSelected()).toBeFalsy();
        } else {
            await paymentUpdatePage.getRecurringInput().click();
            expect(await paymentUpdatePage.getRecurringInput().isSelected()).toBeTruthy();
        }
        await paymentUpdatePage.setBillingPlanIdInput('billingPlanId');
        expect(await paymentUpdatePage.getBillingPlanIdInput()).toMatch('billingPlanId');
        await paymentUpdatePage.setTokenRecurringInput('tokenRecurring');
        expect(await paymentUpdatePage.getTokenRecurringInput()).toMatch('tokenRecurring');
        await paymentUpdatePage.userSelectLastOption();
        await paymentUpdatePage.save();
        expect(await paymentUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
