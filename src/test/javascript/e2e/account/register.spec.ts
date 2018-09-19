import { browser, by, element, ExpectedConditions } from 'protractor';
import { CommonAction } from './common-action';

describe('account', () => {
    let registerHelper: CommonAction;

    const password = 'Lolmdr06';

    beforeEach(async () => {
        await browser.get('/');
        registerHelper = new CommonAction();
    });

    it('should register successfuly', async () => {
        await registerHelper.registerUser('test', password, 'test@test.com');

        await browser.wait(ExpectedConditions.presenceOf(element(by.id('success'))));
        const success = await element(by.id('success'));
        await success.isPresent();
        await success.isDisplayed();
    });

    it('should not register because email already exist', async () => {
        await registerHelper.registerUser('test06', password, 'test@test.com');

        await browser.wait(ExpectedConditions.presenceOf(element(by.id('errorEmailExists'))));
        const errorEmailExists = await element(by.id('errorEmailExists'));
        await errorEmailExists.isPresent();
        await errorEmailExists.isDisplayed();
    });

    it('should not register because username already exist', async () => {
        await registerHelper.registerUser('test', password, 'test10@test.com');

        await browser.wait(ExpectedConditions.presenceOf(element(by.id('errorUserExists'))));
        const errorUserExists = await element(by.id('errorUserExists'));
        await errorUserExists.isPresent();
        await errorUserExists.isDisplayed();
    });
});
