module.exports = {
  moduleNameMapper: {
    "@geoblocks/ol-maplibre-layer":
      "<rootDir>/node_modules/@geoblocks/ol-maplibre-layer/lib/index.js",
    "\\.(jpg|jpeg|png|gif|webp|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  snapshotSerializers: ["jest-serializer-html"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/(build|coverage|public|doc|packages)"],
  transform: {
    ".+\\.js$": "babel-jest",
    ".+\\.svg$": "jest-transformer-svg",
  },
  transformIgnorePatterns: [],
};
