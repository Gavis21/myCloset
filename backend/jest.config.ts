export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testTimeout: 60*1000,
    coverageDirectory: "./coverage/",
    collectCoverage: true,
  };