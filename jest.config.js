const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', 
    '<rootDir>/.next/', 
    '<rootDir>/e2e/',
    '<rootDir>/__tests__/mocks/'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    // Exclude metadata-related files that cause errors in coverage
    '!app/layout.tsx',
    '!app/page.tsx',
    '!app/country/[code]/page.tsx',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/app/layout.tsx',
    '<rootDir>/app/page.tsx',
    '<rootDir>/app/country/\\[code\\]/page.tsx'
  ],
};

module.exports = createJestConfig(customJestConfig);
