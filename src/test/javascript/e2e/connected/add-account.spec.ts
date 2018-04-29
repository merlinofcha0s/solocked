import {browser, element, by, ExpectedConditions} from 'protractor';
import {CommonAction} from "../account/common-action";

describe('Adding account', function () {

    let registerHelper: CommonAction;


    beforeAll(() => {
        browser.get('/');
        registerHelper = new CommonAction();
        browser.waitForAngularEnabled(false);
    });

    it('Should adding account successfully', function () {
        registerHelper.registerUser('test03', 'Lolmdr06', 'test03@lol.com')
        registerHelper.activateUser('test03');

        registerHelper.login('test03', 'Lolmdr06', true);

        let name = 'Dropbox 3';
        let username = 'raiden';

        element(by.css("*[id='add-button']")).click();
        element(by.css("*[id='accountName']")).click();
        element(by.css("*[id='accountName']")).sendKeys(name);
        element(by.css("*[id='username']")).click();
        element(by.css("*[id='username']")).sendKeys(username);
        element(by.css("*[id='password']")).sendKeys('looolmdr');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='addEditAccount']")).click();

        browser.wait(ExpectedConditions.presenceOf(element(by.id('searchField'))));
        element(by.css("*[id='searchField']")).click();
        element(by.css("*[id='searchField']")).sendKeys('Drop');

        element.all(by.id("name")).first().getText().then((value) => {
            expect(value).toEqual(name);
        });

        element.all(by.id("username")).first().getText().then((value) => {
            expect(value).toEqual(username);
        });

        registerHelper.logout();
    });
});
