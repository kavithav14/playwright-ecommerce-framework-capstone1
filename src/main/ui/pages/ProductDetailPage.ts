// ABOUTME: Page object for the AutomationExercise product detail page.
// ABOUTME: Handles product info display, quantity selection, add to cart, and product reviews.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class ProductDetailPage extends BasePage {

  // ─── Product Information ────────────────────────────────────────────────────

  private readonly productName      = this.page.locator('.product-information h2');
  private readonly productCategory  = this.page.locator('.product-information p').first();
  private readonly productPrice     = this.page.locator('.product-information span span');
  private readonly productAvail     = this.page.locator('.product-information p:has-text("Availability:")');
  private readonly productCondition = this.page.locator('.product-information p:has-text("Condition:")');
  private readonly productBrand     = this.page.locator('.product-information p:has-text("Brand:")');
  private readonly productImage     = this.page.locator('.view-product img');

  // ─── Quantity & Cart ────────────────────────────────────────────────────────

  private readonly quantityInput    = this.page.locator('#quantity');
  private readonly addToCartBtn     = this.page.locator('button.cart');

  // ─── Cart Modal ─────────────────────────────────────────────────────────────

  private readonly continueShoppingBtn = this.page.locator('.close-modal');
  private readonly viewCartLink        = this.page.locator('#cartModal a[href="/view_cart"]');

  // ─── Review Section ─────────────────────────────────────────────────────────

  private readonly reviewNameInput  = this.page.locator('#name');
  private readonly reviewEmailInput = this.page.locator('#email');
  private readonly reviewTextarea   = this.page.locator('#review');
  private readonly reviewSubmitBtn  = this.page.locator('#button-review');
  private readonly reviewSuccess   = this.page.locator('#review-section .alert-success');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(productId: number): Promise<void> {
    await this.navigate(`/product_details/${productId}`);
    await this.waitForVisible(this.productName);
    pageLogger.info(`Product detail page loaded for product ${productId}`);
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async setQuantity(quantity: number): Promise<void> {
    await this.clear(this.quantityInput);
    await this.fill(this.quantityInput, quantity.toString(), 'Quantity');
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartBtn, 'Add to cart');
  }

  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingBtn, 'Continue Shopping');
  }

  async clickViewCart(): Promise<void> {
    await this.click(this.viewCartLink, 'View Cart from modal');
  }

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  async submitReview(name: string, email: string, review: string): Promise<void> {
    pageLogger.info(`Submitting review by: ${name}`);
    await this.fill(this.reviewNameInput, name, 'Review name');
    await this.fill(this.reviewEmailInput, email, 'Review email');
    await this.fill(this.reviewTextarea, review, 'Review text');
    await this.click(this.reviewSubmitBtn, 'Submit review');
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getProductName(): Promise<string> {
    return this.getText(this.productName);
  }

  async getProductPrice(): Promise<string> {
    return this.getText(this.productPrice);
  }

  async getProductAvailability(): Promise<string> {
    return this.getText(this.productAvail);
  }

  async getProductCondition(): Promise<string> {
    return this.getText(this.productCondition);
  }

  async getProductBrand(): Promise<string> {
    return this.getText(this.productBrand);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnProductDetailPage(): Promise<void> {
    await this.assertVisible(this.productName, 'Product name should be visible');
    await this.assertUrl(/\/product_details\//);
  }

  async assertProductInfoVisible(): Promise<void> {
    await this.assertVisible(this.productName, 'Product name');
    await this.assertVisible(this.productPrice, 'Product price');
    await this.assertVisible(this.productAvail, 'Product availability');
    await this.assertVisible(this.productCondition, 'Product condition');
    await this.assertVisible(this.productBrand, 'Product brand');
    await this.assertVisible(this.productImage, 'Product image');
  }

  async assertProductName(expected: string): Promise<void> {
    await this.assertContainsText(this.productName, expected);
  }

  async assertReviewSubmitted(): Promise<void> {
    await this.assertVisible(this.reviewSuccess, 'Review success message');
  }
}
