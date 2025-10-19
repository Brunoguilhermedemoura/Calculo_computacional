/**
 * Serviço para cálculo de integrais indefinidas
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, formatResult } from './mathParser.js';

// Dicionário de integrais conhecidas
const KNOWN_INTEGRALS = {
  // Polinômios
  'x': 'x**2/2',
  'x**2': 'x**3/3',
  'x**3': 'x**4/4',
  'x**n': 'x**(n+1)/(n+1)',
  
  // Funções trigonométricas
  'sin(x)': '-cos(x)',
  'cos(x)': 'sin(x)',
  'tan(x)': '-log(cos(x))',
  'sec(x)**2': 'tan(x)',
  'csc(x)**2': '-cot(x)',
  
  // Funções exponenciais e logarítmicas
  'exp(x)': 'exp(x)',
  'e**x': 'e**x',
  '1/x': 'log(abs(x))',
  'log(x)': 'x*log(x) - x',
  
  // Funções hiperbólicas
  'sinh(x)': 'cosh(x)',
  'cosh(x)': 'sinh(x)',
  'tanh(x)': 'log(cosh(x))',
  
  // Outras funções
  '1/(1+x**2)': 'atan(x)',
  '1/sqrt(1-x**2)': 'asin(x)',
  '1/sqrt(1+x**2)': 'asinh(x)'
};

/**
 * Calcula integral indefinida de uma função
 * @param {string} functionStr - Expressão da função
 * @param {string} variable - Variável de integração
 * @returns {Object} {result, steps, success, method}
 */
