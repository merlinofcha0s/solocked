import { browser, by, element, ExpectedConditions } from 'protractor';
import { CommonAction } from '../account/common-action';

const expect = chai.expect;

describe('Adding account', function() {
    let registerHelper: CommonAction;

    before(async () => {
        await browser.get('/');
        registerHelper = new CommonAction();
    });

    it('Should adding account successfully', async () => {
        await registerHelper.registerUser('test03', 'Lolmdr06', 'test03@lol.com');
        await registerHelper.activateUser('test03');

        await registerHelper.login('test03', 'Lolmdr06', true);

        const name = 'Dropbox 3';
        const username = 'raiden';
        await element(by.css("*[id='add-button']")).click();
        await element(by.css("*[id='accountName']")).click();
        await element(by.css("*[id='accountName']")).sendKeys(name);
        await element(by.css("*[id='username']")).click();
        await element(by.css("*[id='username']")).sendKeys(username);
        await element(by.css("*[id='password']")).sendKeys('looolmdr');
        await element(by.css("*[id='password']")).click();

        await browser.executeScript('window.scrollTo(0,1000);');
        await element(by.css("*[id='addEditAccount']")).click();

        await browser.wait(ExpectedConditions.presenceOf(element(by.id('searchField'))));
        await element(by.css("*[id='searchField']")).click();
        await element(by.css("*[id='searchField']")).sendKeys('Drop');

        const nameElement = await element(by.id('name')).getText();
        expect(nameElement).to.eq(name);

        const usernameElement = await element(by.id('username')).getText();
        expect(usernameElement).to.eq(username);

        await registerHelper.logout();
    });
});
