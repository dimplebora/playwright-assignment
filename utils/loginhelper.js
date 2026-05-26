const { Login } = require('../Pageclasses/Login');

async function login(page, username, password) {

    const loginPage = new Login(page);

    await loginPage.login(username, password);
    return loginPage
    
}

module.exports = { login };
