/**
 * Serviço para cálculo de derivadas
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, formatResult } from './mathParser.js';

/**
 * Calcula a derivada de uma função
 * @param {string} functionStr - Expressão da função
 * @param {string} variable - Variável de derivação (padrão: 'x')
 * @returns {Object} {result, steps, success}
 */
export const calculateDerivative = (functionStr, variable = 'x') => {
  const steps = [];
  
  try {
    // Normaliza a expressão
    const normalizedExpr = normalizeExpression(functionStr);
    steps.push(`📝 Expressão normalizada: ${normalizedExpr}`);
    
    // Calcula a derivada
    const derivative = math.derivative(normalizedExpr, variable);
    const derivativeStr = derivative.toString();
    
    steps.push(`📐 Aplicando regra de derivação: d/d${variable}(${normalizedExpr})`);
    steps.push(`✅ Derivada calculada: ${derivativeStr}`);
    
    // Simplifica se possível
    const simplified = math.simplify(derivativeStr);
    if (simplified.toString() !== derivativeStr) {
      steps.push(`🔄 Simplificando: ${simplified.toString()}`);
    }
    
    return {
      result: simplified.toString(),
      steps,
      success: true,
      method: 'symbolic_derivative'
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo da derivada: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula derivadas de ordem superior
 * @param {string} functionStr - Expressão da função
 * @param {number} order - Ordem da derivada
 * @param {string} variable - Variável de derivação
 * @returns {Object} {result, steps, success}
 */
export const calculateHigherOrderDerivative = (functionStr, order, variable = 'x') => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando derivada de ordem ${order}`);
    
    let currentExpr = normalizedExpr;
    let currentOrder = 0;
    
    while (currentOrder < order) {
      const derivative = math.derivative(currentExpr, variable);
      currentExpr = derivative.toString();
      currentOrder++;
      
      steps.push(`🔄 ${currentOrder}ª derivada: ${currentExpr}`);
    }
    
    // Simplifica o resultado final
    const simplified = math.simplify(currentExpr);
    if (simplified.toString() !== currentExpr) {
      steps.push(`🔄 Simplificando resultado final: ${simplified.toString()}`);
    }
    
    return {
      result: simplified.toString(),
      steps,
      success: true,
      order,
      method: 'higher_order_derivative'
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula derivadas parciais (para funções de múltiplas variáveis)
 * @param {string} functionStr - Expressão da função
 * @param {Array<string>} variables - Variáveis da função
 * @returns {Object} {results, steps, success}
 */
export const calculatePartialDerivatives = (functionStr, variables) => {
  const steps = [];
  const results = {};
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    steps.push(`📝 Função: f(${variables.join(', ')}) = ${normalizedExpr}`);
    
    for (const variable of variables) {
      try {
        const partialDerivative = math.derivative(normalizedExpr, variable);
        const partialStr = partialDerivative.toString();
        
        steps.push(`📐 Derivada parcial em relação a ${variable}: ∂f/∂${variable} = ${partialStr}`);
        results[variable] = partialStr;
        
      } catch (error) {
        steps.push(`❌ Erro na derivada parcial de ${variable}: ${error.message}`);
        results[variable] = 'Erro';
      }
    }
    
    return {
      results,
      steps,
      success: Object.values(results).every(r => r !== 'Erro')
    };
    
  } catch (error) {
    steps.push(`❌ Erro geral: ${error.message}`);
    
    return {
      results: {},
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula a derivada numérica usando diferenças finitas
 * @param {string} functionStr - Expressão da função
 * @param {number} point - Ponto onde calcular a derivada
 * @param {string} variable - Variável de derivação
 * @param {number} h - Tamanho do passo (padrão: 0.001)
 * @returns {Object} {result, steps, success}
 */
export const calculateNumericalDerivative = (functionStr, point, variable = 'x', h = 0.001) => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando derivada numérica em ${variable} = ${point}`);
    steps.push(`🔢 Usando diferenças finitas com h = ${h}`);
    
    // Calcula f(x + h) e f(x - h)
    const fPlusH = expr.evaluate({ [variable]: point + h });
    const fMinusH = expr.evaluate({ [variable]: point - h });
    
    steps.push(`📊 f(${point + h}) = ${formatResult(fPlusH)}`);
    steps.push(`📊 f(${point - h}) = ${formatResult(fMinusH)}`);
    
    // Fórmula das diferenças centrais: f'(x) ≈ [f(x+h) - f(x-h)] / (2h)
    const derivative = (fPlusH - fMinusH) / (2 * h);
    
    steps.push(`📈 f'(${point}) ≈ [f(${point + h}) - f(${point - h})] / (2h)`);
    steps.push(`✅ f'(${point}) ≈ ${formatResult(derivative)}`);
    
    return {
      result: derivative,
      steps,
      success: true,
      method: 'numerical_derivative',
      h
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo numérico: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula a segunda derivada numérica
 * @param {string} functionStr - Expressão da função
 * @param {number} point - Ponto onde calcular a derivada
 * @param {string} variable - Variável de derivação
 * @param {number} h - Tamanho do passo
 * @returns {Object} {result, steps, success}
 */
export const calculateSecondNumericalDerivative = (functionStr, point, variable = 'x', h = 0.001) => {
  const steps = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Calculando segunda derivada numérica em ${variable} = ${point}`);
    
    // Calcula f(x + h), f(x) e f(x - h)
    const fPlusH = expr.evaluate({ [variable]: point + h });
    const f = expr.evaluate({ [variable]: point });
    const fMinusH = expr.evaluate({ [variable]: point - h });
    
    steps.push(`📊 f(${point + h}) = ${formatResult(fPlusH)}`);
    steps.push(`📊 f(${point}) = ${formatResult(f)}`);
    steps.push(`📊 f(${point - h}) = ${formatResult(fMinusH)}`);
    
    // Fórmula da segunda derivada: f''(x) ≈ [f(x+h) - 2f(x) + f(x-h)] / h²
    const secondDerivative = (fPlusH - 2 * f + fMinusH) / (h * h);
    
    steps.push(`📈 f''(${point}) ≈ [f(${point + h}) - 2f(${point}) + f(${point - h})] / h²`);
    steps.push(`✅ f''(${point}) ≈ ${formatResult(secondDerivative)}`);
    
    return {
      result: secondDerivative,
      steps,
      success: true,
      method: 'numerical_second_derivative',
      h
    };
    
  } catch (error) {
    steps.push(`❌ Erro no cálculo: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Encontra pontos críticos de uma função
 * @param {string} functionStr - Expressão da função
 * @param {Array<number>} interval - Intervalo [min, max] para buscar
 * @param {string} variable - Variável da função
 * @returns {Object} {criticalPoints, steps, success}
 */
export const findCriticalPoints = (functionStr, interval, variable = 'x') => {
  const steps = [];
  const criticalPoints = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const derivative = math.derivative(normalizedExpr, variable);
    const derivativeStr = derivative.toString();
    
    steps.push(`📝 Função: f(${variable}) = ${normalizedExpr}`);
    steps.push(`📐 Derivada: f'(${variable}) = ${derivativeStr}`);
    steps.push(`🔍 Procurando pontos críticos no intervalo [${interval[0]}, ${interval[1]}]`);
    
    // Compila a derivada
    const derivativeExpr = math.compile(derivativeStr);
    
    // Busca pontos onde f'(x) = 0
    const step = (interval[1] - interval[0]) / 1000; // 1000 pontos de busca
    
    for (let x = interval[0]; x <= interval[1]; x += step) {
      try {
        const value = derivativeExpr.evaluate({ [variable]: x });
        
        if (Math.abs(value) < 1e-6) { // Próximo de zero
          criticalPoints.push({
            x: x,
            type: 'critical',
            value: value
          });
        }
      } catch (error) {
        // Ignora pontos onde a derivada não está definida
      }
    }
    
    steps.push(`✅ Encontrados ${criticalPoints.length} pontos críticos`);
    
    return {
      criticalPoints,
      steps,
      success: true
    };
    
  } catch (error) {
    steps.push(`❌ Erro na busca de pontos críticos: ${error.message}`);
    
    return {
      criticalPoints: [],
      steps,
      success: false,
      error: error.message
    };
  }
};
