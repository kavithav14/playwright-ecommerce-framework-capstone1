// ABOUTME: Login test for the AutomationExercise e-commerce site.
// ABOUTME: Verifies user login with pre-registered credentials from .env configuration.
import { test, expect } from '../../main/ui/fixtures/pages';
import { ENV } from '../../main/shared/config/env.config';

test.describe('User Login', () => {

  test('should login with valid credentials @smoke @critical', async ({
    loginPage, homePage,
  }) => {
    const email = ENV.credentials.username;
    const password = ENV.credentials.password;

    // Step 1: Navigate to login page and verify forms are visible
    await loginPage.goto();
    await loginPage.assertOnLoginPage();
    await loginPage.assertLoginHeading('Login to your account');

    // Step 2: Login with the configured credentials
    await loginPage.login(email, password);

    // Step 3: Verify successful login — "Logged in as" shown in navbar
    await homePage.assertOnHomePage();
    await homePage.assertLoggedIn();

    // Step 4: Logout and verify redirect to login page
    await homePage.logout();
    await loginPage.assertOnLoginPage();
  });
});
