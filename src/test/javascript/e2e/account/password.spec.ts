import { browser, by, element, ElementFinder, ExpectedConditions as ec } from 'protractor';
import { CommonAction } from './common-action';

describe('password', () => {
    let registerHelper: CommonAction;
    let passwordHelper: PasswordPage;

    const password = 'Lolmdr06';

    beforeEach(async () => {
        registerHelper = new CommonAction();
        passwordHelper = new PasswordPage();

        await browser.get('/');

        await registerHelper.registerUser('test02-change', password, 'test02-change@lol.com');
        await registerHelper.activateUser('test02-change');
        await registerHelper.login('test02-change', password, true);
        await registerHelper.navbar.clickOnAccountMenu();
        await registerHelper.navbar.changePassword.click();
    });

    it('should change password successfuly', async () => {
        const newPassword = 'LolMdr07';

        await browser.wait(ec.visibilityOf(passwordHelper.title), 10000);
        await browser.sleep(500);
        await passwordHelper.clickOnPassword();
        await browser.sleep(500);
        await passwordHelper.password.sendKeys(newPassword);
        await browser.sleep(500);
        await passwordHelper.clickOnConfirmPassword();
        await browser.sleep(500);
        await passwordHelper.confirmPassword.sendKeys(newPassword);
        await browser.sleep(500);
        await passwordHelper.clickOnValidate();
        await browser.sleep(500);
        await browser.wait(ec.visibilityOf(registerHelper.homePage.title), 10000);
        await registerHelper.login('test02-change', newPassword, true);
        await browser.sleep(500);
        await registerHelper.logout();
    });
});

export class PasswordPage {
    private _validate = element(by.id('validate'));

    private _title = element(by.tagName('h1'));

    get title(): ElementFinder {
        return this._title;
    }

    private _password = element(by.id('password'));

    get password(): ElementFinder {
        return this._password;
    }

    private _confirmPassword = element(by.id('confirmPassword'));

    get confirmPassword(): ElementFinder {
        return this._confirmPassword;
    }

    async clickOnPassword() {
        await this._password.click();
    }

    async clickOnConfirmPassword() {
        await this._confirmPassword.click();
    }

    async clickOnValidate() {
        await this._validate.click();
    }
}
