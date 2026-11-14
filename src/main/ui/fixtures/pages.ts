// ABOUTME: Playwright custom fixtures for all page objects and authentication.
// ABOUTME: Provides page instances and a loggedIn fixture that handles login before tests.
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { ENV } from '../../shared/config/env.config';
import { pageLogger } from '../../shared/utils/logger';

type UIFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactUsPage: ContactUsPage;
  loggedIn: void;
};

export const test = base.extend<UIFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },

  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },

  loggedIn: async ({ page, loginPage, homePage }, use) => {
    const email = ENV.credentials.username;
    const password = ENV.credentials.password;

    if (!email || !password) {
      throw new Error(
        'APP_USERNAME and APP_PASSWORD must be set in .env for authenticated tests. ' +
        'Register an account on automationexercise.com first, then add credentials to .env.'
      );
    }

    pageLogger.info(`Logging in as: ${email}`);
    await loginPage.goto();
    await loginPage.login(email, password);
    await homePage.assertLoggedIn();

    await use();
  },
});

export { expect } from '@playwright/test';
