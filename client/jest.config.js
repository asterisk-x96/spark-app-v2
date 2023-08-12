module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'path/to/your/tsconfig.json',
      jsx: 'react',
    },
  },
};
