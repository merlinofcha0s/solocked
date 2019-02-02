/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AccountsDBComponentsPage, AccountsDBDeleteDialog, AccountsDBUpdatePage } from './accounts-db.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('AccountsDB e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let accountsDBUpdatePage: AccountsDBUpdatePage;
    let accountsDBComponentsPage: AccountsDBComponentsPage;
    let accountsDBDeleteDialog: AccountsDBDeleteDialog;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load AccountsDBS', async () => {
        await navBarPage.goToEntity('accounts-db');
        accountsDBComponentsPage = new AccountsDBComponentsPage();
        expect(await accountsDBComponentsPage.getTitle()).to.eq('ninjaccountApp.accountsDB.home.title');
    });

    it('should load create AccountsDB page', async () => {
        await accountsDBComponentsPage.clickOnCreateButton();
        accountsDBUpdatePage = new AccountsDBUpdatePage();
        expect(await accountsDBUpdatePage.getPageTitle()).to.eq('ninjaccountApp.accountsDB.home.createOrEditLabel');
        await accountsDBUpdatePage.cancel();
    });

    it('should create and save AccountsDBS', async () => {
        const nbButtonsBeforeCreate = await accountsDBComponentsPage.countDeleteButtons();

        await accountsDBComponentsPage.clickOnCreateButton();
        await accountsDBUpdatePage.setInitializationVectorInput('initializationVector');
        expect(await accountsDBUpdatePage.getInitializationVectorInput()).to.eq('initializationVector');
        await accountsDBUpdatePage.setDatabaseInput(absolutePath);
        await accountsDBUpdatePage.setNbAccountsInput('5');
        expect(await accountsDBUpdatePage.getNbAccountsInput()).to.eq('5');
        await accountsDBUpdatePage.setSumInput('sum');
        expect(await accountsDBUpdatePage.getSumInput()).to.eq('sum');
        await accountsDBUpdatePage.userSelectLastOption();
        await accountsDBUpdatePage.save();
        expect(await accountsDBUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await accountsDBComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last AccountsDB', async () => {
        const nbButtonsBeforeDelete = await accountsDBComponentsPage.countDeleteButtons();
        await accountsDBComponentsPage.clickOnLastDeleteButton();

        accountsDBDeleteDialog = new AccountsDBDeleteDialog();
        expect(await accountsDBDeleteDialog.getDialogTitle()).to.eq('ninjaccountApp.accountsDB.delete.question');
        await accountsDBDeleteDialog.clickOnConfirmButton();

        expect(await accountsDBComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
