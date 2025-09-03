import { configUmiAlias, createConfig } from '@umijs/max/test';

export default async (): Promise<any> => {
  const config = await configUmiAlias({
    ...createConfig({
      target: 'browser',
    }),
  });

  return {
    ...config,
    testEnvironment: 'jsdom',
    testURL: 'http://localhost:8000',
    setupFilesAfterEnv: ['./tests/setupTests.jsx'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@@/(.*)$': '<rootDir>/src/.umi/$1',
      '^.+\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    globals: {
      localStorage: null,
    },
  };
};
