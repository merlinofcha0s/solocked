import {browser, element, by, ExpectedConditions} from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';
import {setTimeout} from "timers";
import {CommonAction, HomePage, MyAccounts} from "./common-action";

describe('account', () => {

    let homePage: HomePage;
    let registerHelper: CommonAction;
    let myAccounts: MyAccounts;

    beforeEach(() => {
        browser.get('/');
        registerHelper = new CommonAction();
        homePage = new HomePage();
        myAccounts = new MyAccounts();
        browser.waitForAngularEnabled(false);
    });

    it('Should login and logout successfuly', () => {
        registerHelper.registerUser('test02', 'lolmdr', 'test02@lol.com')
        registerHelper.activateUser('test02');

        registerHelper.login('test02', 'lolmdr', true);
        registerHelper.logout();
    });

    it('Should display error message when bad password', async () => {
        registerHelper.login('test02', 'lolmdr06');
        browser.wait(ExpectedConditions.presenceOf(element(by.className('card-warning text-white ng-star-inserted'))));
        element.all(by.className('card-warning text-white ng-star-inserted')).first().isDisplayed().then((value) => {
            expect(value).toBe(true);
        });
    });
});
