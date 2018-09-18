import { browser, by, element, ElementFinder, ExpectedConditions as ec, ExpectedConditions } from 'protractor';

export class CommonAction {
    registerPage: RegisterPage;
    homePage: HomePage;
    navbar: Navbar;
    myAccounts: MyAccounts;
    countForAdmin: number;

    constructor() {
        this.registerPage = new RegisterPage();
        this.homePage = new HomePage();
        this.navbar = new Navbar();
        this.myAccounts = new MyAccounts();
        this.countForAdmin = 0;
    }

    async registerUser(username: string, password: string, email: string) {
        await element(by.id('register')).click();
        await this.registerPage.loginInput.click();
        await this.registerPage.loginInput.sendKeys(username);
        await this.registerPage.emailInput.click();
        await this.registerPage.emailInput.sendKeys(email);
        await this.registerPage.passwordInput.click();
        await this.registerPage.passwordInput.sendKeys(password);
        await this.registerPage.confirmationPassword.click();
        await this.registerPage.confirmationPassword.sendKeys(password);
        await this.registerPage.freeAccount.click();
        await this.registerPage.validation.click();
        await browser.sleep(1000);
    }

    async activateUser(username: string) {
        await this.login('admin', 'admin');
        await browser.wait(ExpectedConditions.presenceOf(element(by.className('jh-create-entity'))));
        let title = await browser.getTitle();
        expect(title).toBe('Users | SoLocked');
        await element(by.id(username + '-deactivation')).click();
        await this.logout();
    }

    async logout() {
        await browser.wait(ExpectedConditions.presenceOf(this.navbar.account));
        await this.navbar.account.click();
        await browser.wait(ec.visibilityOf(this.navbar.logout));
        await browser.sleep(500);
        await this.navbar.logout.click();
        await browser.wait(ec.visibilityOf(this.homePage.title), 5000);
    }

    async login(username: string, password: string, checkMyAccounts?: boolean) {
        await browser.get('/');
        await this.homePage.username.click();
        await this.homePage.username.sendKeys(username);
        await this.homePage.password.click();
        await this.homePage.password.sendKeys(password);
        await this.homePage.validate.click();

        if (checkMyAccounts) {
            await browser.waitForAngular();
            let title = await element(by.id('title-accounts')).isPresent();
            expect(title).toEqual(true);
        }
    }
}

export class RegisterPage {
    private _loginInput = element(by.id('login'));
    private _emailInput = element(by.id('email'));
    private _passwordInput = element(by.id('password'));
    private _confirmationPassword = element(by.id('confirmPassword'));
    private _freeAccount = element(by.id('plant-type-free'));
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

    get freeAccount(): ElementFinder {
        return this._freeAccount;
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
