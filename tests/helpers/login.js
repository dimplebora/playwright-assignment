const { expect } = require('@playwright/test');

async function login(page, email, password) {
  await page.goto('/login');

  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

module.exports = { login };
