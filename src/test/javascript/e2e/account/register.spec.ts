import { browser, element, by } from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';
import {setTimeout} from "timers";

describe('account', () => {

    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let passwordPage: PasswordPage;
    let settingsPage: SettingsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
    });

    it('should register successfuly', () => {
        element(by.id("register")).click();
        element(by.css("*[id='login']")).click();
        element(by.css("*[id='login']")).sendKeys('raiden78');
        element(by.css("*[id='email']")).click();
        element(by.css("*[id='email']")).sendKeys('raiden06@lol.com');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("*[id='confirmPassword']")).click();
        element(by.css("*[id='confirmPassword']")).sendKeys('lolmdr');
        element(by.id("validate")).click();
        element(by.id("success")).isPresent();
        //element(by.id("success")).isDisplayed();
    });
});
