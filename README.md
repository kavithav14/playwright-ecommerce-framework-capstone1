# Playwright TypeScript E-Commerce Automation Framework

A scalable, maintainable, and production-ready Playwright automation framework built with TypeScript for the [AutomationExercise](https://automationexercise.com/) e-commerce platform.

## Application Under Test

**AutomationExercise** (https://automationexercise.com/) — an online retail platform featuring user registration, product catalog, shopping cart, checkout, and order placement.

## Framework Architecture

The framework follows a layered architecture that separates generic browser interactions from application-specific page objects:

```
WebActions (generic browser interactions — clicks, inputs, waits, tables, mocking)
  └── WebAssertions (generic assertions — visibility, text, state, count)
        └── BasePage (app-specific — navigation relative to BASE_URL)
              ├── HomePage
              ├── LoginPage
              ├── SignupPage
              ├── ProductsPage
              ├── ProductDetailPage
              ├── CartPage
              ├── CheckoutPage
              ├── PaymentPage
              └── ContactUsPage
```

**Key design decisions:**

- **WebActions** and **WebAssertions** are application-agnostic — portable to any Playwright project without modification.
- **BasePage** is the only layer that binds to the application's BASE_URL. All page objects extend it.
- **Custom Playwright fixtures** provide page object instances and authentication handling, so tests stay clean and declarative.
- **Test data is externalized** in JSON/CSV/Excel files, read via a typed `data-reader` utility.
- **Environment configuration** is centralized through `.env` files and a typed `ENV` config object.

## Project Structure

```
kavitha_PWTraining_capstone_Level1/
├── playwright.config.ts              # Playwright configuration (projects, reporters, timeouts)
├── package.json                      # Dependencies and npm scripts
├── tsconfig.json                     # TypeScript config with path aliases
├── .env.example                      # Environment variable template
├── .eslintrc.json                    # ESLint rules for TypeScript
├── test-data/
│   ├── login.json                    # Login test data (valid/invalid users)
│   └── registration.json             # Registration form data and payment details
└── src/
    ├── main/
    │   ├── shared/
    │   │   ├── config/
    │   │   │   ├── env.config.ts     # Typed environment configuration
    │   │   │   └── global-setup.ts   # Pre-flight check (site reachability)
    │   │   ├── data/
    │   │   │   └── data-reader.ts    # CSV, JSON, and Excel file readers
    │   │   ├── reporting/
    │   │   │   └── reporting.ts      # Test annotations and attachment helpers
    │   │   └── utils/
    │   │       ├── helpers.ts        # Random data generators, date/string utils
    │   │       └── logger.ts         # Winston structured logging
    │   └── ui/
    │       ├── common/
    │       │   ├── WebActions.ts     # Generic browser interaction library
    │       │   └── WebAssertions.ts  # Generic assertion layer
    │       ├── fixtures/
    │       │   └── pages.ts          # Custom Playwright fixtures for all pages
    │       └── pages/
    │           ├── BasePage.ts       # Abstract base page object
    │           ├── HomePage.ts       # Home page — nav, products, cart modal
    │           ├── LoginPage.ts      # Login and signup (step 1)
    │           ├── SignupPage.ts     # Registration form (step 2)
    │           ├── ProductsPage.ts   # Product listing and search
    │           ├── ProductDetailPage.ts  # Product details, quantity, reviews
    │           ├── CartPage.ts       # Cart contents and checkout navigation
    │           ├── CheckoutPage.ts   # Address display, order review
    │           ├── PaymentPage.ts    # Payment form and order confirmation
    │           └── ContactUsPage.ts  # Contact form with file upload
    └── tests/
        └── ui/
            ├── registration.spec.ts      # User registration flow
            ├── login.spec.ts             # User login and logout
            ├── product-search.spec.ts    # Product listing and search
            ├── cart.spec.ts              # Add/remove products from cart
            └── checkout-order.spec.ts    # Checkout and order placement
```

## Test Coverage

**9 automated test cases** across 5 functional areas:

| Spec File | Test | Tags |
|---|---|---|
| `registration.spec.ts` | Register a new user successfully | `@smoke` `@critical` |
| `login.spec.ts` | Login with valid credentials | `@smoke` `@critical` |
| `product-search.spec.ts` | Display all products and search by name | `@smoke` |
| `product-search.spec.ts` | Navigate to product detail page | `@regression` |
| `cart.spec.ts` | Add products to cart and verify contents | `@smoke` `@critical` |
| `cart.spec.ts` | Remove a product from cart | `@regression` |
| `cart.spec.ts` | Add product with specific quantity from detail page | `@regression` |
| `checkout-order.spec.ts` | Complete full checkout and place order | `@smoke` `@critical` |
| `checkout-order.spec.ts` | Prompt login when checking out without auth | `@regression` |

**Tag breakdown:** 5 smoke tests, 4 critical tests, 4 regression tests.

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** (comes with Node.js)

## Setup

1. **Clone the repository** and navigate to the project directory.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install browsers:**
   ```bash
   npm run install:browsers
   ```

4. **Configure environment:** Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   The `.env` file requires `APP_USERNAME` and `APP_PASSWORD` for authenticated tests. Register an account on https://automationexercise.com first.

## Running Tests

```bash
# Run all tests
npm test

# Run only UI tests (Chromium)
npm run test:ui

# Run by tag
npm run test:smoke
npm run test:regression
npm run test:critical

# Run a specific spec file
npx playwright test registration.spec.ts --project=ui

# Run in headed mode (see the browser)
npx playwright test --project=ui --headed

# Run with slow motion (500ms delay between actions)
SLOW_MO=500 npx playwright test --project=ui --headed
```

## Cross-Browser Execution

Chromium is the default active project. Firefox and WebKit projects are pre-configured but commented out in `playwright.config.ts`. To enable them:

1. Uncomment the `ui-firefox` and/or `ui-webkit` project blocks in `playwright.config.ts`.
2. Run cross-browser:
   ```bash
   npm run test:cross-browser
   ```

## Reporting

The framework generates three types of reports:

| Reporter | Output Location | Description |
|---|---|---|
| **List** | Console | Real-time test progress in the terminal |
| **HTML** | `playwright-report/` | Interactive HTML report with screenshots, traces, and videos |
| **JSON** | `test-results/results.json` | Machine-readable results for CI integration |

**To view the HTML report after a test run:**
```bash
npx playwright show-report playwright-report
```

**Artifacts captured on failure:**
- Screenshots (automatic on failure)
- Video recordings (retained on failure)
- Trace files (captured on first retry, viewable in Trace Viewer)

## Debugging

**Trace Viewer** — recorded on first retry. View with:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

**Headed mode** — watch the browser during execution:
```bash
npx playwright test --headed
```

**Playwright Inspector** — step through tests interactively:
```bash
npx playwright test --debug
```

**Screenshots** — captured automatically on failure, saved to `test-results/` and attached to the HTML report.

## Framework Features

### Page Object Model (POM)
Every page of the application has a dedicated page object class encapsulating locators, actions, and assertions. Tests interact with the application through page objects, never directly with raw selectors.

### Custom Fixtures
Playwright fixtures inject page object instances into tests automatically. The `loggedIn` fixture handles authentication before the test body runs:

```typescript
import { test, expect } from '../../main/ui/fixtures/pages';

test('authenticated test', async ({ loggedIn, homePage, cartPage }) => {
  // Already logged in — start testing immediately
  await homePage.addProductToCart(1);
});
```

### Data-Driven Testing
Test data is externalized in `test-data/` files (JSON, CSV, or Excel) and loaded via the `data-reader` utility:

```typescript
import { readJson } from '../../main/shared/data/data-reader';

const testData = readJson<{ defaultUser: RegistrationData }>('registration.json');
```

### Network Interception and Mocking
`WebActions` provides built-in methods for network mocking:

```typescript
// Stub a response
await page.mockRoute('**/api/products', { status: 200, body: { products: [] } });

// Block requests (e.g., analytics, ads)
await page.blockRequests('**/google-analytics.com/**');
```

### Structured Logging
Winston-based logging with console (colored, human-readable) and file (JSON, rotated) transports. Log level is configurable via the `LOG_LEVEL` environment variable.

### Environment Configuration
All configuration is centralized in `.env` files, read into a typed `ENV` object. No hardcoded URLs or credentials in test code.

## Technology Stack

| Technology | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation and test runner |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test code |
| [Winston](https://github.com/winstonjs/winston) | Structured logging |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |
| [csv-parse](https://csv.js.org/parse/) | CSV test data reading |
| [xlsx](https://www.npmjs.com/package/xlsx) | Excel test data reading |
| [ESLint](https://eslint.org/) | Code linting and quality |

## NPM Scripts Reference

| Script | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:ui` | Run UI tests (Chromium) |
| `npm run test:firefox` | Run UI tests (Firefox) |
| `npm run test:webkit` | Run UI tests (WebKit) |
| `npm run test:cross-browser` | Run on all three browsers |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:regression` | Run regression tests only |
| `npm run test:critical` | Run critical tests only |
| `npm run install:browsers` | Install Chromium, Firefox, WebKit |
| `npm run test:report` | Run tests and open HTML report |
| `npm run lint` | Lint TypeScript source code |
| `npm run type-check` | TypeScript compilation check |
| `npm run clean` | Remove test results |
