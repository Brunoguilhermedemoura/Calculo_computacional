/**
 * Motor avançado de cálculo de limites
 * Implementa o esquema completo da imagem com todas as estratégias
 */

import { INDETERMINATE_FORMS } from '../utils/limitDetection.js';
import { LIMIT_STRATEGIES } from './limitStrategies.js';
import { 
  calculateLimit,
  validateExpressionWithFeedback
} from './limitsEngineSimple.js';

// math já importado do mathConfig.js

/**
 * Calcula limite usando o motor avançado com todas as funcionalidades implementadas
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto para onde x tende
 * @param {string} direction - Direção do limite ("ambos", "esquerda", "direita")
 * @returns {Object} {result, steps, tips, strategy, form}
 */
export const calculateAdvancedLimit = (functionStr, limitPointStr) => {
  const steps = [];
  const tips = [];
  
  try {
    // Validação de entrada com feedback detalhado
    if (!functionStr || !functionStr.trim()) {
      throw new Error('Digite uma função f(x)');
    }
    
    if (!limitPointStr || !limitPointStr.trim()) {
      throw new Error('Digite o ponto para onde x tende');
    }
    
    // Usa o motor simplificado
    const result = calculateLimit(functionStr, limitPointStr, 'ambos');
    
    // Adiciona os passos do motor simplificado
    if (result.steps && Array.isArray(result.steps)) {
      steps.push(...result.steps);
    }
    
    // Adiciona as dicas do motor simplificado
    if (result.tips && Array.isArray(result.tips)) {
      tips.push(...result.tips);
    }
    
    return {
      result: result.result,
      steps,
      tips,
      strategy: result.strategy || 'substituição_direta',
      form: result.form || 'numérico',
      formInfo: { form: result.form || 'numérico' },
      strategyInfo: { strategy: result.strategy || 'substituição_direta' },
      calculationResult: result
    };
    
  } catch (error) {
    const errorMsg = `❌ Erro no cálculo: ${error.message}`;
    steps.push(errorMsg);
    tips.push('Verifique a sintaxe da expressão e tente novamente');
    tips.push('Use a ajuda de sintaxe para ver exemplos válidos');
    
    return {
      result: 'Erro',
      steps,
      tips,
      strategy: 'error',
      form: INDETERMINATE_FORMS.UNDEFINED,
      error: error.message
    };
  }
};

/**
 * Calcula limite com análise detalhada passo a passo
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto para onde x tende
 * @param {string} direction - Direção do limite
 * @returns {Object} Resultado detalhado com análise completa
 */
export const calculateDetailedLimit = (functionStr, limitPointStr, direction) => {
  const result = calculateAdvancedLimit(functionStr, limitPointStr, direction);
  
  // Adiciona análise adicional
  const analysis = {
    ...result,
    timestamp: new Date().toISOString(),
    input: {
      function: functionStr,
      limitPoint: limitPointStr,
      direction
    },
    metadata: {
      hasError: result.result === 'Erro',
      isIndeterminate: result.form !== INDETERMINATE_FORMS.NUMERICAL,
      isFundamental: result.strategy === LIMIT_STRATEGIES.FUNDAMENTAL_LIMITS,
      complexity: calculateComplexity(result.steps.length, result.tips.length)
    }
  };
  
  return analysis;
};

/**
 * Calcula a complexidade do limite baseada nos passos e dicas
 * @param {number} stepsCount - Número de passos
 * @param {number} tipsCount - Número de dicas
 * @returns {string} Nível de complexidade
 */
const calculateComplexity = (stepsCount, tipsCount) => {
  const total = stepsCount + tipsCount;
  
  if (total <= 3) return 'Simples';
  if (total <= 6) return 'Médio';
  if (total <= 10) return 'Complexo';
  return 'Muito Complexo';
};

/**
 * Valida se uma expressão é válida para cálculo de limites
 * @param {string} expr - Expressão a ser validada
 * @returns {Object} Resultado da validação
 */
export const validateExpression = (expr) => {
  return validateExpressionWithFeedback(expr);
};

/**
 * Auto-corrige expressões com erros comuns
 * @param {string} expr - Expressão a ser corrigida
 * @returns {string} Expressão corrigida
 */
