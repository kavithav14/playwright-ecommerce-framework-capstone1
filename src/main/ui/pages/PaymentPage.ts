// ABOUTME: Page object for the AutomationExercise payment page.
// ABOUTME: Handles payment form entry, order confirmation, and post-payment actions.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage extends BasePage {

  // ─── Payment Form ───────────────────────────────────────────────────────────

  private readonly nameOnCard    = this.page.locator('input[data-qa="name-on-card"]');
  private readonly cardNumber    = this.page.locator('input[data-qa="card-number"]');
  private readonly cvc           = this.page.locator('input[data-qa="cvc"]');
  private readonly expiryMonth   = this.page.locator('input[data-qa="expiry-month"]');
  private readonly expiryYear    = this.page.locator('input[data-qa="expiry-year"]');
  private readonly payButton     = this.page.locator('[data-qa="pay-button"]');

  // ─── Confirmation ───────────────────────────────────────────────────────────

  private readonly orderConfirmation = this.page.locator('[data-qa="order-placed"]');
  private readonly downloadInvoice   = this.page.locator('.check_out');
  private readonly continueBtn       = this.page.locator('[data-qa="continue-button"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async fillPaymentDetails(data: PaymentData): Promise<void> {
    pageLogger.info('Filling payment details');
    await this.fill(this.nameOnCard, data.nameOnCard, 'Name on card');
    await this.fill(this.cardNumber, data.cardNumber, 'Card number');
    await this.fill(this.cvc, data.cvc, 'CVC');
    await this.fill(this.expiryMonth, data.expiryMonth, 'Expiry month');
    await this.fill(this.expiryYear, data.expiryYear, 'Expiry year');
  }

  async clickPayAndConfirm(): Promise<void> {
    await this.click(this.payButton, 'Pay and Confirm Order');
  }

  async submitPayment(data: PaymentData): Promise<void> {
    await this.fillPaymentDetails(data);
    await this.clickPayAndConfirm();
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueBtn, 'Continue after order');
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnPaymentPage(): Promise<void> {
    await this.assertVisible(this.nameOnCard, 'Payment form should be visible');
    await this.assertUrl(/\/payment/);
  }

  async assertOrderPlaced(): Promise<void> {
    await this.assertVisible(this.orderConfirmation, 'Order confirmation');
    await this.assertContainsText(this.orderConfirmation, 'Order Placed!');
  }
}
