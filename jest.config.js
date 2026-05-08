module.exports = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  snapshotSerializers: ["jest-serializer-html"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/(build|coverage|public|doc|packages)"],
  transform: {
    ".+\\.svg$": "jest-transformer-svg",
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [],
};
