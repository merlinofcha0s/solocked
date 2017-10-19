import { browser, element, by } from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';
import {setTimeout} from "timers";

describe('account', () => {

    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let passwordPage: PasswordPage;
    let settingsPage: SettingsPage;

    beforeEach(() => {
        browser.get('/');
        browser.waitForAngular();
    });

    it('should register successfuly', () => {
        element(by.id("register")).click();
        element(by.css("*[id='login']")).click();
        element(by.css("*[id='login']")).sendKeys('test');
        element(by.css("*[id='email']")).click();
        element(by.css("*[id='email']")).sendKeys('test@test.com');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("*[id='confirmPassword']")).click();
        element(by.css("*[id='confirmPassword']")).sendKeys('lolmdr');
        element(by.id("validate")).click();

        browser.driver.sleep(2000);

        element.all(by.id('success')).first().isPresent().then((value) => {
            expect(value).toEqual(true);
        });

        element.all(by.id("success")).first().isDisplayed().then((value) => {
            expect(value).toEqual(true);
        });
    });

    it('should not register because email already exist', () => {
        element(by.id("register")).click();
        element(by.css("*[id='login']")).click();
        element(by.css("*[id='login']")).sendKeys('test06');
        element(by.css("*[id='email']")).click();
        element(by.css("*[id='email']")).sendKeys('test@test.com');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("*[id='confirmPassword']")).click();
        element(by.css("*[id='confirmPassword']")).sendKeys('lolmdr');
        element(by.id("validate")).click();

        browser.driver.sleep(2000);

        element.all(by.id('errorEmailExists')).first().isPresent().then((value) => {
            expect(value).toEqual(true);
        });

        element.all(by.id("errorEmailExists")).first().isDisplayed().then((value) => {
            expect(value).toEqual(true);
        });
    });

    it('should not register because email already exist', () => {
        element(by.id("register")).click();
        element(by.css("*[id='login']")).click();
        element(by.css("*[id='login']")).sendKeys('test');
        element(by.css("*[id='email']")).click();
        element(by.css("*[id='email']")).sendKeys('test10@test.com');
        element(by.css("*[id='password']")).click();
        element(by.css("*[id='password']")).sendKeys('lolmdr');
        element(by.css("*[id='confirmPassword']")).click();
        element(by.css("*[id='confirmPassword']")).sendKeys('lolmdr');
        element(by.id("validate")).click();

        browser.driver.sleep(2000);

        element.all(by.id('errorUserExists')).first().isPresent().then((value) => {
            expect(value).toEqual(true);
        });

        element.all(by.id("errorUserExists")).first().isDisplayed().then((value) => {
            expect(value).toEqual(true);
        });
    });
});
