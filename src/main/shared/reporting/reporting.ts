// ABOUTME: Thin wrappers around Playwright's test.info() API for structured reporting.
// ABOUTME: Provides annotation helpers (epic, feature, severity) and attachment utilities.
import { test } from '@playwright/test';
import type { Page } from '@playwright/test';

export enum Severity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  NORMAL = 'normal',
  MINOR = 'minor',
  TRIVIAL = 'trivial',
}

export interface TestMeta {
  epic?: string;
  feature?: string;
  story?: string;
  severity?: Severity;
  owner?: string;
  description?: string;
  tags?: string[];
}

export async function annotate(meta: TestMeta): Promise<void> {
  const info = test.info();
  if (meta.epic) info.annotations.push({ type: 'epic', description: meta.epic });
  if (meta.feature) info.annotations.push({ type: 'feature', description: meta.feature });
  if (meta.story) info.annotations.push({ type: 'story', description: meta.story });
  if (meta.severity) info.annotations.push({ type: 'severity', description: meta.severity });
  if (meta.owner) info.annotations.push({ type: 'owner', description: meta.owner });
  if (meta.description) info.annotations.push({ type: 'description', description: meta.description });
  if (meta.tags?.length) info.annotations.push({ type: 'tags', description: meta.tags.join(', ') });
}

export async function parameter(name: string, value: string): Promise<void> {
  test.info().annotations.push({ type: 'parameter', description: `${name}=${value}` });
}

export async function attachScreenshot(page: Page, name: string): Promise<void> {
  const png = await page.screenshot({ fullPage: true });
  await test.info().attach(name, { body: png, contentType: 'image/png' });
}

export async function attachJson(name: string, data: unknown): Promise<void> {
  await test.info().attach(name, {
    body: JSON.stringify(data, null, 2),
    contentType: 'application/json',
  });
}

export async function attachText(name: string, text: string): Promise<void> {
  await test.info().attach(name, { body: text, contentType: 'text/plain' });
}
