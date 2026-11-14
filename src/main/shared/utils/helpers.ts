// ABOUTME: Utility functions for random data generation, date formatting, and page helpers.
// ABOUTME: Provides reusable helpers for test data creation, screenshots, and string manipulation.
import { Page, test } from '@playwright/test';

// ─── Wait Helpers ─────────────────────────────────────────────────────────────

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(
  condition: () => Promise<boolean>,
  options: { timeout?: number; interval?: number; message?: string } = {}
): Promise<void> {
  const { timeout = 10000, interval = 500, message = 'Condition not met' } = options;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await sleep(interval);
  }

  throw new Error(`Timeout after ${timeout}ms: ${message}`);
}

// ─── Random Data Generators ───────────────────────────────────────────────────

export function randomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUsername(prefix = 'user'): string {
  return `${prefix}_${randomString(8)}`;
}

export function generateEmail(domain = 'test.com'): string {
  return `user_${randomString(6).toLowerCase()}@${domain}`;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return formatDate(new Date());
}

export function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

// ─── Page Helpers ─────────────────────────────────────────────────────────────

export async function takeScreenshot(
  page: Page,
  name: string
): Promise<Buffer> {
  const buffer = await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
  try {
    await test.info().attach(name, { body: buffer, contentType: 'image/png' });
  } catch {
    // Not running inside a Playwright test context — ignore.
  }
  return buffer;
}

export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export async function clearBrowserState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
}

// ─── String Helpers ───────────────────────────────────────────────────────────

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
