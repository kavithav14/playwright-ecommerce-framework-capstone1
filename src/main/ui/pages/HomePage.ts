// ABOUTME: Page object for the AutomationExercise home page.
// ABOUTME: Encapsulates navigation bar, featured products, category sidebar, and subscription.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class HomePage extends BasePage {

  // ─── Navigation Bar ─────────────────────────────────────────────────────────

  private readonly navBar          = this.page.locator('.shop-menu .nav.navbar-nav');
  private readonly homeLink        = this.page.locator('a[href="/"]').first();
  private readonly productsLink    = this.page.locator('a[href="/products"]');
  private readonly cartLink        = this.page.locator('a[href="/view_cart"]');
  private readonly loginLink       = this.page.locator('a[href="/login"]');
  private readonly contactUsLink   = this.page.locator('a[href="/contact_us"]');
  private readonly logoutLink      = this.page.locator('a[href="/logout"]');
  private readonly deleteAccLink   = this.page.locator('a[href="/delete_account"]');
  private readonly loggedInUser    = this.page.locator('a:has-text("Logged in as")');

  // ─── Featured Products ──────────────────────────────────────────────────────

  private readonly featuredItems   = this.page.locator('.features_items');
  private readonly productCards    = this.page.locator('.features_items .product-image-wrapper');
  private readonly addToCartButtons = this.page.locator('a.add-to-cart');

  // ─── Cart Modal (after adding a product) ────────────────────────────────────

  private readonly cartModal           = this.page.locator('#cartModal');
  private readonly continueShoppingBtn = this.page.locator('.close-modal');
  private readonly viewCartLink        = this.page.locator('#cartModal a[href="/view_cart"]');

  // ─── Category Sidebar ───────────────────────────────────────────────────────

  private readonly womenCategory   = this.page.locator('a[href="#Women"]');
  private readonly menCategory     = this.page.locator('a[href="#Men"]');
  private readonly kidsCategory    = this.page.locator('a[href="#Kids"]');

  // ─── Subscription ──────────────────────────────────────────────────────────

  private readonly subscribeEmail  = this.page.locator('#susbscribe_email');
  private readonly subscribeBtn    = this.page.locator('#subscribe');
  private readonly subscribeSuccess = this.page.locator('#success-subscribe');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/');
    pageLogger.info('Home page loaded');
  }

  async goToProducts(): Promise<void> {
    await this.click(this.productsLink, 'Products nav link');
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink, 'Cart nav link');
  }

  async goToLogin(): Promise<void> {
    await this.click(this.loginLink, 'Signup / Login nav link');
  }

  async goToContactUs(): Promise<void> {
    await this.click(this.contactUsLink, 'Contact Us nav link');
  }

  async logout(): Promise<void> {
    pageLogger.info('Logging out');
    await this.click(this.logoutLink, 'Logout nav link');
  }

  async deleteAccount(): Promise<void> {
    await this.click(this.deleteAccLink, 'Delete Account nav link');
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
    await this.click(overlayBtn, `Add product ${productId} via hover overlay`);
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

  // ─── Subscription ──────────────────────────────────────────────────────────

  async subscribe(email: string): Promise<void> {
    await this.scrollToBottom();
    await this.fill(this.subscribeEmail, email, 'Subscription email');
    await this.click(this.subscribeBtn, 'Subscribe button');
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getLoggedInUsername(): Promise<string> {
    const text = await this.getText(this.loggedInUser);
    return text.replace('Logged in as', '').trim();
  }

  async getProductCount(): Promise<number> {
    return this.getCount(this.productCards);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnHomePage(): Promise<void> {
    await this.assertVisible(this.featuredItems, 'Featured items should be visible');
  }

  async assertLoggedIn(username?: string): Promise<void> {
    await this.assertVisible(this.loggedInUser, 'Logged in user should be visible');
    if (username) {
      await this.assertContainsText(this.loggedInUser, username);
    }
  }

  async assertLoggedOut(): Promise<void> {
    await this.assertVisible(this.loginLink, 'Login link should be visible');
  }

  async assertCartModalVisible(): Promise<void> {
    await this.assertVisible(this.cartModal, 'Cart modal should be visible');
  }

  async assertSubscriptionSuccess(): Promise<void> {
    await this.assertVisible(this.subscribeSuccess, 'Subscription success message');
  }

  async assertProductsVisible(): Promise<void> {
    await this.assertCountGreaterThan(this.productCards, 0);
  }

  async assertNavBarVisible(): Promise<void> {
    await this.assertVisible(this.navBar, 'Navigation bar should be visible');
  }
}
