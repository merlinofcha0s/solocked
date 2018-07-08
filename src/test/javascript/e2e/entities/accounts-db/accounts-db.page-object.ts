import { by, element, ElementFinder, promise } from 'protractor';

export class AccountsDBComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-accounts-db div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
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

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setInitializationVectorInput(initializationVector): promise.Promise<void> {
        return this.initializationVectorInput.sendKeys(initializationVector);
    }

    getInitializationVectorInput() {
        return this.initializationVectorInput.getAttribute('value');
    }

    setDatabaseInput(database): promise.Promise<void> {
        return this.databaseInput.sendKeys(database);
    }

    getDatabaseInput() {
        return this.databaseInput.getAttribute('value');
    }

    setNbAccountsInput(nbAccounts): promise.Promise<void> {
        return this.nbAccountsInput.sendKeys(nbAccounts);
    }

    getNbAccountsInput() {
        return this.nbAccountsInput.getAttribute('value');
    }

    setSumInput(sum): promise.Promise<void> {
        return this.sumInput.sendKeys(sum);
    }

    getSumInput() {
        return this.sumInput.getAttribute('value');
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
