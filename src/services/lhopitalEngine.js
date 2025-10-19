/**
 * Serviço para aplicação da Regra de L'Hôpital
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, parseLimitPoint, formatResult } from './mathParser.js';

/**
 * Aplica a Regra de L'Hôpital para formas indeterminadas
 * @param {string} numerator - Numerador da fração
 * @param {string} denominator - Denominador da fração
 * @param {number|string} limitPoint - Ponto limite
 * @param {number} maxIterations - Máximo de iterações
 * @returns {Object} {result, steps, success, iterations}
 */
export const applyLHospitalRule = (numerator, denominator, limitPoint, maxIterations = 3) => {
  const steps = [];
  let currentNum = numerator;
  let currentDen = denominator;
  
  steps.push('🔍 Detectada forma indeterminada 0/0 ou ∞/∞');
  steps.push('📐 Aplicando a Regra de L\'Hôpital');
  steps.push(`📝 Numerador original: ${numerator}`);
  steps.push(`📝 Denominador original: ${denominator}`);
  
  for (let i = 0; i < maxIterations; i++) {
    try {
      // Calcula derivadas
      const numDerivative = math.derivative(currentNum, 'x').toString();
      const denDerivative = math.derivative(currentDen, 'x').toString();
      
      steps.push(`\n🔄 Iteração ${i + 1}:`);
      steps.push(`📊 Derivada do numerador: d/dx(${currentNum}) = ${numDerivative}`);
      steps.push(`📊 Derivada do denominador: d/dx(${currentDen}) = ${denDerivative}`);
      
      // Avalia as derivadas no ponto limite
      const numExpr = math.compile(numDerivative);
      const denExpr = math.compile(denDerivative);
      
      let numValue, denValue;
      
      if (Math.abs(limitPoint) === Infinity) {
        const largeValue = limitPoint > 0 ? 1e10 : -1e10;
        numValue = numExpr.evaluate({ x: largeValue });
        denValue = denExpr.evaluate({ x: largeValue });
        steps.push(`🔢 Avaliando em x = ${largeValue}:`);
      } else {
        numValue = numExpr.evaluate({ x: limitPoint });
        denValue = denExpr.evaluate({ x: limitPoint });
        steps.push(`🔢 Avaliando em x = ${limitPoint}:`);
      }
      
      steps.push(`📈 f'(${limitPoint}) = ${formatResult(numValue)}`);
      steps.push(`📈 g'(${limitPoint}) = ${formatResult(denValue)}`);
      
      // Verifica se ainda é forma indeterminada
      if (Math.abs(numValue) < 1e-10 && Math.abs(denValue) < 1e-10) {
        steps.push('⚠️ Ainda forma 0/0, continuando L\'Hôpital...');
        currentNum = numDerivative;
        currentDen = denDerivative;
        continue;
      } else if (Math.abs(numValue) > 1e10 && Math.abs(denValue) > 1e10) {
        steps.push('⚠️ Ainda forma ∞/∞, continuando L\'Hôpital...');
        currentNum = numDerivative;
        currentDen = denDerivative;
        continue;
      } else {
        // Não é mais forma indeterminada
        const result = denValue !== 0 ? numValue / denValue : 'Indeterminado';
        steps.push(`✅ Resultado: ${formatResult(result)}`);
        
        return {
          result: result,
          steps,
          success: true,
          iterations: i + 1,
          method: 'lhopital'
        };
      }
      
    } catch (error) {
      steps.push(`❌ Erro na iteração ${i + 1}: ${error.message}`);
      
      return {
        result: 'Erro',
        steps,
        iterations: i + 1,
        success: false,
        error: error.message
      };
    }
  }
  
  steps.push(`⚠️ Máximo de ${maxIterations} iterações atingido`);
  
  return {
    result: 'Máximo de iterações atingido',
    steps,
    iterations: maxIterations,
    success: false
  };
};

/**
 * Detecta se uma expressão é candidata para L'Hôpital
 * @param {string} expr - Expressão a ser analisada
 * @param {number|string} limitPoint - Ponto limite
 * @returns {Object} {isCandidate, form, numerator, denominator}
 */
