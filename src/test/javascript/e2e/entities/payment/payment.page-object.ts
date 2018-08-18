import { element, by, ElementFinder } from 'protractor';

export class PaymentComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-payment div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentUpdatePage {
    pageTitle = element(by.id('jhi-payment-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    subscriptionDateInput = element(by.id('field_subscriptionDate'));
    priceInput = element(by.id('field_price'));
    planTypeSelect = element(by.id('field_planType'));
    paidInput = element(by.id('field_paid'));
    validUntilInput = element(by.id('field_validUntil'));
    lastPaymentIdInput = element(by.id('field_lastPaymentId'));
    recurringInput = element(by.id('field_recurring'));
    billingPlanIdInput = element(by.id('field_billingPlanId'));
    tokenRecurringInput = element(by.id('field_tokenRecurring'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setSubscriptionDateInput(subscriptionDate) {
        await this.subscriptionDateInput.sendKeys(subscriptionDate);
    }

    async getSubscriptionDateInput() {
        return this.subscriptionDateInput.getAttribute('value');
    }

    async setPriceInput(price) {
        await this.priceInput.sendKeys(price);
    }

    async getPriceInput() {
        return this.priceInput.getAttribute('value');
    }

    async setPlanTypeSelect(planType) {
        await this.planTypeSelect.sendKeys(planType);
    }

    async getPlanTypeSelect() {
        return this.planTypeSelect.element(by.css('option:checked')).getText();
    }

    async planTypeSelectLastOption() {
        await this.planTypeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    getPaidInput() {
        return this.paidInput;
    }
    async setValidUntilInput(validUntil) {
        await this.validUntilInput.sendKeys(validUntil);
    }

    async getValidUntilInput() {
        return this.validUntilInput.getAttribute('value');
    }

    async setLastPaymentIdInput(lastPaymentId) {
        await this.lastPaymentIdInput.sendKeys(lastPaymentId);
    }

    async getLastPaymentIdInput() {
        return this.lastPaymentIdInput.getAttribute('value');
    }

    getRecurringInput() {
        return this.recurringInput;
    }
    async setBillingPlanIdInput(billingPlanId) {
        await this.billingPlanIdInput.sendKeys(billingPlanId);
    }

    async getBillingPlanIdInput() {
        return this.billingPlanIdInput.getAttribute('value');
    }

    async setTokenRecurringInput(tokenRecurring) {
        await this.tokenRecurringInput.sendKeys(tokenRecurring);
    }

    async getTokenRecurringInput() {
        return this.tokenRecurringInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}
