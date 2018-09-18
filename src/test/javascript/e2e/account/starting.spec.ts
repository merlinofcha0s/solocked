import { browser } from 'protractor';
import { CommonAction } from './common-action';

describe('admin preparation', () => {
    let registerHelper: CommonAction;

    beforeEach(async () => {
        await browser.get('/');
        registerHelper = new CommonAction();
    });

    it('Should prepare the admin account', async () => {
        await registerHelper.login('admin', 'admin', false);
    });
});
