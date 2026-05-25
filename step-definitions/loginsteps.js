const { Given, When, Then,Before } = require('@cucumber/cucumber')
const { login } = require('../utils/loginhelper');

const { chromium } = require('playwright')

let browser;
let context;
let page;
let loginPage;

Before(async function () {
  browser = await chromium.launch()
  context = await browser.newContext()
  page = await context.newPage()

})
Given('i am on login screen', async function () {
  console.log("User is on login screen")
})

When('i enter {string} and {string}', async function (username, password) {
  loginPage=await login(page, username, password)

})
When('click on sign in button', async function () {
  await loginPage.clickSignIn();
})
Then('a link with browse events should display', async function () {
  await loginPage.verifyBrowseEventsLink();

})