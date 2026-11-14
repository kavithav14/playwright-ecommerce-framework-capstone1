// ABOUTME: Page object for the AutomationExercise products listing page.
// ABOUTME: Handles product search, product grid display, and add-to-cart from the listing.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class ProductsPage extends BasePage {

  // ─── Search ─────────────────────────────────────────────────────────────────

  private readonly searchInput     = this.page.locator('#search_product');
  private readonly searchButton    = this.page.locator('#submit_search');
  private readonly searchedHeading = this.page.locator('.features_items h2.title');

  // ─── Product Listing ────────────────────────────────────────────────────────

  private readonly allProductsHeading = this.page.locator('.features_items h2.title');
  private readonly productCards       = this.page.locator('.features_items .product-image-wrapper');
  private readonly productNames       = this.page.locator('.features_items .productinfo p');
  private readonly productPrices      = this.page.locator('.features_items .productinfo h2');

  // ─── Cart Modal ─────────────────────────────────────────────────────────────

  private readonly continueShoppingBtn = this.page.locator('.close-modal');
  private readonly viewCartLink        = this.page.locator('#cartModal a[href="/view_cart"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/products');
    await this.waitForVisible(this.allProductsHeading);
    pageLogger.info('Products page loaded');
  }

  // ─── Search ──────────────────────────────────────────────────────────────────

  async searchProduct(query: string): Promise<void> {
    pageLogger.info(`Searching for: ${query}`);
    await this.fill(this.searchInput, query, 'Search product');
    await this.click(this.searchButton, 'Search button');
  }

  // ─── Product Actions ─────────────────────────────────────────────────────────

  async addProductToCart(productId: number): Promise<void> {
    const addBtn = this.page.locator(
      `a.add-to-cart[data-product-id="${productId}"]`
    ).first();
    await this.click(addBtn, `Add product ${productId} to cart`);
  }

  async addProductToCartByHover(productId: number): Promise<void> {
    const card = this.page.locator(
      `.product-image-wrapper:has(a.add-to-cart[data-product-id="${productId}"])`
    );
    await this.hover(card);
    const overlayBtn = card.locator(`.product-overlay a.add-to-cart[data-product-id="${productId}"]`);
    await this.click(overlayBtn, `Add product ${productId} via hover`);
  }

  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingBtn, 'Continue Shopping');
  }

  async clickViewCart(): Promise<void> {
    await this.click(this.viewCartLink, 'View Cart from modal');
  }

  async viewProduct(productId: number): Promise<void> {
    const link = this.page.locator(`a[href="/product_details/${productId}"]`);
    await this.click(link, `View product ${productId}`);
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getProductCount(): Promise<number> {
    return this.getCount(this.productCards);
  }

  async getProductNames(): Promise<string[]> {
    return this.getAllTexts(this.productNames);
  }

  async getHeadingText(): Promise<string> {
    return this.getText(this.allProductsHeading);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnProductsPage(): Promise<void> {
    await this.assertVisible(this.allProductsHeading, 'Products heading should be visible');
    await this.assertUrl(/\/products/);
  }

  async assertAllProductsHeading(): Promise<void> {
    await this.assertContainsText(this.allProductsHeading, 'All Products');
  }

  async assertSearchedProductsHeading(): Promise<void> {
    await this.assertContainsText(this.searchedHeading, 'Searched Products');
  }

  async assertProductsVisible(): Promise<void> {
    await this.assertCountGreaterThan(this.productCards, 0);
  }

  async assertSearchResultsContain(productName: string): Promise<void> {
    const names = await this.getProductNames();
    const found = names.some(n => n.toLowerCase().includes(productName.toLowerCase()));
    if (!found) {
      throw new Error(`Product "${productName}" not found in search results: ${names.join(', ')}`);
    }
  }
}
