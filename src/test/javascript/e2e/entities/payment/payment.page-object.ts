import { element, by, promise, ElementFinder } from 'protractor';

export class PaymentComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-payment div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
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

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setSubscriptionDateInput(subscriptionDate): promise.Promise<void> {
        return this.subscriptionDateInput.sendKeys(subscriptionDate);
    }

    getSubscriptionDateInput() {
        return this.subscriptionDateInput.getAttribute('value');
    }

    setPriceInput(price): promise.Promise<void> {
        return this.priceInput.sendKeys(price);
    }

    getPriceInput() {
        return this.priceInput.getAttribute('value');
    }

    setPlanTypeSelect(planType): promise.Promise<void> {
        return this.planTypeSelect.sendKeys(planType);
    }

    getPlanTypeSelect() {
        return this.planTypeSelect.element(by.css('option:checked')).getText();
    }

    planTypeSelectLastOption(): promise.Promise<void> {
        return this.planTypeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }
    getPaidInput() {
        return this.paidInput;
    }
    setValidUntilInput(validUntil): promise.Promise<void> {
        return this.validUntilInput.sendKeys(validUntil);
    }

    getValidUntilInput() {
        return this.validUntilInput.getAttribute('value');
    }

    setLastPaymentIdInput(lastPaymentId): promise.Promise<void> {
        return this.lastPaymentIdInput.sendKeys(lastPaymentId);
    }

    getLastPaymentIdInput() {
        return this.lastPaymentIdInput.getAttribute('value');
    }

    getRecurringInput() {
        return this.recurringInput;
    }
    setBillingPlanIdInput(billingPlanId): promise.Promise<void> {
        return this.billingPlanIdInput.sendKeys(billingPlanId);
    }

    getBillingPlanIdInput() {
        return this.billingPlanIdInput.getAttribute('value');
    }

    setTokenRecurringInput(tokenRecurring): promise.Promise<void> {
        return this.tokenRecurringInput.sendKeys(tokenRecurring);
    }

    getTokenRecurringInput() {
        return this.tokenRecurringInput.getAttribute('value');
    }

    userSelectLastOption(): promise.Promise<void> {
        return this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    userSelectOption(option): promise.Promise<void> {
        return this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    save(): promise.Promise<void> {
        return this.saveButton.click();
    }

    cancel(): promise.Promise<void> {
        return this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}
