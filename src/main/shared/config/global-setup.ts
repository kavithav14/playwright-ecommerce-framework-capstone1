// ABOUTME: Pre-flight environment check that runs once before the entire test suite.
// ABOUTME: Verifies the target application is reachable before spending time on tests.
/// <reference types="node" />
import { FullConfig } from '@playwright/test';
import { ENV } from './env.config';

const PREFLIGHT_TIMEOUT_MS = 10_000;

async function checkReachable(label: string, url: string): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PREFLIGHT_TIMEOUT_MS);
  try {
    await fetch(url, { method: 'GET', signal: controller.signal });
    // eslint-disable-next-line no-console
    console.log(`[global-setup] ✓ ${label} reachable: ${url}`);
  } catch (err) {
    throw new Error(
      `[global-setup] ✗ ${label} is NOT reachable at ${url}. ` +
      `Check the URL in .env and your network/VPN connection before re-running tests. ` +
      `(${(err as Error).message})`
    );
  } finally {
    clearTimeout(timer);
  }
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[global-setup] Running pre-flight environment checks...');

  await checkReachable('BASE_URL', ENV.baseUrl);

  // eslint-disable-next-line no-console
  console.log('[global-setup] Pre-flight checks passed.');
}
