import '@testing-library/jest-dom/vitest';
import { configureGlobal } from 'fast-check';

// Configure fast-check to run a minimum of 100 iterations for property tests
configureGlobal({
  numRuns: 100,
});
