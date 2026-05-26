Feature: Create event and complete booking

Scenario: Admin creates a new event and booking reduces seats by one
  Given I create my own credentials and login
  When I create a unique event from the admin panel
  And I capture the available seats for that event
  And I complete a booking for that event
  Then I should see a booking confirmation
  When I view my bookings
  Then the booking should be listed for that event
  When I return to the events page
  Then the event seat count should be reduced by 1