export const calculateIntegral = (functionStr, variable = 'x') => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando integral indefinida: ∫ f(${variable}) d${variable}`);
    
    // Tenta encontrar no dicionário de integrais conhecidas
    const knownResult = findKnownIntegral(normalizedExpr);
    if (knownResult) {
      steps.push(`✅ Integral conhecida encontrada: ${knownResult}`);
      steps.push(`📊 Resultado: ∫ ${normalizedExpr} d${variable} = ${knownResult} + C`);
      
      return {
        result: knownResult,
        steps,
        success: true,
        method: 'known_integral'
      };
    }
    
    // Tenta integração por partes para produtos
    if (normalizedExpr.includes('*')) {
      const partsResult = tryIntegrationByParts(normalizedExpr, variable);
      if (partsResult.success) {
        steps.push(...partsResult.steps);
        return {
          result: partsResult.result,
          steps,
          success: true,
          method: 'integration_by_parts'
        };
      }
    }
    
    // Tenta substituição simples
    const substitutionResult = trySimpleSubstitution(normalizedExpr, variable);
    if (substitutionResult.success) {
      steps.push(...substitutionResult.steps);
      return {
        result: substitutionResult.result,
        steps,
        success: true,
        method: 'substitution'
      };
    }
    
    // Se não conseguiu resolver
    steps.push(`⚠️ Não foi possível resolver esta integral simbolicamente`);
    steps.push(`💡 Sugestões:`);
    steps.push(`   • Verifique se a função está correta`);
    steps.push(`   • Tente usar métodos numéricos`);
    steps.push(`   • Considere usar uma calculadora mais avançada`);
    
    return {
      result: 'Não resolvível simbolicamente',
      steps,
      success: false,
      method: 'none'
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo da integral: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Procura por integral conhecida no dicionário
 * @param {string} expr - Expressão a ser integrada
 * @returns {string|null} Resultado da integral ou null
 */
const findKnownIntegral = (expr) => {
  // Remove espaços e normaliza
  const cleanExpr = expr.replace(/\s/g, '');
  
  // Procura correspondência exata
  if (KNOWN_INTEGRALS[cleanExpr]) {
    return KNOWN_INTEGRALS[cleanExpr];
  }
  
  // Procura por padrões com coeficientes
  for (const [pattern, result] of Object.entries(KNOWN_INTEGRALS)) {
    if (pattern.includes('x**n')) {
      // Padrão para x^n
      const match = cleanExpr.match(/^(\d*\.?\d*)\*?x\*\*(\d+)$/);
      if (match) {
        const coef = match[1] || '1';
        const power = parseInt(match[2]);
        return `${coef} * x**${power + 1} / ${power + 1}`;
      }
    }
  }
  
  return null;
};

/**
 * Tenta integração por partes
 * @param {string} expr - Expressão a ser integrada
 * @param {string} variable - Variável de integração
 * @returns {Object} {result, steps, success}
 */
const tryIntegrationByParts = (expr, variable) => {
  const steps = [];
  
  // Implementação básica para casos simples
  // Ex: x * sin(x), x * exp(x), etc.
  
  const productPattern = /^(\w+) \* (\w+)$/;
  const match = expr.match(productPattern);
  
  if (match) {
    const u = match[1];
    const v = match[2];
    
    steps.push(`🔄 Tentando integração por partes: ∫ u * v dx`);
    steps.push(`📝 u = ${u}, v = ${v}`);
    
    // Verifica se v é uma função conhecida
    if (KNOWN_INTEGRALS[v]) {
      const vIntegral = KNOWN_INTEGRALS[v];
      steps.push(`📊 ∫ v dx = ${vIntegral}`);
      steps.push(`⚠️ Integração por partes requer mais desenvolvimento`);
      
      return {
        result: 'Requer desenvolvimento manual',
        steps,
        success: false
      };
    }
  }
  
  return { result: null, steps: [], success: false };
};

/**
 * Tenta substituição simples
 * @param {string} expr - Expressão a ser integrada
 * @param {string} variable - Variável de integração
 * @returns {Object} {result, steps, success}
 */
const trySimpleSubstitution = (expr, variable) => {
  const steps = [];
  
  // Implementação básica para casos simples
  // Ex: (x+1)^2, sin(2x), etc.
  
  // Padrão para (ax+b)^n
  const linearPattern = /^\((\d*\.?\d*)\*?x\s*([+-]\s*\d*\.?\d*)\)\*\*(\d+)$/;
  const match = expr.match(linearPattern);
  
  if (match) {
    const a = parseFloat(match[1] || '1');
    const b = parseFloat(match[2] || '0');
    const n = parseInt(match[3]);
    
    steps.push(`🔄 Substituição: u = ${a}x + ${b}`);
    steps.push(`📝 du = ${a} dx`);
    steps.push(`📊 ∫ u^${n} du = u^${n+1} / ${n+1}`);
    
    const result = `(${a}x + ${b})^${n+1} / (${a} * ${n+1})`;
    steps.push(`✅ Resultado: ${result}`);
    
    return {
      result,
      steps,
      success: true
    };
  }
  
  return { result: null, steps: [], success: false };
};

/**
 * Calcula integral definida usando regra do trapézio
 * @param {string} functionStr - Expressão da função
 * @param {number} a - Limite inferior
 * @param {number} b - Limite superior
 * @param {string} variable - Variável de integração
 * @param {number} n - Número de trapézios (padrão: 1000)
 * @returns {Object} {result, steps, success}
 */
export const calculateDefiniteIntegral = (functionStr, a, b, variable = 'x', n = 1000) => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando integral definida: ∫[${a} to ${b}] f(${variable}) d${variable}`);
    steps.push(`🔢 Usando regra do trapézio com ${n} trapézios`);
    
    const h = (b - a) / n;
    let sum = 0;
    
    // Calcula f(a) e f(b)
    const fa = expr.evaluate({ [variable]: a });
    const fb = expr.evaluate({ [variable]: b });
    
    steps.push(`📊 f(${a}) = ${formatResult(fa)}`);
    steps.push(`📊 f(${b}) = ${formatResult(fb)}`);
    
    sum = (fa + fb) / 2;
    
    // Calcula os pontos intermediários
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const fx = expr.evaluate({ [variable]: x });
      sum += fx;
    }
    
    const result = sum * h;
    
    steps.push(`📈 Aplicando regra do trapézio: h/2 * [f(a) + 2∑f(xi) + f(b)]`);
    steps.push(`✅ ∫[${a} to ${b}] f(${variable}) d${variable} ≈ ${formatResult(result)}`);
    
    return {
      result: result,
      steps,
      success: true,
      method: 'trapezoidal_rule',
      n
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo da integral definida: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula integral definida usando regra de Simpson
 * @param {string} functionStr - Expressão da função
 * @param {number} a - Limite inferior
 * @param {number} b - Limite superior
 * @param {string} variable - Variável de integração
 * @param {number} n - Número de intervalos (deve ser par)
 * @returns {Object} {result, steps, success}
 */
export const calculateDefiniteIntegralSimpson = (functionStr, a, b, variable = 'x', n = 1000) => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    // Garante que n é par
    if (n % 2 !== 0) n += 1;
    
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando integral definida: ∫[${a} to ${b}] f(${variable}) d${variable}`);
    steps.push(`🔢 Usando regra de Simpson com ${n} intervalos`);
    
    const h = (b - a) / n;
    let sum = 0;
    
    // Calcula f(a) e f(b)
    const fa = expr.evaluate({ [variable]: a });
    const fb = expr.evaluate({ [variable]: b });
    
    steps.push(`📊 f(${a}) = ${formatResult(fa)}`);
    steps.push(`📊 f(${b}) = ${formatResult(fb)}`);
    
    sum = fa + fb;
    
    // Calcula os pontos com pesos alternados
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const fx = expr.evaluate({ [variable]: x });
      const weight = (i % 2 === 0) ? 2 : 4;
      sum += weight * fx;
    }
    
    const result = (h / 3) * sum;
    
    steps.push(`📈 Aplicando regra de Simpson: h/3 * [f(a) + 4∑f(xi) + 2∑f(xi) + f(b)]`);
    steps.push(`✅ ∫[${a} to ${b}] f(${variable}) d${variable} ≈ ${formatResult(result)}`);
    
    return {
      result: result,
      steps,
      success: true,
      method: 'simpson_rule',
      n
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo da integral definida: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula área entre duas curvas
 * @param {string} f1Str - Primeira função
 * @param {string} f2Str - Segunda função
 * @param {number} a - Limite inferior
 * @param {number} b - Limite superior
 * @param {string} variable - Variável de integração
 * @returns {Object} {result, steps, success}
 */
export const calculateAreaBetweenCurves = (f1Str, f2Str, a, b, variable = 'x') => {
  const steps = [];
  
  try {
    const f1Expr = math.compile(normalizeExpression(f1Str));
    const f2Expr = math.compile(normalizeExpression(f2Str));
    
    steps.push(`📝 Função 1: f1(${variable}) = ${f1Str}`);
    steps.push(`📝 Função 2: f2(${variable}) = ${f2Str}`);
    steps.push(`📐 Calculando área entre as curvas no intervalo [${a}, ${b}]`);
    
    // Calcula a diferença das funções
    const differenceExpr = `(${f1Str}) - (${f2Str})`;
    steps.push(`📊 Diferença: f1(${variable}) - f2(${variable}) = ${differenceExpr}`);
    
    // Calcula a integral da diferença
    const integralResult = calculateDefiniteIntegral(differenceExpr, a, b, variable);
    
    if (integralResult.success) {
      steps.push(...integralResult.steps);
      steps.push(`✅ Área entre as curvas: ${formatResult(integralResult.result)}`);
      
      return {
        result: integralResult.result,
        steps,
        success: true,
        method: 'area_between_curves'
      };
    } else {
      throw new Error('Erro no cálculo da integral da diferença');
    }
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo da área: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};
