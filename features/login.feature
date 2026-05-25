Feature: Login

# to verify that user able to login to the application

Scenario: to check login with valid credentials
Given i am on login screen
When  i enter "boradimple49@gmail.com" and "Jinisha@123"
And click on sign in button
Then a link with browse events should display
