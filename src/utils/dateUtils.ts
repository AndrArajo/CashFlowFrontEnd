/**
 * Formata uma data ISO para exibição no padrão brasileiro (dd/mm/yyyy),
 * mantendo a data original sem ajuste de fuso horário
 * 
 * @param isoDateString Data no formato ISO (ex: 2025-05-19T00:00:00Z)
 * @returns Data formatada no padrão brasileiro
 */
export const formatDateBr = (isoDateString: string): string => {
  // Extrai apenas a parte da data (ano-mês-dia) ignorando o horário e o fuso
  const datePart = isoDateString.split('T')[0];
  
  if (!datePart) return '';
  
  // Divide em componentes
  const [year, month, day] = datePart.split('-');
  
  // Retorna no formato brasileiro
  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data e hora ISO para exibição no padrão brasileiro completo
 * 
 * @param isoDateString Data no formato ISO (ex: 2025-05-19T00:00:00Z)
 * @returns Data e hora formatada no padrão brasileiro
 */
export const formatDateTimeBr = (isoDateString: string): string => {
  try {
    // Cria uma data UTC explicitamente
    const date = new Date(isoDateString);
    
    // Extrai os componentes UTC
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    // Formato brasileiro (dia/mês/ano)
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}; 