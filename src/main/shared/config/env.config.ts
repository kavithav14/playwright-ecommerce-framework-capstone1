// ABOUTME: Centralized environment configuration for the test framework.
// ABOUTME: Reads .env variables and exports a typed ENV object with fallback defaults.
import * as dotenv from 'dotenv';
import * as path from 'path';

// Resolve .env from the project root (four levels up from this file)
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
dotenv.config({ path: path.resolve(PROJECT_ROOT, '.env') });

// ─── Types ────────────────────────────────────────────────────────────────────

export type BrowserType = 'chromium' | 'firefox' | 'webkit';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface EnvConfig {
  // Application
  baseUrl: string;
  credentials: {
    username: string;
    password: string;
  };

  // Browser
  browser: BrowserType;
  headless: boolean;
  slowMo: number;
  timeout: number;
  navigationTimeout: number;
  actionTimeout: number;

  // Logging
  logLevel: LogLevel;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: "${key}". ` +
      `Copy .env.example to .env and set the value.`
    );
  }
  return value;
}

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

function toInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? '', 10);
  return isNaN(parsed) ? fallback : parsed;
}

// ─── Config Export ────────────────────────────────────────────────────────────

export const ENV: EnvConfig = {
  // Application
  baseUrl: requireEnv('BASE_URL', 'https://automationexercise.com'),
  credentials: {
    username: requireEnv('APP_USERNAME', ''),
    password: requireEnv('APP_PASSWORD', ''),
  },

  // Browser
  browser: (process.env.BROWSER as BrowserType) || 'chromium',
  headless: toBool(process.env.HEADLESS, false),
  slowMo: toInt(process.env.SLOW_MO, 0),
  timeout: toInt(process.env.TIMEOUT, 30000),
  navigationTimeout: toInt(process.env.NAV_TIMEOUT, 30000),
  actionTimeout: toInt(process.env.ACTION_TIMEOUT, 10000),

  // Logging
  logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
};

export default ENV;
