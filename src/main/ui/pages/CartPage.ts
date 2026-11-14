// ABOUTME: Page object for the AutomationExercise cart page.
// ABOUTME: Handles cart item display, quantity verification, item removal, and checkout navigation.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class CartPage extends BasePage {

  // ─── Cart Table ─────────────────────────────────────────────────────────────

  private readonly cartInfo        = this.page.locator('#cart_info');
  private readonly emptyCartMsg    = this.page.locator('#empty_cart');
  private readonly cartRows        = this.page.locator('#cart_info_table tbody tr');

  // ─── Checkout ───────────────────────────────────────────────────────────────

  private readonly proceedToCheckout = this.page.locator('.check_out');
  private readonly checkoutModal     = this.page.locator('#checkoutModal');
  private readonly modalLoginLink    = this.page.locator('#checkoutModal a[href="/login"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/view_cart');
    await this.waitForDomLoaded();
    pageLogger.info('Cart page loaded');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async removeProduct(productId: number): Promise<void> {
    const deleteBtn = this.page.locator(`.cart_quantity_delete[data-product-id="${productId}"]`);
    await this.click(deleteBtn, `Remove product ${productId}`);
    pageLogger.info(`Removed product ${productId} from cart`);
  }

  async clickProceedToCheckout(): Promise<void> {
    await this.click(this.proceedToCheckout, 'Proceed to Checkout');
  }

  async clickModalLoginLink(): Promise<void> {
    await this.click(this.modalLoginLink, 'Register / Login from checkout modal');
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getCartItemCount(): Promise<number> {
    return this.getCount(this.cartRows);
  }

  async getProductName(productId: number): Promise<string> {
    const row = this.page.locator(`#product-${productId}`);
    return this.getText(row.locator('.cart_description h4 a'));
  }

  async getProductPrice(productId: number): Promise<string> {
    const row = this.page.locator(`#product-${productId}`);
    return this.getText(row.locator('.cart_price p'));
  }

  async getProductQuantity(productId: number): Promise<string> {
    const row = this.page.locator(`#product-${productId}`);
    return this.getText(row.locator('.cart_quantity button'));
  }

  async getProductTotal(productId: number): Promise<string> {
    const row = this.page.locator(`#product-${productId}`);
    return this.getText(row.locator('.cart_total .cart_total_price'));
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnCartPage(): Promise<void> {
    await this.assertVisible(this.cartInfo, 'Cart info should be visible');
    await this.assertUrl(/\/view_cart/);
  }

  async assertCartEmpty(): Promise<void> {
    await this.assertVisible(this.emptyCartMsg, 'Empty cart message');
  }

  async assertCartNotEmpty(): Promise<void> {
    await this.assertCountGreaterThan(this.cartRows, 0);
  }

  async assertProductInCart(productId: number): Promise<void> {
    const row = this.page.locator(`#product-${productId}`);
    await this.assertVisible(row, `Product ${productId} should be in cart`);
  }

  async assertProductNotInCart(productId: number): Promise<void> {
    const row = this.page.locator(`#product-${productId}`);
    await this.assertHidden(row, `Product ${productId} should not be in cart`);
  }

  async assertProductQuantity(productId: number, expected: string): Promise<void> {
    const row = this.page.locator(`#product-${productId}`);
    await this.assertContainsText(row.locator('.cart_quantity button'), expected);
  }

  async assertCheckoutModalVisible(): Promise<void> {
    await this.assertVisible(this.checkoutModal, 'Checkout modal should be visible');
  }

  async assertItemCount(expected: number): Promise<void> {
    await this.assertCount(this.cartRows, expected);
  }
}
