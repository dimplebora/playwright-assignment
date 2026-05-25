Feature: Login

# to verify that user able to login to the application

Scenario: to check login with valid credentials
Given i am on login screen
When  i enter "username" and "password"
And click on sign in button
Then a link with browse events should display
