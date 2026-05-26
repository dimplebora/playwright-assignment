const { Given, When, Then } = require('@cucumber/cucumber')
const { login } = require('../../utils/loginhelper');

let loginPage;


Given('i am on login screen', async function () {
  console.log("User is on login screen")
})

When('i enter {string} and {string}', async function (username, password) {
  loginPage=await login(this.page, username, password)

})
When('click on sign in button', async function () {
  await loginPage.verifyBrowseEventsLink();
})
Then('a link with browse events should display', async function () {
  await loginPage.verifyBrowseEventsLink();

})
