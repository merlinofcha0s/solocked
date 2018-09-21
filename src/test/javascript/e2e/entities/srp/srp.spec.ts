import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage } from '../../page-objects/jhi-page-objects';

import { SrpComponentsPage, SrpUpdatePage } from './srp.page-object';
import { CommonAction } from '../../account/common-action';

describe('Srp e2e test', () => {
    let navBarPage: NavBarPage;
    let srpUpdatePage: SrpUpdatePage;
    let srpComponentsPage: SrpComponentsPage;
    let registerHelper: CommonAction;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        registerHelper = new CommonAction();
        await registerHelper.login('admin', 'admin', false);
        await browser.sleep(500);
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 10000);
    });

    it('should load Srps', async () => {
        await navBarPage.goToEntity('srp');
        srpComponentsPage = new SrpComponentsPage();
        expect(await srpComponentsPage.getTitle()).toMatch(/ninjaccountApp.srp.home.title/);
    });

    it('should load create Srp page', async () => {
        await srpComponentsPage.clickOnCreateButton();
        srpUpdatePage = new SrpUpdatePage();
        expect(await srpUpdatePage.getPageTitle()).toMatch(/ninjaccountApp.srp.home.createOrEditLabel/);
        await srpUpdatePage.cancel();
    });

    it('should create and save Srps', async () => {
        await srpComponentsPage.clickOnCreateButton();
        await srpUpdatePage.setSaltInput('salt');
        expect(await srpUpdatePage.getSaltInput()).toMatch('salt');
        await srpUpdatePage.setVerifierInput('verifier');
        expect(await srpUpdatePage.getVerifierInput()).toMatch('verifier');
        await srpUpdatePage.userSelectLastOption();
        await srpUpdatePage.save();
        expect(await srpUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await registerHelper.logout();
    });
});
