import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
import * as path from 'path';
describe('AccountsDB e2e test', () => {

    let navBarPage: NavBarPage;
    let accountsDBDialogPage: AccountsDBDialogPage;
    let accountsDBComponentsPage: AccountsDBComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AccountsDBS', () => {
        navBarPage.goToEntity('accounts-db');
        accountsDBComponentsPage = new AccountsDBComponentsPage();
        expect(accountsDBComponentsPage.getTitle())
            .toMatch(/ninjaccountApp.accountsDB.home.title/);

    });

    it('should load create AccountsDB dialog', () => {
        accountsDBComponentsPage.clickOnCreateButton();
        accountsDBDialogPage = new AccountsDBDialogPage();
        expect(accountsDBDialogPage.getModalTitle())
            .toMatch(/ninjaccountApp.accountsDB.home.createOrEditLabel/);
        accountsDBDialogPage.close();
    });

    it('should create and save AccountsDBS', () => {
        accountsDBComponentsPage.clickOnCreateButton();
        accountsDBDialogPage.setInitializationVectorInput('initializationVector');
        expect(accountsDBDialogPage.getInitializationVectorInput()).toMatch('initializationVector');
        accountsDBDialogPage.setDatabaseInput(absolutePath);
        accountsDBDialogPage.setNbAccountsInput('5');
        expect(accountsDBDialogPage.getNbAccountsInput()).toMatch('5');
        accountsDBDialogPage.setSumInput('sum');
        expect(accountsDBDialogPage.getSumInput()).toMatch('sum');
        accountsDBDialogPage.userSelectLastOption();
        accountsDBDialogPage.save();
        expect(accountsDBDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AccountsDBComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-accounts-db div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AccountsDBDialogPage {
    modalTitle = element(by.css('h4#myAccountsDBLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    initializationVectorInput = element(by.css('input#field_initializationVector'));
    databaseInput = element(by.css('input#file_database'));
    nbAccountsInput = element(by.css('input#field_nbAccounts'));
    sumInput = element(by.css('input#field_sum'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setInitializationVectorInput = function(initializationVector) {
        this.initializationVectorInput.sendKeys(initializationVector);
    }

    getInitializationVectorInput = function() {
        return this.initializationVectorInput.getAttribute('value');
    }

    setDatabaseInput = function(database) {
        this.databaseInput.sendKeys(database);
    }

    getDatabaseInput = function() {
        return this.databaseInput.getAttribute('value');
    }

    setNbAccountsInput = function(nbAccounts) {
        this.nbAccountsInput.sendKeys(nbAccounts);
    }

    getNbAccountsInput = function() {
        return this.nbAccountsInput.getAttribute('value');
    }

    setSumInput = function(sum) {
        this.sumInput.sendKeys(sum);
    }

    getSumInput = function() {
        return this.sumInput.getAttribute('value');
    }

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    }

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    }

    getUserSelect = function() {
        return this.userSelect;
    }

    getUserSelectedOption = function() {
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
