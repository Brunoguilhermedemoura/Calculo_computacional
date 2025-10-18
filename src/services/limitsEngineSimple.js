/**
 * Versão simplificada do motor de cálculo de limites
 * Para debug e teste básico
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, parseLimitPoint, formatResult } from './mathParser.js';

/**
 * Calcula limite de forma simples
 * @param {string} exprStr - Expressão da função
 * @param {number|string} limitPoint - Ponto para onde x tende
 * @param {string} direction - Direção do limite
 * @returns {Object} Resultado do cálculo
 */
export const calculateLimit = (exprStr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  try {
    // Normaliza a expressão
    const normalizedExpr = normalizeExpression(exprStr);
    steps.push(`📝 Expressão normalizada: ${normalizedExpr}`);
    
    // Converte o ponto limite
    const point = parseLimitPoint(limitPoint);
    if (point === null) {
      throw new Error('Ponto limite inválido');
    }
    
    steps.push(`🎯 Calculando: lim(x→${limitPoint}) ${normalizedExpr}`);
    
    // Tenta substituição direta
    try {
      const compiled = math.compile(normalizedExpr);
      const result = compiled.evaluate({ x: point });
      
      if (isFinite(result)) {
        steps.push(`📊 Substituição direta: f(${point}) = ${result}`);
        tips.push('Substituição direta aplicada com sucesso');
        
        return {
          result: formatResult(result),
          steps,
          tips,
          strategy: 'substituição_direta',
          form: 'numérico'
        };
      } else {
        throw new Error('Resultado não finito');
      }
    } catch (error) {
      // Se falhar, tenta outras estratégias básicas
      steps.push(`⚠️ Substituição direta falhou: ${error.message}`);
      
      // Estratégia: fatoração simples para polinômios
      if (normalizedExpr.includes('**2') && normalizedExpr.includes('-')) {
        steps.push('🔍 Tentando fatoração de diferença de quadrados...');
        
        // Exemplo: x**2-1 = (x+1)(x-1)
        if (normalizedExpr.includes('x**2-1')) {
          const factored = '(x+1)*(x-1)';
          steps.push(`📝 Fatorado: ${factored}`);
          
          try {
            const compiled = math.compile(factored);
            const result = compiled.evaluate({ x: point });
            steps.push(`📊 Avaliando fatorado: f(${point}) = ${result}`);
            tips.push('Diferença de quadrados: a²-b² = (a+b)(a-b)');
            
            return {
              result: formatResult(result),
              steps,
              tips,
              strategy: 'fatoração',
              form: '0/0'
            };
          } catch (e) {
            steps.push(`❌ Fatoração falhou: ${e.message}`);
          }
        }
      }
      
      // Se todas as estratégias falharem
      throw new Error('Não foi possível calcular o limite com as estratégias disponíveis');
    }
    
  } catch (error) {
    steps.push(`❌ Erro: ${error.message}`);
    tips.push('Verifique a sintaxe da expressão');
    tips.push('Tente usar notação matemática padrão');
    
    return {
      result: 'Erro',
      steps,
      tips,
      strategy: 'erro',
      form: 'indefinida',
      error: error.message
    };
  }
};

/**
 * Valida expressão com feedback
 * @param {string} expr - Expressão a ser validada
 * @returns {Object} Resultado da validação
 */
export const validateExpressionWithFeedback = (expr) => {
  const errors = [];
  const warnings = [];
  
  if (!expr || !expr.trim()) {
    errors.push('Expressão não pode estar vazia');
    return { valid: false, errors, warnings };
  }
  
  // Verifica erros comuns
  if (expr.includes('^') && !expr.includes('**')) {
    errors.push('Use "**" em vez de "^" para potências');
  }
  
  if (expr.includes(',')) {
    errors.push('Use "." em vez de "," para decimais');
  }
  
  if (expr.includes('sen(')) {
    errors.push('Use "sin(" em vez de "sen(" para seno');
  }
  
  if (expr.includes('tg(')) {
    errors.push('Use "tan(" em vez de "tg(" para tangente');
  }
  
  if (expr.includes('ln(')) {
    errors.push('Use "log(" em vez de "ln(" para logaritmo natural');
  }
  
  try {
    const normalized = normalizeExpression(expr);
    math.compile(normalized);
    return { valid: true, errors, warnings };
  } catch (error) {
    errors.push(`Erro de sintaxe: ${error.message}`);
    return { valid: false, errors, warnings };
  }
};

/**
 * Gera mensagem de erro clara
 * @param {string} errorType - Tipo do erro
 * @param {string} expression - Expressão com erro
 * @param {string} limitPoint - Ponto limite
 * @param {Object} details - Detalhes adicionais
 * @returns {string} Mensagem de erro clara
 */
export const generateClearErrorMessage = (errorType, expression, limitPoint, details = {}) => {
  const messages = {
    syntax_error: `Erro de sintaxe na expressão "${expression}". ${details.errors ? details.errors.join(' ') : ''}`,
    calculation_error: `Erro ao calcular limite de "${expression}" em x→${limitPoint}`,
    convergence_error: `Não foi possível determinar a convergência do limite`,
    mathematical_error: `Erro matemático: ${details.reason || 'Operação inválida'}`
  };
  
  return messages[errorType] || 'Erro desconhecido';
};
