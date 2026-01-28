globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: "tsconfig.spec.json",
}
/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@assets/(.*)": "<rootDir>/src/assets/$1",
    "@core/(.*)": "<rootDir>/src/app/core/$1",
    "@env": "<rootDir>/src/environments/environment",
    "@state/(.*)": "<rootDir>/src/app/state/$1",
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  roots: ["src"],
  transformIgnorePatterns: [
    "/node_modules/(?!flat)/",
    "/!node_modules\\/lodash-es/",
    "/node_modules/?!@angular",
  ],
  moduleDirectories: ["node_modules", "src"],
  fakeTimers: {
    enableGlobally: true,
  },
  clearMocks: true,
  collectCoverage: true,
  reporters: ["default"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    }
  },
  forceExit: true,  
};
