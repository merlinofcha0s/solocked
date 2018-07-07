import { browser } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { AccountsDBComponentsPage, AccountsDBUpdatePage } from './accounts-db.page-object';
import * as path from 'path';

describe('AccountsDB e2e test', () => {
    let navBarPage: NavBarPage;
    let accountsDBUpdatePage: AccountsDBUpdatePage;
    let accountsDBComponentsPage: AccountsDBComponentsPage;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
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
        expect(accountsDBComponentsPage.getTitle()).toMatch(/ninjaccountApp.accountsDB.home.title/);
    });

    it('should load create AccountsDB page', () => {
        accountsDBComponentsPage.clickOnCreateButton();
        accountsDBUpdatePage = new AccountsDBUpdatePage();
        expect(accountsDBUpdatePage.getPageTitle()).toMatch(/ninjaccountApp.accountsDB.home.createOrEditLabel/);
        accountsDBUpdatePage.cancel();
    });

    it('should create and save AccountsDBS', () => {
        accountsDBComponentsPage.clickOnCreateButton();
        accountsDBUpdatePage.setInitializationVectorInput('initializationVector');
        expect(accountsDBUpdatePage.getInitializationVectorInput()).toMatch('initializationVector');
        accountsDBUpdatePage.setDatabaseInput(absolutePath);
        accountsDBUpdatePage.setNbAccountsInput('5');
        expect(accountsDBUpdatePage.getNbAccountsInput()).toMatch('5');
        accountsDBUpdatePage.setSumInput('sum');
        expect(accountsDBUpdatePage.getSumInput()).toMatch('sum');
        accountsDBUpdatePage.userSelectLastOption();
        accountsDBUpdatePage.save();
        expect(accountsDBUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});
