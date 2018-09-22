import { by, element, ElementFinder } from 'protractor';

export class SrpComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-srp div table .btn-danger'));
    title = element.all(by.css('jhi-srp div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SrpUpdatePage {
    pageTitle = element(by.id('jhi-srp-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    saltInput = element(by.id('field_salt'));
    verifierInput = element(by.id('field_verifier'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setSaltInput(salt) {
        await this.saltInput.sendKeys(salt);
    }

    async getSaltInput() {
        return this.saltInput.getAttribute('value');
    }

    async setVerifierInput(verifier) {
        await this.verifierInput.sendKeys(verifier);
    }

    async getVerifierInput() {
        return this.verifierInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .get(1)
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

export class SrpDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-srp-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-srp'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
