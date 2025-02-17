/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest", //  Use ts-jest for TypeScript support
  testEnvironment: "node", //  Run tests in a Node.js environment
  roots: ["<rootDir>/src"], //  Where to look for tests (our src directory)
  testMatch: ["**/*.test.ts"], //   ফাইলের ধরণ যা টেস্ট ফাইল হিসেবে ধরা হবে (all files ending with .test.ts)
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // extensions Jest should recognize as modules
};
