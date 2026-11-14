// ABOUTME: Checkout flow and order placement tests for the AutomationExercise e-commerce site.
// ABOUTME: Verifies end-to-end purchase flow: login, add to cart, checkout, pay, and confirm order.
import { test, expect } from '../../main/ui/fixtures/pages';
import { PaymentData } from '../../main/ui/pages/PaymentPage';
import { readJson } from '../../main/shared/data/data-reader';

const testData = readJson<{ payment: PaymentData }>('registration.json');

test.describe('Checkout Flow and Order Placement', () => {

  test('should complete full checkout and place order successfully @smoke @critical', async ({
    loggedIn, homePage, cartPage, checkoutPage, paymentPage,
  }) => {
    // ── Step 1: Add products to cart ──────────────────────────────────────────
    await homePage.addProductToCart(1);
    await homePage.clickContinueShopping();
    await homePage.addProductToCart(2);
    await homePage.clickViewCart();

    // ── Step 2: Verify cart and proceed to checkout ───────────────────────────
    await cartPage.assertOnCartPage();
    await cartPage.assertCartNotEmpty();
    await cartPage.clickProceedToCheckout();

    // ── Step 3: Verify checkout page — address and order details ──────────────
    await checkoutPage.assertOnCheckoutPage();
    await checkoutPage.assertDeliveryAddressVisible();
    await checkoutPage.assertBillingAddressVisible();
    await checkoutPage.assertOrderTableVisible();

    // ── Step 4: Enter comment and place the order ─────────────────────────────
    await checkoutPage.enterComment('Please deliver between 9am and 5pm.');
    await checkoutPage.clickPlaceOrder();

    // ── Step 5: Fill payment details and confirm ──────────────────────────────
    await paymentPage.assertOnPaymentPage();
    await paymentPage.submitPayment(testData.payment);

    // ── Step 6: Verify order was placed successfully ──────────────────────────
    await paymentPage.assertOrderPlaced();
  });

  test('should prompt login when checking out without authentication @regression', async ({
    homePage, cartPage,
  }) => {
    // Step 1: Add a product to cart without being logged in
    await homePage.goto();
    await homePage.addProductToCart(1);
    await homePage.clickViewCart();

    // Step 2: Try to proceed to checkout
    await cartPage.assertOnCartPage();
    await cartPage.clickProceedToCheckout();

    // Step 3: Verify the modal prompts user to register/login
    await cartPage.assertCheckoutModalVisible();
  });
});
