import {browser, by, element, ElementFinder, ExpectedConditions} from "protractor";

export class CommonAction {

    registerPage: RegisterPage;
    homePage: HomePage;
    navbar: Navbar;
    myAccounts: MyAccounts;

    constructor() {
        this.registerPage = new RegisterPage();
        this.homePage = new HomePage();
        this.navbar = new Navbar();
        this.myAccounts = new MyAccounts();
    }

    registerUser(username: string, password: string, email: string) {
        element(by.id("register")).click();
        this.registerPage.loginInput.click();
        this.registerPage.loginInput.sendKeys(username);
        this.registerPage.emailInput.click();
        this.registerPage.emailInput.sendKeys(email);
        this.registerPage.passwordInput.click();
        this.registerPage.passwordInput.sendKeys(password);
        this.registerPage.confirmationPassword.click();
        this.registerPage.confirmationPassword.sendKeys(password);
        this.registerPage.validation.click();

        browser.driver.sleep(2000);
    }

    activateUser(username: string) {
        this.login('admin', 'admin');
        browser.driver.sleep(1000);
        expect<any>(browser.getTitle()).toBe('Users');

        element(by.id(username + '-deactivation')).click();
        this.logout();
    }

    logout() {
        browser.wait(ExpectedConditions.presenceOf(this.navbar.account));
        this.navbar.account.click();
        browser.driver.sleep(1000);
        browser.wait(ExpectedConditions.presenceOf(this.navbar.logout));
        this.navbar.logout.click();
        this.homePage.title.isPresent().then((value) => {
            expect(value).toBe(true);
        });
    }

    login(username: string, password: string, checkMyAccounts?: boolean) {
        browser.get('/');
        this.homePage.username.click();
        this.homePage.username.sendKeys(username);
        this.homePage.password.click();
        this.homePage.password.sendKeys(password);
        this.homePage.validate.click();
        browser.waitForAngular();
        //await browser.driver.sleep(2000);
        if(checkMyAccounts){
            browser.driver.sleep(2000);
            element.all(by.id('title-accounts')).first().isPresent().then((value) => {
                expect(value).toEqual(true);
            });
            // browser.wait(this.myAccounts.title.isPresent()).then((value : boolean) => {
            //     expect(value).toBe(true);
            // });
        }
    }
}

export class RegisterPage {
    private _loginInput = element(by.id('login'));
    private _emailInput = element(by.id('email'));
    private _passwordInput = element(by.id('password'));
    private _confirmationPassword = element(by.id('confirmPassword'));
    private _validation = element(by.id('validate'));


    get loginInput(): ElementFinder {
        return this._loginInput;
    }

    get emailInput(): ElementFinder {
        return this._emailInput;
    }

    get passwordInput(): ElementFinder {
        return this._passwordInput;
    }

    get confirmationPassword(): ElementFinder {
        return this._confirmationPassword;
    }

    get validation(): ElementFinder {
        return this._validation;
    }
}

export class HomePage {
    private _username = element(by.id('username'));
    private _password = element(by.id('password'));
    private _validate = element(by.id('login'));
    private _title = element(by.id('title'));
    private _error = element.all(by.css('card-warning text-white ng-star-inserted')).first();

    get username(): ElementFinder {
        return this._username;
    }

    get password(): ElementFinder {
        return this._password;
    }

    get validate(): ElementFinder {
        return this._validate;
    }

    get title(): ElementFinder {
        return this._title;
    }

    get error(): ElementFinder {
        return this._error;
    }
}

export class Navbar {
    private _account = element(by.id('account'));
    private _logout = element(by.id('logout'));

    get account(): ElementFinder {
        return this._account;
    }

    get logout(): ElementFinder {
        return this._logout;
    }
}

export class MyAccounts {
    private _title = element(by.id('title-accounts'));

    get title(): ElementFinder {
        return this._title;
    }
}




