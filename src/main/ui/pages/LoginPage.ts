// ABOUTME: Page object for the AutomationExercise login and signup (step 1) page.
// ABOUTME: Handles user login, initial signup form submission, and related assertions.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export class LoginPage extends BasePage {

  // ─── Login Form ─────────────────────────────────────────────────────────────

  private readonly loginHeading   = this.page.locator('.login-form h2');
  private readonly loginEmail     = this.page.locator('input[data-qa="login-email"]');
  private readonly loginPassword  = this.page.locator('input[data-qa="login-password"]');
  private readonly loginButton    = this.page.locator('button[data-qa="login-button"]');
  private readonly loginError     = this.page.locator('.login-form p[style*="color: red"]');

  // ─── Signup Form (Step 1) ───────────────────────────────────────────────────

  private readonly signupHeading  = this.page.locator('.signup-form h2');
  private readonly signupName     = this.page.locator('input[data-qa="signup-name"]');
  private readonly signupEmail    = this.page.locator('input[data-qa="signup-email"]');
  private readonly signupButton   = this.page.locator('button[data-qa="signup-button"]');
  private readonly signupError    = this.page.locator('.signup-form p[style*="color: red"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForVisible(this.loginButton);
    pageLogger.info('Login page loaded');
  }

  // ─── Login Actions ──────────────────────────────────────────────────────────

  async enterLoginEmail(email: string): Promise<void> {
    await this.fill(this.loginEmail, email, 'Login email');
  }

  async enterLoginPassword(password: string): Promise<void> {
    await this.fill(this.loginPassword, password, 'Login password');
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton, 'Login button');
  }

  async login(email: string, password: string): Promise<void> {
    pageLogger.info(`Logging in as: ${email}`);
    await this.enterLoginEmail(email);
    await this.enterLoginPassword(password);
    await this.clickLogin();
  }

  // ─── Signup Actions (Step 1) ────────────────────────────────────────────────

  async enterSignupName(name: string): Promise<void> {
    await this.fill(this.signupName, name, 'Signup name');
  }

  async enterSignupEmail(email: string): Promise<void> {
    await this.fill(this.signupEmail, email, 'Signup email');
  }

  async clickSignup(): Promise<void> {
    await this.click(this.signupButton, 'Signup button');
  }

  async startSignup(name: string, email: string): Promise<void> {
    pageLogger.info(`Starting signup for: ${name} (${email})`);
    await this.enterSignupName(name);
    await this.enterSignupEmail(email);
    await this.clickSignup();
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  async getLoginErrorMessage(): Promise<string> {
    return this.getText(this.loginError);
  }

  async getSignupErrorMessage(): Promise<string> {
    return this.getText(this.signupError);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnLoginPage(): Promise<void> {
    await this.assertVisible(this.loginButton, 'Login button should be visible');
    await this.assertUrl(/\/login/);
  }

  async assertLoginFormVisible(): Promise<void> {
    await this.assertVisible(this.loginEmail, 'Login email input');
    await this.assertVisible(this.loginPassword, 'Login password input');
    await this.assertVisible(this.loginButton, 'Login button');
  }

  async assertSignupFormVisible(): Promise<void> {
    await this.assertVisible(this.signupName, 'Signup name input');
    await this.assertVisible(this.signupEmail, 'Signup email input');
    await this.assertVisible(this.signupButton, 'Signup button');
  }

  async assertLoginHeading(expected: string): Promise<void> {
    await this.assertContainsText(this.loginHeading, expected);
  }

  async assertSignupHeading(expected: string): Promise<void> {
    await this.assertContainsText(this.signupHeading, expected);
  }

  async assertLoginError(expected: string): Promise<void> {
    await this.assertContainsText(this.loginError, expected);
  }

  async assertSignupError(expected: string): Promise<void> {
    await this.assertContainsText(this.signupError, expected);
  }
}