export const detectLHospitalCandidate = (expr, limitPoint) => {
  try {
    // Verifica se é uma fração
    if (!expr.includes('/')) {
      return { isCandidate: false, reason: 'Não é uma fração' };
    }
    
    const parts = expr.split('/');
    if (parts.length !== 2) {
      return { isCandidate: false, reason: 'Expressão não é uma fração simples' };
    }
    
    const numerator = parts[0].trim();
    const denominator = parts[1].trim();
    
    // Avalia numerador e denominador no ponto limite
    const numExpr = math.compile(normalizeExpression(numerator));
    const denExpr = math.compile(normalizeExpression(denominator));
    
    let numValue, denValue;
    
    if (Math.abs(limitPoint) === Infinity) {
      const largeValue = limitPoint > 0 ? 1e10 : -1e10;
      numValue = numExpr.evaluate({ x: largeValue });
      denValue = denExpr.evaluate({ x: largeValue });
    } else {
      numValue = numExpr.evaluate({ x: limitPoint });
      denValue = denExpr.evaluate({ x: limitPoint });
    }
    
    // Verifica se é forma indeterminada
    const isZeroOverZero = Math.abs(numValue) < 1e-10 && Math.abs(denValue) < 1e-10;
    const isInfinityOverInfinity = Math.abs(numValue) > 1e10 && Math.abs(denValue) > 1e10;
    
    if (isZeroOverZero) {
      return {
        isCandidate: true,
        form: '0/0',
        numerator,
        denominator,
        reason: 'Forma indeterminada 0/0'
      };
    } else if (isInfinityOverInfinity) {
      return {
        isCandidate: true,
        form: '∞/∞',
        numerator,
        denominator,
        reason: 'Forma indeterminada ∞/∞'
      };
    }
    
    return { 
      isCandidate: false, 
      reason: 'Não é forma indeterminada',
      numValue,
      denValue
    };
    
  } catch (error) {
    return { 
      isCandidate: false, 
      reason: `Erro na análise: ${error.message}` 
    };
  }
};

/**
 * Aplica L'Hôpital com verificação de convergência
 * @param {string} numerator - Numerador
 * @param {string} denominator - Denominador
 * @param {number|string} limitPoint - Ponto limite
 * @returns {Object} {result, steps, success, converged}
 */
export const applyLHospitalWithConvergence = (numerator, denominator, limitPoint) => {
  const steps = [];
  const tolerance = 1e-6;
  let currentNum = numerator;
  let currentDen = denominator;
  let previousResult = null;
  let iteration = 0;
  const maxIterations = 5;
  
  steps.push('🔍 Aplicando L\'Hôpital com verificação de convergência');
  
  while (iteration < maxIterations) {
    try {
      const lhopitalResult = applyLHospitalRule(currentNum, currentDen, limitPoint, 1);
      
      if (!lhopitalResult.success) {
        steps.push(`❌ Erro na iteração ${iteration + 1}: ${lhopitalResult.error}`);
        break;
      }
      
      const currentResult = lhopitalResult.result;
      steps.push(`📊 Iteração ${iteration + 1}: ${formatResult(currentResult)}`);
      
      // Verifica convergência
      if (previousResult !== null) {
        const difference = Math.abs(currentResult - previousResult);
        steps.push(`📈 Diferença: ${formatResult(difference)}`);
        
        if (difference < tolerance) {
          steps.push(`✅ Convergência atingida! Resultado: ${formatResult(currentResult)}`);
          return {
            result: currentResult,
            steps,
            success: true,
            converged: true,
            iterations: iteration + 1
          };
        }
      }
      
      previousResult = currentResult;
      
      // Atualiza para próxima iteração
      currentNum = math.derivative(currentNum, 'x').toString();
      currentDen = math.derivative(currentDen, 'x').toString();
      iteration++;
      
    } catch (error) {
      steps.push(`❌ Erro na iteração ${iteration + 1}: ${error.message}`);
      break;
    }
  }
  
  steps.push(`⚠️ Convergência não atingida em ${maxIterations} iterações`);
  
  return {
    result: previousResult || 'Não convergiu',
    steps,
    success: previousResult !== null,
    converged: false,
    iterations: iteration
  };
};
