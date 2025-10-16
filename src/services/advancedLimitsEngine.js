/**
 * Motor avançado de cálculo de limites
 * Implementa o esquema completo da imagem com todas as estratégias
 */

import { math } from '../utils/mathConfig.js';
import { detectLimitForm, generateFormSpecificTips, INDETERMINATE_FORMS } from '../utils/limitDetection.js';
import { detectStrategy, applyStrategy, LIMIT_STRATEGIES } from './limitStrategies.js';
// import { detectFundamentalLimit, applyFundamentalLimit } from './fundamentalLimits.js';
import { normalizeExpression, parseLimitPoint, formatResult } from './mathParser.js';

// math já importado do mathConfig.js

/**
 * Calcula limite usando o motor avançado
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto para onde x tende
 * @param {string} direction - Direção do limite ("ambos", "esquerda", "direita")
 * @returns {Object} {result, steps, tips, strategy, form}
 */
export const calculateAdvancedLimit = (functionStr, limitPointStr) => {
  const steps = [];
  const tips = [];
  
  try {
    // Validação de entrada
    if (!functionStr || !functionStr.trim()) {
      throw new Error('Digite uma função f(x)');
    }
    
    if (!limitPointStr || !limitPointStr.trim()) {
      throw new Error('Digite o ponto para onde x tende');
    }
    
    // Normaliza a expressão
    const normalizedExpr = normalizeExpression(functionStr);
    steps.push(`📝 Expressão normalizada: ${normalizedExpr}`);
    
    // Converte o ponto limite
    const limitPoint = parseLimitPoint(limitPointStr);
    if (limitPoint === null) {
      throw new Error('Ponto limite inválido');
    }
    
    steps.push(`🎯 Calculando: lim(x→${limitPointStr}) ${normalizedExpr}`);
    
    // Detecta a forma do limite
    const formInfo = detectLimitForm(normalizedExpr, limitPoint);
    steps.push(`🔍 Forma detectada: ${formInfo.form}`);
    
    // Adiciona passos da detecção
    steps.push(...formInfo.steps);
    
    // Gera dicas específicas da forma
    const formTips = generateFormSpecificTips(formInfo.form, formInfo);
    tips.push(...formTips);
    
    // Detecta estratégia específica
    const strategyInfo = detectStrategy(normalizedExpr, limitPoint);
    steps.push(`⚡ Estratégia: ${strategyInfo.strategy}`);
    
    // Adiciona passos da estratégia
    steps.push(...strategyInfo.steps);
    tips.push(...strategyInfo.tips);
    
    // Aplica a estratégia
    const calculationResult = applyStrategy(normalizedExpr, limitPoint, strategyInfo);
    
    // Adiciona passos do cálculo
    steps.push(...calculationResult.steps);
    tips.push(...calculationResult.tips);
    
    // Formata o resultado final
    const formattedResult = formatResult(calculationResult.result);
    steps.push(`✅ Resultado final: ${formattedResult}`);
    
    return {
      result: formattedResult,
      steps,
      tips,
      strategy: calculationResult.strategy || strategyInfo.strategy,
      form: formInfo.form,
      formInfo,
      strategyInfo,
      calculationResult
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
  const errors = [];
  const warnings = [];
  
  if (!expr || !expr.trim()) {
    errors.push('Expressão não pode estar vazia');
    return { valid: false, errors, warnings };
  }
  
  // Verifica erros comuns antes de tentar compilar
  if (expr.includes('^') && !expr.includes('**')) {
    errors.push('Use "**" em vez de "^" para potências');
    return { valid: false, errors, warnings };
  }
  
  if (expr.includes(',')) {
    errors.push('Use "." em vez de "," para decimais');
    return { valid: false, errors, warnings };
  }
  
  if (expr.includes('sen(')) {
    errors.push('Use "sin(" em vez de "sen(" para seno');
    return { valid: false, errors, warnings };
  }
  
  if (expr.includes('tg(')) {
    errors.push('Use "tan(" em vez de "tg(" para tangente');
    return { valid: false, errors, warnings };
  }
  
  if (expr.includes('ln(')) {
    errors.push('Use "log(" em vez de "ln(" para logaritmo natural');
    return { valid: false, errors, warnings };
  }
  
  try {
    // Normaliza a expressão
    const normalized = normalizeExpression(expr);
    
    // Tenta compilar
    math.compile(normalized);
    
    // Se chegou até aqui, a sintaxe está correta
    return { valid: true, errors, warnings };
    
  } catch (error) {
    // Se falhar, mostra o erro específico
    errors.push(`Erro de sintaxe: ${error.message}`);
    return { valid: false, errors, warnings };
  }
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
  const suggestions = [];
  
  // Verifica erros comuns
  if (expr.includes('sen(')) {
    suggestions.push('Use "sin(" em vez de "sen(" para seno');
  }
  
  if (expr.includes('tg(')) {
    suggestions.push('Use "tan(" em vez de "tg(" para tangente');
  }
  
  if (expr.includes('ln(')) {
    suggestions.push('Use "log(" em vez de "ln(" para logaritmo natural');
  }
  
  if (expr.includes('^') && !expr.includes('**')) {
    suggestions.push('Use "**" em vez de "^" para potências');
  }
  
  if (expr.includes(',')) {
    suggestions.push('Use "." em vez de "," para decimais');
  }
  
  if (expr.includes('infinity')) {
    suggestions.push('Use "oo" em vez de "infinity" para infinito');
  }
  
  // Verifica parênteses balanceados
  const openParens = (expr.match(/\(/g) || []).length;
  const closeParens = (expr.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    suggestions.push('Verifique se todos os parênteses estão balanceados');
  }
  
  return suggestions;
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
