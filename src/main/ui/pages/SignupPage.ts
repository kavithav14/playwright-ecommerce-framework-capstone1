// ABOUTME: Page object for the AutomationExercise registration form (signup step 2).
// ABOUTME: Handles full account creation with personal details, address, and preferences.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export interface RegistrationData {
  title?: 'Mr' | 'Mrs';
  password: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  newsletter?: boolean;
  specialOffers?: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class SignupPage extends BasePage {

  // ─── Account Information ────────────────────────────────────────────────────

  private readonly titleMr         = this.page.locator('#id_gender1');
  private readonly titleMrs        = this.page.locator('#id_gender2');
  private readonly nameInput       = this.page.locator('input[data-qa="name"]');
  private readonly emailInput      = this.page.locator('input[data-qa="email"]');
  private readonly passwordInput   = this.page.locator('input[data-qa="password"]');
  private readonly daysDropdown    = this.page.locator('select[data-qa="days"]');
  private readonly monthsDropdown  = this.page.locator('select[data-qa="months"]');
  private readonly yearsDropdown   = this.page.locator('select[data-qa="years"]');
  private readonly newsletterBox   = this.page.locator('#newsletter');
  private readonly specialOfferBox = this.page.locator('#optin');

  // ─── Address Information ────────────────────────────────────────────────────

  private readonly firstNameInput  = this.page.locator('input[data-qa="first_name"]');
  private readonly lastNameInput   = this.page.locator('input[data-qa="last_name"]');
  private readonly companyInput    = this.page.locator('input[data-qa="company"]');
  private readonly address1Input   = this.page.locator('input[data-qa="address"]');
  private readonly address2Input   = this.page.locator('input[data-qa="address2"]');
  private readonly countryDropdown = this.page.locator('select[data-qa="country"]');
  private readonly stateInput      = this.page.locator('input[data-qa="state"]');
  private readonly cityInput       = this.page.locator('input[data-qa="city"]');
  private readonly zipcodeInput    = this.page.locator('input[data-qa="zipcode"]');
  private readonly mobileInput     = this.page.locator('input[data-qa="mobile_number"]');

  // ─── Submit ─────────────────────────────────────────────────────────────────

  private readonly createAccountBtn = this.page.locator('button[data-qa="create-account"]');

  // ─── Account Created Confirmation ───────────────────────────────────────────

  private readonly accountCreatedHeading = this.page.locator('[data-qa="account-created"]');
  private readonly continueBtn           = this.page.locator('[data-qa="continue-button"]');

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    pageLogger.info('Filling registration form');

    // Title
    if (data.title === 'Mrs') {
      await this.click(this.titleMrs, 'Title: Mrs');
    } else {
      await this.click(this.titleMr, 'Title: Mr');
    }

    // Account info
    await this.fill(this.passwordInput, data.password, 'Password');

    if (data.birthDay) await this.selectByValue(this.daysDropdown, data.birthDay);
    if (data.birthMonth) await this.selectByValue(this.monthsDropdown, data.birthMonth);
    if (data.birthYear) await this.selectByValue(this.yearsDropdown, data.birthYear);

    if (data.newsletter) await this.check(this.newsletterBox, 'Newsletter');
    if (data.specialOffers) await this.check(this.specialOfferBox, 'Special offers');

    // Address
    await this.fill(this.firstNameInput, data.firstName, 'First name');
    await this.fill(this.lastNameInput, data.lastName, 'Last name');
    if (data.company) await this.fill(this.companyInput, data.company, 'Company');
    await this.fill(this.address1Input, data.address1, 'Address 1');
    if (data.address2) await this.fill(this.address2Input, data.address2, 'Address 2');
    await this.selectByValue(this.countryDropdown, data.country);
    await this.fill(this.stateInput, data.state, 'State');
    await this.fill(this.cityInput, data.city, 'City');
    await this.fill(this.zipcodeInput, data.zipcode, 'Zipcode');
    await this.fill(this.mobileInput, data.mobileNumber, 'Mobile number');
  }

  async clickCreateAccount(): Promise<void> {
    await this.click(this.createAccountBtn, 'Create Account');
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueBtn, 'Continue after account created');
  }

  async registerAccount(data: RegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.clickCreateAccount();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnSignupPage(): Promise<void> {
    await this.assertVisible(this.passwordInput, 'Password field should be visible');
  }

  async assertAccountCreated(): Promise<void> {
    await this.assertVisible(this.accountCreatedHeading, 'Account Created heading');
    await this.assertContainsText(this.accountCreatedHeading, 'Account Created!');
  }
}
