// ABOUTME: Generic, application-agnostic assertion layer extending WebActions.
// ABOUTME: Provides web-first assertions for visibility, text, state, count, and page-level checks.
import { Locator, expect } from '@playwright/test';
import { WebActions } from './WebActions';

export class WebAssertions extends WebActions {

  // ─── Visibility ──────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  async assertAttached(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeAttached();
  }

  async assertInViewport(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeInViewport();
  }

  // ─── Text / Value ────────────────────────────────────────────────────────────

  async assertText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async assertContainsText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async assertNotContainsText(locator: Locator, text: string): Promise<void> {
    await expect(locator).not.toContainText(text);
  }

  async assertValue(locator: Locator, expectedValue: string | RegExp): Promise<void> {
    await expect(locator).toHaveValue(expectedValue);
  }

  async assertEmpty(locator: Locator): Promise<void> {
    await expect(locator).toBeEmpty();
  }

  async assertNotEmpty(locator: Locator): Promise<void> {
    await expect(locator).not.toBeEmpty();
  }

  async assertAttribute(locator: Locator, name: string, value: string | RegExp): Promise<void> {
    await expect(locator).toHaveAttribute(name, value);
  }

  async assertCssValue(locator: Locator, property: string, value: string | RegExp): Promise<void> {
    await expect(locator).toHaveCSS(property, value);
  }

  async assertClass(locator: Locator, expected: string | RegExp): Promise<void> {
    await expect(locator).toHaveClass(expected);
  }

  async assertId(locator: Locator, id: string | RegExp): Promise<void> {
    await expect(locator).toHaveId(id);
  }

  // ─── State ───────────────────────────────────────────────────────────────────

  async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  async assertChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  async assertUnchecked(locator: Locator): Promise<void> {
    await expect(locator).not.toBeChecked();
  }

  async assertFocused(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  async assertEditable(locator: Locator): Promise<void> {
    await expect(locator).toBeEditable();
  }

  // ─── Count ───────────────────────────────────────────────────────────────────

  async assertCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }

  async assertCountGreaterThan(locator: Locator, minCount: number): Promise<void> {
    await expect
      .poll(() => locator.count(), {
        message: `Expected more than ${minCount} elements for ${locator.toString()}`,
      })
      .toBeGreaterThan(minCount);
  }

  async assertCountAtLeast(locator: Locator, minCount: number): Promise<void> {
    await expect
      .poll(() => locator.count(), {
        message: `Expected at least ${minCount} elements for ${locator.toString()}`,
      })
      .toBeGreaterThanOrEqual(minCount);
  }

  // ─── Page-Level ──────────────────────────────────────────────────────────────

  async assertUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  async assertUrlNot(expected: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(expected);
  }

  async assertTitle(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  // ─── Soft Assertions ─────────────────────────────────────────────────────────

  async softAssertVisible(locator: Locator, message?: string): Promise<void> {
    await expect.soft(locator, message).toBeVisible();
  }

  async softAssertText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect.soft(locator).toHaveText(expectedText);
  }

  async softAssertContainsText(locator: Locator, text: string): Promise<void> {
    await expect.soft(locator).toContainText(text);
  }

  // ─── Toast / Notification ────────────────────────────────────────────────────

  async assertToastMessage(
    expected: string | RegExp,
    toastSelector = '[role="alert"], [role="status"]'
  ): Promise<void> {
    const toast = this.page.locator(toastSelector).first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(expected);
  }
}
