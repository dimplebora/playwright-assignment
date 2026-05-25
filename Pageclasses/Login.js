const { expect } = require('@playwright/test');

class Login {

    constructor(page) {

        this.page = page;

        this.username = page.getByPlaceholder('you@email.com');

        this.password = page.getByLabel('Password');

        this.clicksignin = page.locator('#login-btn');

        this.browseeventlink =
            page.locator("//span[text()='Browse Events →']");
    }

    async goTo() {

        await this.page.goto(
            'https://eventhub.rahulshettyacademy.com/login'
        );
    }

    async enterUsername(username) {

        await this.username.fill(username);
    }

    async enterPassword(password) {

        await this.password.fill(password);
    }

    async clickSignIn() {

        await this.clicksignin.click();
    }

    async verifyBrowseEventsLink() {

        await expect(this.browseeventlink).toBeVisible();
    }
}

module.exports = { Login };