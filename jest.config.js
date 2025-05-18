module.exports = {
  // A lista de caminho de módulos para procurar módulos
  moduleDirectories: ["node_modules", "src"],
  
  // Extensões de arquivos para buscar
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  // Caminho para os transformadores
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  
  // Permitir transformação de módulos específicos em node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(axios|react-router|react-router-dom|@mui)/)"
  ],
  
  // Configuração para testes - usando apenas testMatch
  testMatch: ["**/src/__tests__/**/*.test.{ts,tsx}", "**/?(*.)+(spec|test).{ts,tsx}"],
  
  // Coletor de cobertura
  collectCoverage: true,
  
  // Diretórios a serem cobertos pela análise de cobertura
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/index.tsx",
    "!src/reportWebVitals.ts",
    "!src/react-app-env.d.ts",
    "!src/**/*.d.ts",
    "!src/mocks/**",
    "!**/node_modules/**"
  ],
  
  // Caminho para os resultados
  coverageDirectory: "coverage",
  
  // Configurações do ambiente de teste
  testEnvironment: "jsdom",
  
  // Setup de arquivos para executar antes dos testes
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  
  // Aliases de módulos para testes
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  // Configurações adicionais para ESM
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true
    }
  },
  
  // Definir variáveis de ambiente para testes
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  }
}; 