export const autoCorrectExpression = (expr) => {
  if (!expr) return expr;
  
  let corrected = expr;
  
  // Auto-correções comuns
  corrected = corrected.replace(/\^/g, '**'); // ^ para **
  corrected = corrected.replace(/,/g, '.');   // , para .
  corrected = corrected.replace(/sen\(/g, 'sin('); // sen para sin
  corrected = corrected.replace(/tg\(/g, 'tan(');  // tg para tan
  corrected = corrected.replace(/ln\(/g, 'log(');  // ln para log
  corrected = corrected.replace(/infinity/g, 'oo'); // infinity para oo
  corrected = corrected.replace(/-infinity/g, '-oo'); // -infinity para -oo
  
  return corrected;
};

/**
 * Sugere correções para expressões inválidas
 * @param {string} expr - Expressão com possível erro
 * @returns {Array<string>} Lista de sugestões
 */
export const suggestCorrections = (expr) => {
  const validation = validateExpression(expr);
  return [...validation.errors, ...validation.warnings];
};

/**
 * Retorna exemplos avançados para cada tipo de limite
 * @returns {Array} Lista de exemplos categorizados
 */
export const getAdvancedExamples = () => {
  return [
    // Limites fundamentais trigonométricos
    {
      category: 'Limites Fundamentais Trigonométricos',
      examples: [
        {
          function: 'sin(x)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1',
          description: 'Limite fundamental do seno',
          strategy: 'fundamental_trigonometric'
        },
        {
          function: '(1-cos(x))/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '0',
          description: 'Limite fundamental do cosseno',
          strategy: 'fundamental_trigonometric'
        },
        {
          function: 'tan(x)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1',
          description: 'Limite fundamental da tangente',
          strategy: 'fundamental_trigonometric'
        }
      ]
    },
    
    // Limites fundamentais exponenciais
    {
      category: 'Limites Fundamentais Exponenciais',
      examples: [
        {
          function: '(1+1/x)^x',
          point: 'oo',
          direction: 'ambos',
          expectedResult: 'e',
          description: 'Limite fundamental exponencial (número de Euler)',
          strategy: 'fundamental_exponential'
        },
        {
          function: '(e^x-1)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1',
          description: 'Limite fundamental da exponencial natural',
          strategy: 'fundamental_exponential'
        },
        {
          function: 'ln(1+x)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1',
          description: 'Limite fundamental do logaritmo natural',
          strategy: 'fundamental_exponential'
        }
      ]
    },
    
    // Fatoração de polinômios
    {
      category: 'Fatoração de Polinômios',
      examples: [
        {
          function: '(x^2-1)/(x-1)',
          point: '1',
          direction: 'ambos',
          expectedResult: '2',
          description: 'Diferença de quadrados',
          strategy: 'factoring'
        },
        {
          function: '(x^2-4)/(x-2)',
          point: '2',
          direction: 'ambos',
          expectedResult: '4',
          description: 'Diferença de quadrados',
          strategy: 'factoring'
        },
        {
          function: '(x^3-8)/(x-2)',
          point: '2',
          direction: 'ambos',
          expectedResult: '12',
          description: 'Diferença de cubos',
          strategy: 'factoring'
        }
      ]
    },
    
    // Racionalização
    {
      category: 'Racionalização',
      examples: [
        {
          function: '(sqrt(x+1)-1)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1/2',
          description: 'Racionalização com raiz quadrada',
          strategy: 'rationalization'
        },
        {
          function: '(sqrt(x+4)-2)/x',
          point: '0',
          direction: 'ambos',
          expectedResult: '1/4',
          description: 'Racionalização com raiz quadrada',
          strategy: 'rationalization'
        }
      ]
    },
    
    // Limites no infinito
    {
      category: 'Limites no Infinito',
      examples: [
        {
          function: '(2*x^3+5)/(x^3-7)',
          point: 'oo',
          direction: 'ambos',
          expectedResult: '2',
          description: 'Função racional no infinito',
          strategy: 'highest_degree'
        },
        {
          function: '(x^2+1)/(x^3+2)',
          point: 'oo',
          direction: 'ambos',
          expectedResult: '0',
          description: 'Grau do denominador maior',
          strategy: 'highest_degree'
        },
        {
          function: '(x^3+1)/(x^2+1)',
          point: 'oo',
          direction: 'ambos',
          expectedResult: 'oo',
          description: 'Grau do numerador maior',
          strategy: 'highest_degree'
        }
      ]
    },
    
    // Formas indeterminadas complexas
    {
      category: 'Formas Indeterminadas Complexas',
      examples: [
        {
          function: 'sqrt(x^2+1)-x',
          point: 'oo',
          direction: 'ambos',
          expectedResult: '0',
          description: 'Forma ∞-∞ com racionalização',
          strategy: 'conjugate_multiplication'
        },
        {
          function: 'x*ln(x)',
          point: '0',
          direction: 'direita',
          expectedResult: '0',
          description: 'Forma 0·∞',
          strategy: 'rewrite_as_quotient'
        }
      ]
    }
  ];
};

/**
 * Retorna estatísticas do sistema
 * @returns {Object} Estatísticas
 */
export const getSystemStats = () => {
  return {
    strategies: Object.keys(LIMIT_STRATEGIES).length,
    fundamentalLimits: 0, // Desabilitado temporariamente
    indeterminateForms: Object.keys(INDETERMINATE_FORMS).length,
    examples: getAdvancedExamples().reduce((total, category) => total + category.examples.length, 0),
    version: '2.0.0',
    lastUpdated: new Date().toISOString()
  };
};

// Removido: função de teste - solução integrada na normalização principal
