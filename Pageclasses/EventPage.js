const { expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

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

class EventPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('#event-title-input');
        this.description = page.locator('#admin-event-form textarea');
        this.city = page.getByLabel('City');
        this.venue = page.getByLabel('Venue');
        this.eventdateandtime = page.getByLabel('Event Date & Time');
        this.price = page.getByLabel('Price ($)');
        this.totalseats = page.getByLabel('Total Seats');
        this.submitbutton = page.locator('#add-event-btn');
        this.toastMessage = page.getByText('Event created!');
        this.eventCards = page.getByTestId('event-card');
        this.bookingCards = page.locator('#booking-card');
    }

    async createEvent(eventTitle) {
        await this.page.goto(`${BASE_URL}/admin/events`);
        await this.title.fill(eventTitle);
        await this.description.fill('Created by an automated Playwright booking flow.');
        await this.city.fill('Bangalore');
        await this.venue.fill('Whitefield');
        await this.eventdateandtime.fill(futureDateValue());
        await this.price.fill('100');
        await this.totalseats.fill('50');
        await this.submitbutton.click();
        await expect(this.toastMessage).toBeVisible();
    }

    getEventCard(eventTitle) {
        return this.eventCards.filter({ hasText: eventTitle });
    }

    async openEventsAndFindCard(eventTitle) {
        await this.page.goto(`${BASE_URL}/events`);
        await expect(this.eventCards.first()).toBeVisible();

        const eventCard = this.getEventCard(eventTitle);
        await expect(eventCard).toBeVisible({ timeout: 5000 });
        return eventCard;
    }

    async seatCountFrom(eventCard) {
        const seatText = await eventCard.getByText(/seat/i).first().innerText();
        const match = seatText.match(/\d+/);

        if (!match) {
            throw new Error(`Could not parse seat count from: ${seatText}`);
        }

        return Number(match[0]);
    }

    async bookOneTicket(eventCard, customerName, customerEmail, phoneNumber) {
        await eventCard.getByTestId('book-now-btn').click();
        await expect(this.page.locator('#ticket-count')).toHaveText('1');
        await this.page.getByLabel('Full Name').fill(customerName);
        await this.page.locator('#customer-email').fill(customerEmail);
        await this.page.getByPlaceholder('+91 98765 43210').fill(phoneNumber);
        await this.page.locator('.confirm-booking-btn').click();
    }

    async bookingReference() {
        const bookingReference = this.page.locator('.booking-ref').first();
        await expect(bookingReference).toBeVisible();
        return (await bookingReference.innerText()).trim();
    }

    async verifyBookingInMyBookings(bookingRef, eventTitle) {
        await this.page.getByRole('link', { name: 'View My Bookings' }).click();
        await expect(this.page).toHaveURL(`${BASE_URL}/bookings`);
        await expect(this.bookingCards.first()).toBeVisible();

        const matchedBookingCard = this.bookingCards.filter({
            has: this.page.locator('.booking-ref').filter({ hasText: bookingRef }),
        });

        await expect(matchedBookingCard).toBeVisible();
        await expect(matchedBookingCard).toContainText(eventTitle);
    }
}

module.exports = { EventPage, futureDateValue };
