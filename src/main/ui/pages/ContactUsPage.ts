// ABOUTME: Page object for the AutomationExercise Contact Us page.
// ABOUTME: Handles form submission with name, email, subject, message, and file upload.
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { pageLogger } from '../../shared/utils/logger';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

export class ContactUsPage extends BasePage {

  // ─── Form Elements ──────────────────────────────────────────────────────────

  private readonly getInTouchHeading = this.page.locator('h2:has-text("Get In Touch")');
  private readonly nameInput         = this.page.locator('input[data-qa="name"]');
  private readonly emailInput        = this.page.locator('input[data-qa="email"]');
  private readonly subjectInput      = this.page.locator('input[data-qa="subject"]');
  private readonly messageInput      = this.page.locator('textarea[data-qa="message"]');
  private readonly fileUpload        = this.page.locator('input[type="file"][name="upload_file"]');
  private readonly submitButton      = this.page.locator('input[data-qa="submit-button"]');

  // ─── Success ────────────────────────────────────────────────────────────────

  private readonly successMessage    = this.page.locator('.alert-success');
  private readonly homeButton        = this.page.locator('.btn-success');

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/contact_us');
    await this.waitForVisible(this.getInTouchHeading);
    pageLogger.info('Contact Us page loaded');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async fillContactForm(data: ContactFormData): Promise<void> {
    pageLogger.info(`Filling contact form for: ${data.name}`);
    await this.fill(this.nameInput, data.name, 'Name');
    await this.fill(this.emailInput, data.email, 'Email');
    await this.fill(this.subjectInput, data.subject, 'Subject');
    await this.fill(this.messageInput, data.message, 'Message');
    if (data.filePath) {
      await this.uploadFile(this.fileUpload, data.filePath);
    }
  }

  async clickSubmit(): Promise<void> {
    // The site triggers a browser alert() on submit — handle it
    this.handleNextDialog('accept');
    await this.click(this.submitButton, 'Submit contact form');
  }

  async submitContactForm(data: ContactFormData): Promise<void> {
    await this.fillContactForm(data);
    await this.clickSubmit();
  }

  async clickHome(): Promise<void> {
    await this.click(this.homeButton, 'Home button');
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertOnContactPage(): Promise<void> {
    await this.assertVisible(this.getInTouchHeading, 'Get In Touch heading');
    await this.assertUrl(/\/contact_us/);
  }

  async assertContactFormVisible(): Promise<void> {
    await this.assertVisible(this.nameInput, 'Name input');
    await this.assertVisible(this.emailInput, 'Email input');
    await this.assertVisible(this.subjectInput, 'Subject input');
    await this.assertVisible(this.messageInput, 'Message input');
    await this.assertVisible(this.submitButton, 'Submit button');
  }

  async assertSubmissionSuccess(): Promise<void> {
    await this.assertVisible(this.successMessage, 'Success message');
    await this.assertContainsText(this.successMessage, 'Success! Your details have been submitted successfully.');
  }
}
