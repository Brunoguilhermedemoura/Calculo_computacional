/**
 * Hook para validação em tempo real de expressões matemáticas
 */

import { useState, useCallback } from 'react';
import { math } from '../utils/mathConfig.js';
import { normalizeExpression } from '../services/mathParser.js';

export const useRealTimeValidation = () => {
  const [validation, setValidation] = useState({ 
    valid: true, 
    errors: [], 
    warnings: [],
    isValidating: false 
  });

  const validateExpression = useCallback(async (expression) => {
    if (!expression.trim()) {
      setValidation({ valid: true, errors: [], warnings: [], isValidating: false });
      return;
    }

    setValidation(prev => ({ ...prev, isValidating: true }));

    try {
      // Normaliza a expressão PRIMEIRO
      const normalized = normalizeExpression(expression);
      
      // Tenta compilar a expressão normalizada
      const compiled = math.compile(normalized);
      
      // Testa com alguns valores para verificar se é válida
      const testValues = [0, 1, -1, 2, -2];
      let isValid = true;
      const errors = [];
      const warnings = [];

      for (const testValue of testValues) {
        try {
          compiled.evaluate({ x: testValue });
        } catch (error) {
          if (error.message.includes('Undefined symbol')) {
            errors.push('Variável não reconhecida');
          } else if (error.message.includes('Division by zero')) {
            warnings.push('Possível divisão por zero');
          } else {
            errors.push('Expressão inválida');
          }
          isValid = false;
          break;
        }
      }

      // Verifica padrões comuns de erro (apenas como avisos, não erros)
      if (expression.includes('^') && !expression.includes('**')) {
        warnings.push('Use "**" em vez de "^" para potências (será convertido automaticamente)');
        // Não marca como inválido se pode ser convertido automaticamente
      }

      if (expression.includes(',')) {
        warnings.push('Use "." em vez de "," para decimais (será convertido automaticamente)');
      }

      if (expression.includes('sen(')) {
        warnings.push('Use "sin(" em vez de "sen(" para seno (será convertido automaticamente)');
      }

      if (expression.includes('tg(')) {
        warnings.push('Use "tan(" em vez de "tg(" para tangente (será convertido automaticamente)');
      }

      if (expression.includes('ln(')) {
        warnings.push('Use "log(" em vez de "ln(" para logaritmo natural (será convertido automaticamente)');
      }

      // Verifica parênteses balanceados
      const openParens = (expression.match(/\(/g) || []).length;
      const closeParens = (expression.match(/\)/g) || []).length;
      
      if (openParens !== closeParens) {
        errors.push('Parênteses não balanceados');
        isValid = false;
      }

      // Verifica se há operadores duplicados
      if (expression.includes('++') || expression.includes('--')) {
        warnings.push('Operadores duplicados detectados');
      }

      // Verifica divisão por zero potencial
      if (expression.includes('/0') || expression.includes('/x')) {
        warnings.push('Possível divisão por zero');
      }

      setValidation({
        valid: isValid,
        errors,
        warnings,
        isValidating: false
      });

    } catch {
      setValidation({
        valid: false,
        errors: ['Expressão inválida'],
        warnings: [],
        isValidating: false
      });
    }
  }, []);

  return {
    validation,
    validateExpression
  };
};
