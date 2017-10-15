import { browser, element, by } from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';

describe('Adding account', function () {

    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let passwordPage: PasswordPage;
    let settingsPage: SettingsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
    });

    it('When adding account successfully', function () {
        element(by.css("*[id='signin']")).click();
        element(by.css("*[id='username']")).click();
        element(by.css("*[id='username']")).sendKeys('raiden');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("html > body > jhi-main > div:nth-of-type(1) > jhi-navbar > nav > ngb-modal-window > div > div > jhi-login-modal > div.modal-body > div > div.col-md-12 > form > div.d-flex > button > span")).click();
        element(by.css("*[id='addAccount']")).click();
        element(by.css("*[id='accountName']")).click();
        element(by.css("*[id='accountName']")).sendKeys('Dropbox 3');
        element(by.css("*[id='username']")).click();
        element(by.css("*[id='username']")).sendKeys('raiden');
        element(by.css("*[id='password']")).sendKeys('');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("*[id='addEditAccount']")).click();
        element(by.css("*[id='account-menu'] > span > span > span")).click();
        element(by.css("*[id='logout']")).click();
    });
});
