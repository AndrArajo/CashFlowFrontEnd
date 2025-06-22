// Declara o tipo para window.ENV
declare global {
  interface Window {
    ENV?: {
      REACT_APP_API_URL?: string;
      REACT_APP_USE_MOCKS?: string;
    };
  }
}

// Função para obter variáveis de ambiente com prioridade para runtime
const getEnvironmentVariable = (key: string, defaultValue: string = ''): string => {
  // Primeiro, tenta obter do window.ENV (runtime)
  if (window.ENV && window.ENV[key as keyof typeof window.ENV]) {
    const value = window.ENV[key as keyof typeof window.ENV];
    // Se o valor ainda contém o placeholder, usa o valor do process.env
    if (value && !value.startsWith('__') && !value.endsWith('__')) {
      return value;
    }
  }
  
  // Fallback para process.env (build-time)
  return process.env[key] || defaultValue;
};

// Configurações da aplicação
export const config = {
  API_URL: getEnvironmentVariable('REACT_APP_API_URL', 'http://localhost:8000/api/v1'),
  USE_MOCKS: getEnvironmentVariable('REACT_APP_USE_MOCKS', 'false') === 'true'
}; 