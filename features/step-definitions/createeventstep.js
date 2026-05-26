const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { login } = require('../../utils/loginhelper');
const { EventPage } = require('../../Pageclasses/EventPage');

const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

Given('I create my own credentials and login', async function () {
  const uniqueId = Date.now();

  this.email = `eventhub-${uniqueId}@example.com`;
  this.password = 'EventHub@12345';
  this.eventTitle = `Test Event ${uniqueId}`;
  this.customerName = 'Automation Tester';
  this.phoneNumber = '+91 98765 43210';
  this.eventPage = new EventPage(this.page);

  const response = await this.apiContext.post(`${API_URL}/auth/register`, {
    data: {
      email: this.email,
      password: this.password,
    },
  });

  expect(response.ok()).toBeTruthy();
  await login(this.page, this.email, this.password);
});

When('I create a unique event from the admin panel', async function () {
  await this.eventPage.createEvent(this.eventTitle);
});

When('I capture the available seats for that event', async function () {
  this.eventCard = await this.eventPage.openEventsAndFindCard(this.eventTitle);
  this.seatsBeforeBooking = await this.eventPage.seatCountFrom(this.eventCard);
});

When('I complete a booking for that event', async function () {
  await this.eventPage.bookOneTicket(
    this.eventCard,
    this.customerName,
    this.email,
    this.phoneNumber
  );
});

Then('I should see a booking confirmation', async function () {
  this.bookingRef = await this.eventPage.bookingReference();
});

When('I view my bookings', async function () {
  await this.eventPage.verifyBookingInMyBookings(this.bookingRef, this.eventTitle);
});

Then('the booking should be listed for that event', async function () {
  await expect(this.eventPage.bookingCards.filter({ hasText: this.eventTitle })).toBeVisible();
});

When('I return to the events page', async function () {
  this.eventCard = await this.eventPage.openEventsAndFindCard(this.eventTitle);
});

Then('the event seat count should be reduced by 1', async function () {
  const seatsAfterBooking = await this.eventPage.seatCountFrom(this.eventCard);

  expect(seatsAfterBooking).toBe(this.seatsBeforeBooking - 1);
});
