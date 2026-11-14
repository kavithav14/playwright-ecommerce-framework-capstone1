// ABOUTME: Page object for the AutomationExercise checkout page.
// ABOUTME: Handles address display, order review, comment entry, and place-order navigation.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class CheckoutPage extends BasePage {

  // ─── Address Sections ───────────────────────────────────────────────────────

  private readonly deliveryAddress  = this.page.locator('#address_delivery');
  private readonly billingAddress   = this.page.locator('#address_invoice');

  // ─── Order Review ───────────────────────────────────────────────────────────

  private readonly orderTable       = this.page.locator('#cart_info');
  private readonly orderRows        = this.page.locator('#cart_info tbody tr');

  // ─── Comment & Place Order ──────────────────────────────────────────────────

  private readonly commentTextarea  = this.page.locator('textarea[name="message"]');
  private readonly placeOrderBtn    = this.page.locator('a.check_out[href="/payment"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/checkout');
    await this.waitForDomLoaded();
    pageLogger.info('Checkout page loaded');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async enterComment(comment: string): Promise<void> {
    await this.fill(this.commentTextarea, comment, 'Order comment');
  }

  async clickPlaceOrder(): Promise<void> {
    await this.click(this.placeOrderBtn, 'Place Order');
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getDeliveryAddressText(): Promise<string> {
    return this.getText(this.deliveryAddress);
  }

  async getBillingAddressText(): Promise<string> {
    return this.getText(this.billingAddress);
  }

  async getDeliveryName(): Promise<string> {
    const nameEl = this.deliveryAddress.locator('.address_firstname.address_lastname');
    return this.getText(nameEl);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnCheckoutPage(): Promise<void> {
    await this.assertVisible(this.deliveryAddress, 'Delivery address should be visible');
    await this.assertUrl(/\/checkout/);
  }

  async assertDeliveryAddressVisible(): Promise<void> {
    await this.assertVisible(this.deliveryAddress, 'Delivery address section');
  }

  async assertBillingAddressVisible(): Promise<void> {
    await this.assertVisible(this.billingAddress, 'Billing address section');
  }

  async assertOrderTableVisible(): Promise<void> {
    await this.assertVisible(this.orderTable, 'Order review table');
  }

  async assertDeliveryAddressContains(text: string): Promise<void> {
    await this.assertContainsText(this.deliveryAddress, text);
  }

  async assertBillingAddressContains(text: string): Promise<void> {
    await this.assertContainsText(this.billingAddress, text);
  }
}
