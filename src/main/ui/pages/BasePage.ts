// ABOUTME: Abstract base class for all page objects in the application.
// ABOUTME: Inherits WebAssertions (interactions + assertions) and adds navigation relative to BASE_URL.
import { Page } from '@playwright/test';
import { WebAssertions } from '../common/WebAssertions';
import { ENV } from '../../shared/config/env.config';
import { pageLogger } from '../../shared/utils/logger';

export abstract class BasePage extends WebAssertions {

  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  async navigate(path = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${ENV.baseUrl}${path}`;
    pageLogger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}
