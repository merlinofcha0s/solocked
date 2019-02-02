/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PaymentComponentsPage, PaymentDeleteDialog, PaymentUpdatePage } from './payment.page-object';

const expect = chai.expect;

describe('Payment e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let paymentUpdatePage: PaymentUpdatePage;
    let paymentComponentsPage: PaymentComponentsPage;
    let paymentDeleteDialog: PaymentDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Payments', async () => {
        await navBarPage.goToEntity('payment');
        paymentComponentsPage = new PaymentComponentsPage();
        await browser.wait(ec.visibilityOf(paymentComponentsPage.title), 5000);
        expect(await paymentComponentsPage.getTitle()).to.eq('ninjaccountApp.payment.home.title');
    });

    it('should load create Payment page', async () => {
        await paymentComponentsPage.clickOnCreateButton();
        paymentUpdatePage = new PaymentUpdatePage();
        expect(await paymentUpdatePage.getPageTitle()).to.eq('ninjaccountApp.payment.home.createOrEditLabel');
        await paymentUpdatePage.cancel();
    });

    it('should create and save Payments', async () => {
        const nbButtonsBeforeCreate = await paymentComponentsPage.countDeleteButtons();

        await paymentComponentsPage.clickOnCreateButton();
        await promise.all([
            paymentUpdatePage.setSubscriptionDateInput('2000-12-31'),
            paymentUpdatePage.setPriceInput('5'),
            paymentUpdatePage.planTypeSelectLastOption(),
            paymentUpdatePage.setValidUntilInput('2000-12-31'),
            paymentUpdatePage.setLastPaymentIdInput('lastPaymentId'),
            paymentUpdatePage.setBillingPlanIdInput('billingPlanId'),
            paymentUpdatePage.setTokenRecurringInput('tokenRecurring'),
            paymentUpdatePage.userSelectLastOption()
        ]);
        expect(await paymentUpdatePage.getSubscriptionDateInput()).to.eq('2000-12-31');
        expect(await paymentUpdatePage.getPriceInput()).to.eq('5');
        const selectedPaid = paymentUpdatePage.getPaidInput();
        if (await selectedPaid.isSelected()) {
            await paymentUpdatePage.getPaidInput().click();
            expect(await paymentUpdatePage.getPaidInput().isSelected()).to.be.false;
        } else {
            await paymentUpdatePage.getPaidInput().click();
            expect(await paymentUpdatePage.getPaidInput().isSelected()).to.be.true;
        }
        expect(await paymentUpdatePage.getValidUntilInput()).to.eq('2000-12-31');
        expect(await paymentUpdatePage.getLastPaymentIdInput()).to.eq('lastPaymentId');
        const selectedRecurring = paymentUpdatePage.getRecurringInput();
        if (await selectedRecurring.isSelected()) {
            await paymentUpdatePage.getRecurringInput().click();
            expect(await paymentUpdatePage.getRecurringInput().isSelected()).to.be.false;
        } else {
            await paymentUpdatePage.getRecurringInput().click();
            expect(await paymentUpdatePage.getRecurringInput().isSelected()).to.be.true;
        }
        expect(await paymentUpdatePage.getBillingPlanIdInput()).to.eq('billingPlanId');
        expect(await paymentUpdatePage.getTokenRecurringInput()).to.eq('tokenRecurring');
        await paymentUpdatePage.save();
        expect(await paymentUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await paymentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Payment', async () => {
        const nbButtonsBeforeDelete = await paymentComponentsPage.countDeleteButtons();
        await paymentComponentsPage.clickOnLastDeleteButton();

        paymentDeleteDialog = new PaymentDeleteDialog();
        expect(await paymentDeleteDialog.getDialogTitle()).to.eq('ninjaccountApp.payment.delete.question');
        await paymentDeleteDialog.clickOnConfirmButton();

        expect(await paymentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
