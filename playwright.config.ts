// ABOUTME: Playwright configuration for the AutomationExercise e-commerce test framework.
// ABOUTME: Defines browser projects, timeouts, reporters, and global setup.
/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Resolve .env from the project root (same directory as this config file)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const headless = process.env.HEADLESS === 'true';
const slowMo   = parseInt(process.env.SLOW_MO ?? '0', 10);

export default defineConfig({
  testDir: './src/tests',
  testMatch: ['**/*.spec.ts'],

  globalSetup: './src/main/shared/config/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 60000,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'ui',
      testMatch: ['**/tests/ui/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        headless,
        launchOptions: {
          slowMo,
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },
    // {
    //   name: 'ui-firefox',
    //   testMatch: ['**/tests/ui/**/*.spec.ts'],
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     headless,
    //     launchOptions: { slowMo },
    //   },
    // },
    // {
    //   name: 'ui-webkit',
    //   testMatch: ['**/tests/ui/**/*.spec.ts'],
    //   use: {
    //     ...devices['Desktop Safari'],
    //     headless,
    //     launchOptions: { slowMo },
    //   },
    // },
  ],
});
