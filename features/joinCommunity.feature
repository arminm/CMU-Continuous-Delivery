Feature: Join Community
As a user, I can join the community.

  Scenario: Registration
    Given I am on the home page
    Given I hit the "Register" button
    Given I provide the username "armin" and password "1234"
    Given I confirm the password "1234"
    When I hit the "Register" button
    Then I should see the welcome message for "armin"

  Scenario: Login
    Given I am on the home page
    Given I provide the username "armin" and password "1234"
    When I hit the "Login" button
    Then I should see the welcome message for "armin"
