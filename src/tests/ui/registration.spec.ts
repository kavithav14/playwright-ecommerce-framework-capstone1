// ABOUTME: Registration test for the AutomationExercise e-commerce site.
// ABOUTME: Verifies end-to-end user signup flow from initial form through account creation.
import { test, expect } from '../../main/ui/fixtures/pages';
import { RegistrationData } from '../../main/ui/pages/SignupPage';
import { readJson } from '../../main/shared/data/data-reader';
import { generateEmail } from '../../main/shared/utils/helpers';

const registrationData = readJson<{ defaultUser: RegistrationData }>('registration.json');

test.describe('User Registration', () => {

  test('should register a new user successfully @smoke @critical', async ({
    loginPage, signupPage, homePage,
  }) => {
    const uniqueEmail = generateEmail();
    const userName = 'TestUser';

    // Step 1: Navigate to login page and verify signup form is visible
    await loginPage.goto();
    await loginPage.assertSignupHeading('New User Signup!');

    // Step 2: Enter name and email, submit initial signup form
    await loginPage.startSignup(userName, uniqueEmail);

    // Step 3: Verify we're on the registration details page (step 2)
    await signupPage.assertOnSignupPage();

    // Step 4: Fill the full registration form using test data
    await signupPage.registerAccount(registrationData.defaultUser);

    // Step 5: Verify account was created successfully
    await signupPage.assertAccountCreated();

    // Step 6: Click continue and verify logged in on home page
    await signupPage.clickContinue();
    await homePage.assertLoggedIn(userName);

    // Cleanup: delete the test account so it doesn't pollute the system
    await homePage.deleteAccount();
  });
});
