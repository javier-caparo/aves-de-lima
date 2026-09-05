import nextJest from 'next/jest.js';

/**
 * Jest configuration for Next.js App Router with React Testing Library.
 * next/jest handles SWC transforms, module aliases (@/*), CSS mocking,
 * and static asset mocks automatically.
 * https://nextjs.org/docs/app/building-your-application/testing/jest
 */
const createJestConfig = nextJest({
  // Path to the Next.js app.
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  // Unit tests only; Playwright E2E specs run via `npm run test:e2e`.
  testMatch: ['**/*.test.ts?(x)'],
  // Load testing-library custom DOM matchers before each test.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default createJestConfig(config);
