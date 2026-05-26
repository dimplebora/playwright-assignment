const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/login');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

function futureDateValue() {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  futureDate.setHours(10, 30, 0, 0);

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');
  const hours = String(futureDate.getHours()).padStart(2, '0');
  const minutes = String(futureDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function registerUser(request, email, password) {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();
}

async function seatCountFrom(card) {
  const seatText = await card.getByText(/seat/i).first().innerText();
  const match = seatText.match(/\d+/);

  if (!match) {
    throw new Error(`Could not parse seat count from: ${seatText}`);
  }

  return Number(match[0]);
}

test('create an event, book it, and verify available seats drop by one', async ({ page, request }) => {
  const uniqueId = Date.now();
  const email = `eventhub-${uniqueId}@example.com`;
  const password = 'EventHub@12345';
  const eventTitle = `Test Event ${uniqueId}`;
  const bookingName = 'Automation Tester';
  const bookingPhone = '+91 98765 43210';

  await registerUser(request, email, password);
  await login(page, email, password);

  await page.goto('/admin/events');
  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Created by an automated Playwright booking flow.');
  await page.getByLabel('City').fill('Bangalore');
  await page.getByLabel('Venue').fill('Whitefield');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');
  await page.locator('#add-event-btn').click();
  await expect(page.getByText('Event created!')).toBeVisible();

  await page.goto('/events');
  const eventCards = page.getByTestId('event-card');
  await expect(eventCards.first()).toBeVisible();

  let matchedEventCard = eventCards.filter({ hasText: eventTitle });
  await expect(matchedEventCard).toBeVisible({ timeout: 5000 });

  const seatsBeforeBooking = await seatCountFrom(matchedEventCard);

  await matchedEventCard.getByTestId('book-now-btn').click();

  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByLabel('Full Name').fill(bookingName);
  await page.locator('#customer-email').fill(email);
  await page.getByPlaceholder('+91 98765 43210').fill(bookingPhone);
  await page.locator('.confirm-booking-btn').click();

  const bookingReference = page.locator('.booking-ref').first();
  await expect(bookingReference).toBeVisible();
  const bookingRef = (await bookingReference.innerText()).trim();

  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  const matchedBookingCard = bookingCards.filter({
    has: page.locator('.booking-ref').filter({ hasText: bookingRef }),
  });
  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);

  await page.goto('/events');
  await expect(eventCards.first()).toBeVisible();

  matchedEventCard = eventCards.filter({ hasText: eventTitle });
  await expect(matchedEventCard).toBeVisible();

  const seatsAfterBooking = await seatCountFrom(matchedEventCard);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});
