const { Login } = require('../Pageclasses/Login');

async function login(page, username, password) {

    const loginPage = new Login(page);

    await loginPage.goTo();

    await loginPage.enterUsername(username);

    await loginPage.enterPassword(password);
return loginPage
    
}

module.exports = { login };