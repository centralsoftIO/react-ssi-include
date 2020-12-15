module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
      isolatedModules: true
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testURL: 'http://localhost',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['<rootDir>/lib'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coverageReporters: ['cobertura', 'text', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transformIgnorePatterns: ['<rootDir>/src/node_modules/(?!@hc)'],
  modulePathIgnorePatterns: ['<rootDir>[/\\\\](lib|docs|node_modules)[/\\\\]']
}
