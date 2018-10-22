
exports.config = {
    allScriptsTimeout: 20000,

    specs: [
        './e2e/account/starting.spec.ts',
        './e2e/account/*.spec.ts',
        './e2e/connected/*.spec.ts',
        './e2e/admin/*.spec.ts',
        './e2e/entities/**/*.spec.ts'
        /* jhipster-needle-add-protractor-tests - JHipster will add protractors tests here */
    ],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ["--disable-gpu", "--window-size=1280,800"]
        }
    },

    directConnect: true,

    baseUrl: 'http://localhost:8080/',

    framework: 'mocha',

    SELENIUM_PROMISE_MANAGER: false,

    mochaOpts: {
        // reporter: 'spec',
        reporter: 'xunit',
        reporterOptions: {
            output: './target/test-results/e2e/TESTS-results.xml'
        },
        slow: 3000,
        ui: 'bdd',
        timeout: 720000
    },

    beforeLaunch: function () {
        require('ts-node').register({
            project: ''
        });
    },

    onPrepare: function() {
        browser.driver.manage().window().setSize(1280, 800);
        // Disable animations
        // @ts-ignore
        browser.executeScript('document.body.className += " notransition";');
        const chai = require('chai');
        const chaiAsPromised = require('chai-as-promised');
        chai.use(chaiAsPromised);
        // @ts-ignore
        global.chai = chai;
    },

    useAllAngular2AppRoots: true
};
