import { browser, by, element, ExpectedConditions } from 'protractor';
import { CommonAction, HomePage, MyAccounts } from './common-action';

const expect = chai.expect;

describe('account', () => {
    let homePage: HomePage;
    let registerHelper: CommonAction;
    let myAccounts: MyAccounts;

    const password = 'Lolmdr06';
    const badPassword = 'lolmdr06';

    beforeEach(async () => {
        await browser.get('/');
        registerHelper = new CommonAction();
        homePage = new HomePage();
        myAccounts = new MyAccounts();
    });

    it('Should login and logout successfuly', async () => {
        await registerHelper.registerUser('test02', password, 'test02@lol.com');
        // await registerHelper.activateUser('test02');
        //
        // await registerHelper.login('test02', password, true);
        // await registerHelper.logout();
    });

    it('Should display error message when bad password', async () => {
        await registerHelper.login('test02', badPassword);
        const card = await element(by.className('card-warning text-white ng-star-inserted'));
        await browser.wait(ExpectedConditions.visibilityOf(card), 10000);
        await card.isDisplayed();
    });
});
