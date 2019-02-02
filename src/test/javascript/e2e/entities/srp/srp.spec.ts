/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SrpComponentsPage, SrpDeleteDialog, SrpUpdatePage } from './srp.page-object';

const expect = chai.expect;

describe('Srp e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let srpUpdatePage: SrpUpdatePage;
    let srpComponentsPage: SrpComponentsPage;
    /*let srpDeleteDialog: SrpDeleteDialog;*/

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Srps', async () => {
        await navBarPage.goToEntity('srp');
        srpComponentsPage = new SrpComponentsPage();
        expect(await srpComponentsPage.getTitle()).to.eq('ninjaccountApp.srp.home.title');
    });

    it('should load create Srp page', async () => {
        await srpComponentsPage.clickOnCreateButton();
        srpUpdatePage = new SrpUpdatePage();
        expect(await srpUpdatePage.getPageTitle()).to.eq('ninjaccountApp.srp.home.createOrEditLabel');
        await srpUpdatePage.cancel();
    });

    /* it('should create and save Srps', async () => {
        const nbButtonsBeforeCreate = await srpComponentsPage.countDeleteButtons();

        await srpComponentsPage.clickOnCreateButton();
        await srpUpdatePage.setSaltInput('salt');
        expect(await srpUpdatePage.getSaltInput()).to.eq('salt');
        await srpUpdatePage.setVerifierInput('verifier');
        expect(await srpUpdatePage.getVerifierInput()).to.eq('verifier');
        await srpUpdatePage.userSelectLastOption();
        await srpUpdatePage.save();
        expect(await srpUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await srpComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });*/

    /* it('should delete last Srp', async () => {
        const nbButtonsBeforeDelete = await srpComponentsPage.countDeleteButtons();
        await srpComponentsPage.clickOnLastDeleteButton();

        srpDeleteDialog = new SrpDeleteDialog();
        expect(await srpDeleteDialog.getDialogTitle())
            .to.eq('ninjaccountApp.srp.delete.question');
        await srpDeleteDialog.clickOnConfirmButton();

        expect(await srpComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });*/

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
