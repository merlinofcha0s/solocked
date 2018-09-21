import { element, by, ElementFinder } from 'protractor';

export class AccountsDBComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-accounts-db div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AccountsDBUpdatePage {
    pageTitle = element(by.id('jhi-accounts-db-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    initializationVectorInput = element(by.id('field_initializationVector'));
    databaseInput = element(by.id('file_database'));
    nbAccountsInput = element(by.id('field_nbAccounts'));
    sumInput = element(by.id('field_sum'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setInitializationVectorInput(initializationVector) {
        await this.initializationVectorInput.sendKeys(initializationVector);
    }

    async getInitializationVectorInput() {
        return this.initializationVectorInput.getAttribute('value');
    }

    async setDatabaseInput(database) {
        await this.databaseInput.sendKeys(database);
    }

    async getDatabaseInput() {
        return this.databaseInput.getAttribute('value');
    }

    async setNbAccountsInput(nbAccounts) {
        await this.nbAccountsInput.sendKeys(nbAccounts);
    }

    async getNbAccountsInput() {
        return this.nbAccountsInput.getAttribute('value');
    }

    async setSumInput(sum) {
        await this.sumInput.sendKeys(sum);
    }

    async getSumInput() {
        return this.sumInput.getAttribute('value');
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
