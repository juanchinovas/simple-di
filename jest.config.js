/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
	global: {
		branches: 95,
		functions: 95,
		lines: 95,
		statements: 95,
	  }
  },
};