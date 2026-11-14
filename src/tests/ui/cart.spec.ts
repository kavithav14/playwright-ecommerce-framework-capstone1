// ABOUTME: Cart tests for the AutomationExercise e-commerce site.
// ABOUTME: Verifies adding products to cart, verifying cart contents, and removing products.
import { test, expect } from '../../main/ui/fixtures/pages';

test.describe('Add/Remove Products from Cart', () => {

  test('should add products to cart and verify cart contents @smoke @critical', async ({
    homePage, cartPage,
  }) => {
    // Step 1: Navigate to home page
    await homePage.goto();
    await homePage.assertOnHomePage();

    // Step 2: Add first product to cart
    await homePage.addProductToCart(1);
    await homePage.assertCartModalVisible();
    await homePage.clickContinueShopping();

    // Step 3: Add second product to cart
    await homePage.addProductToCart(2);
    await homePage.assertCartModalVisible();
    await homePage.clickViewCart();

    // Step 4: Verify both products are in cart
    await cartPage.assertOnCartPage();
    await cartPage.assertCartNotEmpty();
    await cartPage.assertProductInCart(1);
    await cartPage.assertProductInCart(2);
    await cartPage.assertItemCount(2);
  });

  test('should remove a product from cart @regression', async ({
    homePage, cartPage,
  }) => {
    // Step 1: Add two products to cart
    await homePage.goto();
    await homePage.addProductToCart(1);
    await homePage.clickContinueShopping();
    await homePage.addProductToCart(2);
    await homePage.clickViewCart();

    // Step 2: Verify both products are in cart
    await cartPage.assertOnCartPage();
    await cartPage.assertItemCount(2);

    // Step 3: Remove the first product
    await cartPage.removeProduct(1);

    // Step 4: Verify only the second product remains
    await cartPage.assertItemCount(1);
    await cartPage.assertProductInCart(2);
  });

  test('should add product with specific quantity from detail page @regression', async ({
    productDetailPage, cartPage,
  }) => {
    // Step 1: Navigate to product detail page
    await productDetailPage.goto(1);
    await productDetailPage.assertOnProductDetailPage();

    // Step 2: Set quantity to 4 and add to cart
    await productDetailPage.addToCartWithQuantity(4);
    await productDetailPage.clickViewCart();

    // Step 3: Verify product is in cart with correct quantity
    await cartPage.assertOnCartPage();
    await cartPage.assertProductInCart(1);
    await cartPage.assertProductQuantity(1, '4');
  });
});
