import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage } from '../../page-objects/jhi-page-objects';

import { AccountsDBComponentsPage, AccountsDBUpdatePage } from './accounts-db.page-object';
import * as path from 'path';
import { CommonAction } from '../../account/common-action';

describe('AccountsDB e2e test', () => {
    let navBarPage: NavBarPage;
    let registerHelper: CommonAction;
    let accountsDBUpdatePage: AccountsDBUpdatePage;
    let accountsDBComponentsPage: AccountsDBComponentsPage;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        registerHelper = new CommonAction();
        await registerHelper.login('admin', 'admin', false);
        await browser.sleep(500);
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 10000);
    });

    it('should load AccountsDBS', async () => {
        await navBarPage.goToEntity('accounts-db');
        accountsDBComponentsPage = new AccountsDBComponentsPage();
        expect(await accountsDBComponentsPage.getTitle()).toMatch(/ninjaccountApp.accountsDB.home.title/);
    });

    it('should load create AccountsDB page', async () => {
        await accountsDBComponentsPage.clickOnCreateButton();
        accountsDBUpdatePage = new AccountsDBUpdatePage();
        expect(await accountsDBUpdatePage.getPageTitle()).toMatch(/ninjaccountApp.accountsDB.home.createOrEditLabel/);
        await accountsDBUpdatePage.cancel();
    });

    it('should create and save AccountsDBS', async () => {
        await accountsDBComponentsPage.clickOnCreateButton();
        await accountsDBUpdatePage.setInitializationVectorInput('initializationVector');
        expect(await accountsDBUpdatePage.getInitializationVectorInput()).toMatch('initializationVector');
        await accountsDBUpdatePage.setDatabaseInput(absolutePath);
        await accountsDBUpdatePage.setNbAccountsInput('5');
        expect(await accountsDBUpdatePage.getNbAccountsInput()).toMatch('5');
        await accountsDBUpdatePage.setSumInput('sum');
        expect(await accountsDBUpdatePage.getSumInput()).toMatch('sum');
        await accountsDBUpdatePage.userSelectLastOption();
        await accountsDBUpdatePage.save();
        expect(await accountsDBUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await registerHelper.logout();
    });
});
