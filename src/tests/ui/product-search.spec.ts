// ABOUTME: Product search tests for the AutomationExercise e-commerce site.
// ABOUTME: Verifies product listing visibility, search functionality, and product detail navigation.
import { test, expect } from '../../main/ui/fixtures/pages';

test.describe('Product Search', () => {

  test('should display all products and search by name @smoke', async ({
    productsPage,
  }) => {
    // Step 1: Navigate to products page
    await productsPage.goto();
    await productsPage.assertOnProductsPage();
    await productsPage.assertAllProductsHeading();

    // Step 2: Verify products are listed
    await productsPage.assertProductsVisible();

    // Step 3: Search for a product
    await productsPage.searchProduct('Top');

    // Step 4: Verify search results heading changed
    await productsPage.assertSearchedProductsHeading();

    // Step 5: Verify matching products are displayed
    await productsPage.assertProductsVisible();
  });

  test('should navigate to product detail page @regression', async ({
    productsPage, productDetailPage,
  }) => {
    // Step 1: Navigate to products page
    await productsPage.goto();
    await productsPage.assertOnProductsPage();

    // Step 2: Click "View Product" for the first product
    await productsPage.viewProduct(1);

    // Step 3: Verify product detail page loaded with all info
    await productDetailPage.assertOnProductDetailPage();
    await productDetailPage.assertProductInfoVisible();
  });
});
