const { chromium, request } = require('playwright')
const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber')

setDefaultTimeout(60 * 1000)

Before(async function () {
    this.browser = await chromium.launch()
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
    this.apiContext = await request.newContext()
})

After(async function () {
    await this.apiContext.dispose()
    await this.context.close()
    await this.browser.close()
})
