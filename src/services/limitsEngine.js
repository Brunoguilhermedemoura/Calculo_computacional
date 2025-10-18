/**
 * Motor de cálculo de limites
 * Equivalente ao limits_engine.py do sistema Python
 */

import { math } from '../utils/mathConfig.js';
import { 
  INDETERMINATE_FORMS, 
  MATH_CONSTANTS,
  EXAMPLE_LIMITS 
} from '../utils/constants.js';
import { 
  normalizeExpression, 
  parseLimitPoint, 
  formatResult 
} from './mathParser.js';

// math já importado do mathConfig.js com configuração padronizada

/**
 * Detecta a forma do limite ao substituir x = a
 * @param {string} exprStr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto para onde x tende
 * @returns {string} Forma detectada
 */
export const detectForm = (exprStr, limitPoint) => {
  try {
    // Cria uma função para avaliar a expressão
    const expr = math.compile(exprStr);
    
    // Substitui x pelo ponto limite
    const substituted = expr.evaluate({ x: limitPoint });
    
      // Verifica se é uma forma indeterminada
      if (isNaN(substituted) || !isFinite(substituted)) {
        // Tenta detectar o tipo de indeterminação
        if (exprStr.includes('/') && exprStr.includes('x')) {
          // Verifica se numerador e denominador tendem a 0
          const parts = exprStr.split('/');
          if (parts.length === 2) {
            const numerator = math.compile(parts[0]);
            const denominator = math.compile(parts[1]);
            
            const numVal = numerator.evaluate({ x: limitPoint });
            const denVal = denominator.evaluate({ x: limitPoint });
            
            if (Math.abs(numVal) < 1e-10 && Math.abs(denVal) < 1e-10) {
              return INDETERMINATE_FORMS.ZERO_OVER_ZERO;
            } else if (Math.abs(numVal) > 1e10 && Math.abs(denVal) > 1e10) {
              return INDETERMINATE_FORMS.INFINITY_OVER_INFINITY;
            }
          }
        }
        
        // Verifica se é 1^∞
        if (exprStr.includes('**') && exprStr.includes('x')) {
          const parts = exprStr.split('**');
          if (parts.length === 2) {
            const base = math.compile(parts[0]);
            const exponent = math.compile(parts[1]);
            
            const baseVal = base.evaluate({ x: limitPoint });
            const expVal = exponent.evaluate({ x: limitPoint });
            
            if (Math.abs(baseVal - 1) < 1e-10 && Math.abs(expVal) > 1e10) {
              return INDETERMINATE_FORMS.ONE_TO_INFINITY;
            }
          }
        }
        
        if (Math.abs(substituted) === Infinity) {
          return INDETERMINATE_FORMS.INFINITY;
        }
        
        return INDETERMINATE_FORMS.UNDEFINED;
      }
    
    return INDETERMINATE_FORMS.NUMERICAL;
    
  } catch {
    return INDETERMINATE_FORMS.UNDEFINED;
  }
};

/**
 * Gera dicas de técnicas baseadas na forma detectada
 * @param {string} form - Forma detectada do limite
 * @param {string} exprStr - Expressão original
 * @returns {Array<string>} Lista de dicas
 */
export const generateTips = (form, exprStr) => {
  const tips = [];
  
  switch (form) {
    case INDETERMINATE_FORMS.ZERO_OVER_ZERO:
      tips.push('Forma indeterminada 0/0: tente fatorar e cancelar termos comuns');
      if (exprStr.includes('sqrt') || exprStr.includes('**(1/2)')) {
        tips.push('Contém raiz quadrada: considere racionalizar');
      }
      if (exprStr.includes('sin') || exprStr.includes('cos') || exprStr.includes('tan')) {
        tips.push('Contém funções trigonométricas: use limites fundamentais');
      }
      break;
      
    case INDETERMINATE_FORMS.INFINITY_OVER_INFINITY:
      tips.push('Forma indeterminada ∞/∞: divida numerador e denominador pelos maiores graus');
      tips.push('Para polinômios: limite = coeficiente do termo de maior grau');
      break;
      
    case INDETERMINATE_FORMS.INFINITY_MINUS_INFINITY:
      tips.push('Forma indeterminada ∞-∞: tente fatorar ou racionalizar');
      tips.push('Considere reescrever como uma fração');
      break;
      
    case INDETERMINATE_FORMS.ONE_TO_INFINITY:
      tips.push('Forma indeterminada 1^∞: use a identidade lim(1 + f(x))^g(x) = e^(lim f(x)*g(x))');
      tips.push('Ou aplique logaritmo natural e use L\'Hôpital');
      break;
      
    case INDETERMINATE_FORMS.ZERO_TIMES_INFINITY:
      tips.push('Forma indeterminada 0·∞: reescreva como quociente 0/0 ou ∞/∞');
      tips.push('Use a identidade f(x)*g(x) = f(x)/(1/g(x))');
      break;
      
    case INDETERMINATE_FORMS.ZERO_TO_ZERO:
    case INDETERMINATE_FORMS.INFINITY_TO_ZERO:
      tips.push('Forma indeterminada 0^0 ou ∞^0: use logaritmo natural e L\'Hôpital');
      tips.push('Considere lim f(x)^g(x) = e^(lim g(x)*ln(f(x)))');
      break;
      
    case INDETERMINATE_FORMS.NUMERICAL:
      tips.push('Substituição direta: o limite é o valor da função no ponto');
      break;
      
    case INDETERMINATE_FORMS.INFINITY:
      tips.push('O limite tende ao infinito: verifique o comportamento assintótico');
      break;
      
    default:
      tips.push('Forma complexa: analise cada termo separadamente');
      if (exprStr.includes('sin') || exprStr.includes('cos')) {
        tips.push('Use identidades trigonométricas ou limites fundamentais');
      }
      if (exprStr.includes('log') || exprStr.includes('exp')) {
        tips.push('Considere propriedades de funções exponenciais e logarítmicas');
      }
  }
  
  return tips;
};

/**
 * Calcula o limite de uma função
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto para onde x tende
 * @param {string} direction - Direção do limite ("ambos", "esquerda", "direita")
 * @returns {Object} {result, steps, tips}
 */
export const calculateLimit = (functionStr, limitPointStr, direction) => {
  const steps = [];
  let tips = [];
  
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
    steps.push(`Expressão normalizada: ${normalizedExpr}`);
    
    // Converte o ponto limite
    const limitPoint = parseLimitPoint(limitPointStr);
    if (limitPoint === null) {
      throw new Error('Ponto limite inválido');
    }
    
    // Detecta a forma do limite
    let form;
    if (Math.abs(limitPoint) === Infinity) {
      // Para limites no infinito, verifica se é forma indeterminada
      if (normalizedExpr.includes('/') && normalizedExpr.includes('x')) {
        form = INDETERMINATE_FORMS.INFINITY_OVER_INFINITY;
      } else if (normalizedExpr.includes('**') && normalizedExpr.includes('x')) {
        form = INDETERMINATE_FORMS.ONE_TO_INFINITY;
      } else {
        form = INDETERMINATE_FORMS.NUMERICAL;
      }
    } else {
      form = detectForm(normalizedExpr, limitPoint);
    }
    steps.push(`Forma detectada: ${form}`);
    
    // Gera dicas baseadas na forma
    tips = generateTips(form, normalizedExpr);
    
      // Calcula o limite usando Math.js
      let result;
      
      try {
        // Compila a expressão
        const expr = math.compile(normalizedExpr);
        
        // Calcula o limite considerando a direção
        if (Math.abs(limitPoint) === Infinity) {
          // Para limites no infinito, usa um valor grande
          const largeValue = limitPoint > 0 ? 1e10 : -1e10;
          result = expr.evaluate({ x: largeValue });
          
          // Verifica se é o limite fundamental lim(1+1/x)^x = e
          if (normalizedExpr.includes('(1+1/x)**x') || normalizedExpr.includes('(1+1/x)^x')) {
            result = Math.E;
            steps.push('Limite fundamental: lim(1+1/x)^x = e ≈ 2.71828');
          }
          // Para funções racionais no infinito, calcula o limite dos coeficientes principais
          else if (normalizedExpr.includes('/') && normalizedExpr.includes('x**')) {
            try {
              // Extrai os graus e coeficientes principais
              const parts = normalizedExpr.split('/');
              if (parts.length === 2) {
                const numerator = parts[0];
                const denominator = parts[1];
                
                // Encontra o maior grau no numerador e denominador
                const numDegree = Math.max(...numerator.match(/x\*\*(\d+)/g)?.map(m => parseInt(m.match(/\d+/)[0])) || [0]);
                const denDegree = Math.max(...denominator.match(/x\*\*(\d+)/g)?.map(m => parseInt(m.match(/\d+/)[0])) || [0]);
                
                if (numDegree === denDegree) {
                  // Mesmo grau: limite = coeficiente do numerador / coeficiente do denominador
                  const numCoef = parseFloat(numerator.match(/(\d+(?:\.\d+)?)\*x\*\*(\d+)/)?.[1] || '1');
                  const denCoef = parseFloat(denominator.match(/(\d+(?:\.\d+)?)\*x\*\*(\d+)/)?.[1] || '1');
                  result = numCoef / denCoef;
                  steps.push(`Função racional: limite = ${numCoef}/${denCoef} = ${result}`);
                } else if (numDegree > denDegree) {
                  result = limitPoint > 0 ? Infinity : -Infinity;
                  steps.push(`Grau do numerador maior: limite = ${result > 0 ? '∞' : '-∞'}`);
                } else {
                  result = 0;
                  steps.push('Grau do denominador maior: limite = 0');
                }
              }
            } catch {
              // Se falhar, usa o valor calculado anteriormente
            }
          }
        } else {
          // Para limites finitos, considera a direção
          const delta = 0.0001;
          let leftLimit, rightLimit;
          
          if (direction === 'esquerda') {
            result = expr.evaluate({ x: limitPoint - delta });
            steps.push(`Limite à esquerda: f(${limitPoint - delta}) = ${formatResult(result)}`);
          } else if (direction === 'direita') {
            result = expr.evaluate({ x: limitPoint + delta });
            steps.push(`Limite à direita: f(${limitPoint + delta}) = ${formatResult(result)}`);
          } else {
            // Ambos: calcula os dois lados e verifica se são iguais
            leftLimit = expr.evaluate({ x: limitPoint - delta });
            rightLimit = expr.evaluate({ x: limitPoint + delta });
            
            steps.push(`Limite à esquerda: f(${limitPoint - delta}) = ${formatResult(leftLimit)}`);
            steps.push(`Limite à direita: f(${limitPoint + delta}) = ${formatResult(rightLimit)}`);
            
            if (Math.abs(leftLimit - rightLimit) < 1e-6) {
              result = (leftLimit + rightLimit) / 2;
              steps.push(`Limites laterais iguais: limite = ${formatResult(result)}`);
            } else {
              throw new Error(`Limites laterais diferentes: esquerda=${formatResult(leftLimit)}, direita=${formatResult(rightLimit)}`);
            }
          }
        }
      
      steps.push(`Resultado do limite: ${formatResult(result)}`);
      
      // Aplica simplificações se possível
      if (typeof result === 'number' && !isFinite(result)) {
        if (result > 0) {
          result = Infinity;
        } else {
          result = -Infinity;
        }
      }
      
    } catch {
      // Se o cálculo direto falhar, tenta aproximação
      steps.push('Tentando aproximação numérica...');
      
      try {
        // Recompila a expressão para o bloco catch
        const expr = math.compile(normalizedExpr);
        const delta = 0.0001;
        let leftLimit, rightLimit;
        
        if (Math.abs(limitPoint) === Infinity) {
          const largeValue = limitPoint > 0 ? 1e10 : -1e10;
          result = expr.evaluate({ x: largeValue });
        } else {
          if (direction === 'esquerda') {
            result = expr.evaluate({ x: limitPoint - delta });
            steps.push(`Aproximação à esquerda: f(${limitPoint - delta}) = ${formatResult(result)}`);
          } else if (direction === 'direita') {
            result = expr.evaluate({ x: limitPoint + delta });
            steps.push(`Aproximação à direita: f(${limitPoint + delta}) = ${formatResult(result)}`);
          } else {
            // Ambos: calcula os dois lados
            leftLimit = expr.evaluate({ x: limitPoint - delta });
            rightLimit = expr.evaluate({ x: limitPoint + delta });
            
            steps.push(`Aproximação à esquerda: f(${limitPoint - delta}) = ${formatResult(leftLimit)}`);
            steps.push(`Aproximação à direita: f(${limitPoint + delta}) = ${formatResult(rightLimit)}`);
            
            if (Math.abs(leftLimit - rightLimit) < 1e-6) {
              result = (leftLimit + rightLimit) / 2;
              steps.push(`Limites laterais iguais: limite = ${formatResult(result)}`);
            } else {
              throw new Error(`Limites laterais diferentes: esquerda=${formatResult(leftLimit)}, direita=${formatResult(rightLimit)}`);
            }
          }
        }
      } catch (approxError) {
        // Se a aproximação também falhar, fornece erro mais específico
        throw new Error(`Erro na aproximação: ${approxError.message}`);
      }
    }
    
    // Formata o resultado final
    const formattedResult = formatResult(result);
    steps.push(`Resultado final: ${formattedResult}`);
    
    return {
      result: formattedResult,
      steps,
      tips
    };
    
  } catch (error) {
    const errorMsg = `Erro no cálculo: ${error.message}`;
    steps.push(errorMsg);
    tips.push('Verifique a sintaxe da expressão e tente novamente');
    
    return {
      result: 'Erro',
      steps,
      tips
    };
  }
};

/**
 * Retorna exemplos pré-definidos
 * @returns {Array} Lista de exemplos
 */
export const getExamples = () => {
  return EXAMPLE_LIMITS;
};

/**
 * Calcula limite lateral com malha decrescente
 * @param {string} exprStr - Expressão normalizada
 * @param {number} a - Ponto limite
 * @param {string} side - 'esquerda' ou 'direita'
 * @returns {Object} {result, steps, convergence}
 */
export const computeLateralLimit = (exprStr, a, side) => {
  const steps = [];
  const tolerance = 1e-6;
  const hValues = [1e-1, 1e-2, 1e-3];
  
  try {
    const expr = math.compile(exprStr);
    const results = [];
    
    steps.push(`Calculando limite à ${side} com malha decrescente`);
    
    for (const h of hValues) {
      const xValue = side === 'esquerda' ? a - h : a + h;
      const result = expr.evaluate({ x: xValue });
      results.push(result);
      
      steps.push(`h = ${h}: f(${xValue}) = ${formatResult(result)}`);
    }
    
    // Verifica convergência
    const lastTwo = results.slice(-2);
    const convergence = Math.abs(lastTwo[1] - lastTwo[0]) < tolerance;
    
    if (convergence) {
      const finalResult = lastTwo[1];
      steps.push(`Convergência detectada: limite = ${formatResult(finalResult)}`);
      
      return {
        result: finalResult,
        steps,
        convergence: true,
        hValues,
        results
      };
    } else {
      steps.push('Não foi possível determinar convergência com a malha usada');
      
      return {
        result: 'Não convergiu',
        steps,
        convergence: false,
        hValues,
        results
      };
    }
    
  } catch (error) {
    steps.push(`Erro no cálculo: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      convergence: false,
      error: error.message
    };
  }
};

/**
 * Calcula limites laterais e compara
 * @param {string} exprStr - Expressão normalizada
 * @param {number} a - Ponto limite
 * @returns {Object} {result, steps, leftLimit, rightLimit, exists}
 */
export const computeBothSides = (exprStr, a) => {
  const steps = [];
  const tolerance = 1e-6;
  
  steps.push(`Calculando limites laterais para x → ${a}`);
  
  // Calcula limite à esquerda
  const leftResult = computeLateralLimit(exprStr, a, 'esquerda');
  steps.push(...leftResult.steps);
  
  // Calcula limite à direita
  const rightResult = computeLateralLimit(exprStr, a, 'direita');
  steps.push(...rightResult.steps);
  
  const leftLimit = leftResult.result;
  const rightLimit = rightResult.result;
  
  // Verifica se os limites existem e são iguais
  if (leftResult.convergence && rightResult.convergence) {
    const difference = Math.abs(leftLimit - rightLimit);
    
    if (difference < tolerance) {
      const finalResult = (leftLimit + rightLimit) / 2;
      steps.push(`Limites laterais iguais: limite = ${formatResult(finalResult)}`);
      
      return {
        result: finalResult,
        steps,
        leftLimit,
        rightLimit,
        exists: true,
        difference
      };
    } else {
      steps.push(`Limites laterais diferentes: esquerda=${formatResult(leftLimit)}, direita=${formatResult(rightLimit)}`);
      steps.push('Limite não existe (laterais diferentes)');
      
      return {
        result: 'Não existe',
        steps,
        leftLimit,
        rightLimit,
        exists: false,
        difference
      };
    }
  } else {
    steps.push('Não foi possível determinar os limites laterais com segurança');
    
    return {
      result: 'Indeterminado',
      steps,
      leftLimit,
      rightLimit,
      exists: false,
      error: 'Falha na convergência'
    };
  }
};

/**
 * Verifica se uma expressão é um polinômio
 * @param {string} expr - Expressão a ser verificada
 * @returns {boolean} True se é polinômio
 */
export const isPolynomial = (expr) => {
  // Remove espaços
  const clean = expr.replace(/\s/g, '');
  
  // Verifica se contém apenas operações polinomiais
  const polynomialPattern = /^[0-9+\-*/.()x\s**]+$/;
  
  if (!polynomialPattern.test(clean)) return false;
  
  // Verifica se não contém funções não-polinomiais
  const nonPolynomialFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt', 'ln', 'abs'];
  return !nonPolynomialFunctions.some(func => clean.includes(func));
};

/**
 * Fatora uma expressão polinomial se possível
 * @param {string} expr - Expressão polinomial
 * @returns {Object} {factored, steps, success}
 */
export const factorIfPolynomial = (expr) => {
  const steps = [];
  
  try {
    // Tenta simplificar usando math.simplify
    const simplified = math.simplify(expr);
    steps.push(`Expressão simplificada: ${simplified.toString()}`);
    
    // Verifica se houve mudança significativa
    if (simplified.toString() !== expr) {
      steps.push('Fatoração aplicada com sucesso');
      
      return {
        factored: simplified.toString(),
        steps,
        success: true,
        method: 'math_simplify'
      };
    }
    
    // Tenta fatoração manual para casos específicos
    const manualResult = manualFactoring(expr);
    if (manualResult.success) {
      steps.push(...manualResult.steps);
      
      return {
        factored: manualResult.factored,
        steps,
        success: true,
        method: 'manual'
      };
    }
    
    steps.push('Não foi possível fatorar a expressão');
    
    return {
      factored: expr,
      steps,
      success: false,
      method: 'none'
    };
    
  } catch (error) {
    steps.push(`Erro na fatoração: ${error.message}`);
    
    return {
      factored: expr,
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Fatoração manual para casos específicos
 * @param {string} expr - Expressão a ser fatorada
 * @returns {Object} {factored, steps, success}
 */
const manualFactoring = (expr) => {
  const steps = [];
  
  // Diferença de quadrados: a² - b² = (a + b)(a - b)
  const diffSquaresPattern = /([a-zA-Z0-9**\s()]+)\*\*2\s*-\s*([a-zA-Z0-9**\s()]+)\*\*2/;
  const diffSquaresMatch = expr.match(diffSquaresPattern);
  
  if (diffSquaresMatch) {
    const a = diffSquaresMatch[1].trim();
    const b = diffSquaresMatch[2].trim();
    const factored = `(${a} + ${b}) * (${a} - ${b})`;
    
    steps.push(`Diferença de quadrados detectada: ${a}² - ${b}²`);
    steps.push(`Fatorando: (${a} + ${b})(${a} - ${b})`);
    
    return {
      factored,
      steps,
      success: true,
      type: 'difference_of_squares'
    };
  }
  
  // Fator comum: ax + bx = x(a + b)
  const commonFactorPattern = /([a-zA-Z0-9**\s()]+)\*([a-zA-Z0-9**\s()]+)\s*\+\s*([a-zA-Z0-9**\s()]+)\*([a-zA-Z0-9**\s()]+)/;
  const commonFactorMatch = expr.match(commonFactorPattern);
  
  if (commonFactorMatch) {
    const factor1 = commonFactorMatch[1].trim();
    const term1 = commonFactorMatch[2].trim();
    const factor2 = commonFactorMatch[3].trim();
    const term2 = commonFactorMatch[4].trim();
    
    if (factor1 === factor2) {
      const factored = `${factor1} * (${term1} + ${term2})`;
      
      steps.push(`Fator comum detectado: ${factor1}`);
      steps.push(`Fatorando: ${factor1}(${term1} + ${term2})`);
      
      return {
        factored,
        steps,
        success: true,
        type: 'common_factor'
      };
    }
  }
  
  // Trinômio quadrado perfeito: a² + 2ab + b² = (a + b)²
  const perfectSquarePattern = /([a-zA-Z0-9**\s()]+)\*\*2\s*\+\s*2\*([a-zA-Z0-9**\s()]+)\*([a-zA-Z0-9**\s()]+)\s*\+\s*([a-zA-Z0-9**\s()]+)\*\*2/;
  const perfectSquareMatch = expr.match(perfectSquarePattern);
  
  if (perfectSquareMatch) {
    const a = perfectSquareMatch[1].trim();
    const b = perfectSquareMatch[4].trim();
    const factored = `(${a} + ${b})**2`;
    
    steps.push(`Trinômio quadrado perfeito detectado`);
    steps.push(`Fatorando: (${a} + ${b})²`);
    
    return {
      factored,
      steps,
      success: true,
      type: 'perfect_square_trinomial'
    };
  }
  
  return {
    factored: expr,
    steps: ['Nenhum padrão de fatoração reconhecido'],
    success: false
  };
};

/**
 * Verifica se uma expressão tem raízes em fração
 * @param {string} expr - Expressão a ser verificada
 * @returns {boolean} True se tem raízes
 */
export const hasRadicalsInFraction = (expr) => {
  // Verifica se contém sqrt ou potências fracionárias
  const hasSqrt = expr.includes('sqrt(') || expr.includes('**(1/2)');
  const hasFractionalPower = /x\*\*\([0-9]+\/[0-9]+\)/.test(expr);
  
  return hasSqrt || hasFractionalPower;
};

/**
 * Racionaliza uma expressão multiplicando pelo conjugado
 * @param {string} expr - Expressão com raízes
 * @returns {Object} {rationalized, steps, success}
 */
export const rationalizeByConjugate = (expr) => {
  const steps = [];
  
  try {
    // Padrão: (√a - √b) / c
    const sqrtDiffPattern = /\(sqrt\(([^)]+)\)\s*-\s*sqrt\(([^)]+)\)\)\s*\/\s*([^)]+)/;
    const sqrtDiffMatch = expr.match(sqrtDiffPattern);
    
    if (sqrtDiffMatch) {
      const a = sqrtDiffMatch[1];
      const b = sqrtDiffMatch[2];
      const c = sqrtDiffMatch[3];
      
      steps.push(`Racionalizando: (√${a} - √${b}) / ${c}`);
      steps.push(`Multiplicando pelo conjugado: (√${a} + √${b}) / (√${a} + √${b})`);
      
      // Aplica identidade: (√a - √b)(√a + √b) = a - b
      const numerator = `(${a}) - (${b})`;
      const denominator = `${c} * (sqrt(${a}) + sqrt(${b}))`;
      const rationalized = `(${numerator}) / (${denominator})`;
      
      steps.push(`Aplicando identidade: (√a - √b)(√a + √b) = a - b`);
      steps.push(`Resultado: ${rationalized}`);
      
      return {
        rationalized,
        steps,
        success: true,
        type: 'sqrt_difference'
      };
    }
    
    // Padrão: (√a - b) / c
    const sqrtConstPattern = /\(sqrt\(([^)]+)\)\s*-\s*([0-9]+)\)\s*\/\s*([^)]+)/;
    const sqrtConstMatch = expr.match(sqrtConstPattern);
    
    if (sqrtConstMatch) {
      const a = sqrtConstMatch[1];
      const b = sqrtConstMatch[2];
      const c = sqrtConstMatch[3];
      
      steps.push(`Racionalizando: (√${a} - ${b}) / ${c}`);
      steps.push(`Multiplicando pelo conjugado: (√${a} + ${b}) / (√${a} + ${b})`);
      
      const numerator = `(${a}) - (${b}**2)`;
      const denominator = `${c} * (sqrt(${a}) + ${b})`;
      const rationalized = `(${numerator}) / (${denominator})`;
      
      steps.push(`Aplicando identidade: (√a - b)(√a + b) = a - b²`);
      steps.push(`Resultado: ${rationalized}`);
      
      return {
        rationalized,
        steps,
        success: true,
        type: 'sqrt_constant'
      };
    }
    
    // Padrão: (a - √b) / c
    const constSqrtPattern = /\(([0-9]+)\s*-\s*sqrt\(([^)]+)\)\)\s*\/\s*([^)]+)/;
    const constSqrtMatch = expr.match(constSqrtPattern);
    
    if (constSqrtMatch) {
      const a = constSqrtMatch[1];
      const b = constSqrtMatch[2];
      const c = constSqrtMatch[3];
      
      steps.push(`Racionalizando: (${a} - √${b}) / ${c}`);
      steps.push(`Multiplicando pelo conjugado: (${a} + √${b}) / (${a} + √${b})`);
      
      const numerator = `(${a}**2) - (${b})`;
      const denominator = `${c} * (${a} + sqrt(${b}))`;
      const rationalized = `(${numerator}) / (${denominator})`;
      
      steps.push(`Aplicando identidade: (a - √b)(a + √b) = a² - b`);
      steps.push(`Resultado: ${rationalized}`);
      
      return {
        rationalized,
        steps,
        success: true,
        type: 'constant_sqrt'
      };
    }
    
    steps.push('Nenhum padrão de racionalização reconhecido');
    
    return {
      rationalized: expr,
      steps,
      success: false
    };
    
  } catch (error) {
    steps.push(`Erro na racionalização: ${error.message}`);
    
    return {
      rationalized: expr,
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula o grau dominante de um termo
 * @param {string} term - Termo a ser analisado
 * @returns {number} Grau dominante
 */
export const dominantDegree = (term) => {
  // Remove espaços
  const clean = term.replace(/\s/g, '');
  
  // Encontra todas as potências de x
  const powerMatches = clean.match(/x\*\*(\d+)/g);
  
  if (!powerMatches || powerMatches.length === 0) {
    return 0; // Sem x, grau 0
  }
  
  // Extrai os graus e retorna o maior
  const degrees = powerMatches.map(match => {
    const degree = match.match(/(\d+)/)[1];
    return parseInt(degree);
  });
  
  return Math.max(...degrees);
};

/**
 * Evidencia o maior grau em expressões racionais
 * @param {string} numerator - Numerador
 * @param {string} denominator - Denominador
 * @returns {Object} {highlighted, steps, maxDegree}
 */
export const highlightDominantPower = (numerator, denominator) => {
  const steps = [];
  
  try {
    // Calcula graus dominantes
    const numDegree = dominantDegree(numerator);
    const denDegree = dominantDegree(denominator);
    const maxDegree = Math.max(numDegree, denDegree);
    
    steps.push(`Grau do numerador: ${numDegree}`);
    steps.push(`Grau do denominador: ${denDegree}`);
    steps.push(`Maior grau: ${maxDegree}`);
    
    if (maxDegree === 0) {
      steps.push('Expressão constante: limite = valor da expressão');
      
      return {
        highlighted: `${numerator} / ${denominator}`,
        steps,
        maxDegree: 0,
        type: 'constant'
      };
    }
    
    // Divide numerador e denominador por x^maxDegree
    const numDivided = divideByPower(numerator, maxDegree);
    const denDivided = divideByPower(denominator, maxDegree);
    
    steps.push(`Dividindo numerador por x^${maxDegree}: ${numDivided}`);
    steps.push(`Dividindo denominador por x^${maxDegree}: ${denDivided}`);
    
    const highlighted = `(${numDivided}) / (${denDivided})`;
    steps.push(`Expressão evidenciada: ${highlighted}`);
    
    // Analisa o comportamento no infinito
    if (numDegree === denDegree) {
      steps.push('Mesmo grau: limite = razão dos coeficientes principais');
    } else if (numDegree > denDegree) {
      steps.push('Grau do numerador maior: limite = ±∞');
    } else {
      steps.push('Grau do denominador maior: limite = 0');
    }
    
    return {
      highlighted,
      steps,
      maxDegree,
      numDegree,
      denDegree,
      type: 'rational'
    };
    
  } catch (error) {
    steps.push(`Erro na evidência de grau: ${error.message}`);
    
    return {
      highlighted: `${numerator} / ${denominator}`,
      steps,
      maxDegree: 0,
      error: error.message
    };
  }
};

/**
 * Divide um termo por uma potência de x
 * @param {string} term - Termo a ser dividido
 * @param {number} power - Potência de x
 * @returns {string} Termo dividido
 */
const divideByPower = (term, power) => {
  if (power === 0) return term;
  
  // Padrão para encontrar termos com x^n
  const termPattern = /([+-]?\s*\d*\.?\d*)\s*\*?\s*x\*\*(\d+)/g;
  let result = term;
  
  result = result.replace(termPattern, (match, coef, exp) => {
    const coefficient = coef.trim() || '1';
    const exponent = parseInt(exp);
    const newExponent = exponent - power;
    
    if (newExponent === 0) {
      return coefficient; // x^0 = 1
    } else if (newExponent === 1) {
      return `${coefficient} * x`;
    } else {
      return `${coefficient} * x**${newExponent}`;
    }
  });
  
  // Adiciona 1/x^power para termos constantes
  if (result.includes('+') || result.includes('-')) {
    // Se há operações, adiciona 1/x^power no final
    result = `(${result}) / x**${power}`;
  } else {
    // Termo simples
    result = `${result} / x**${power}`;
  }
  
  return result;
};

/**
 * Verifica se é forma ∞-∞
 * @param {string} expr - Expressão a ser verificada
 * @param {number|string} a - Ponto limite
 * @returns {boolean} True se é ∞-∞
 */
export const isInfinityMinusInfinity = (expr, a) => {
  // Verifica se é limite no infinito
  if (Math.abs(a) !== Infinity) return false;
  
  // Verifica se contém subtração e termos com x
  if (!expr.includes('-')) return false;
  
  const terms = expr.split('-');
  if (terms.length !== 2) return false;
  
  const left = terms[0].trim();
  const right = terms[1].trim();
  
  // Ambos os termos devem conter x para tender ao infinito
  return left.includes('x') && right.includes('x');
};

/**
 * Aplica L'Hôpital com limite de iterações
 * @param {string} numerator - Numerador
 * @param {string} denominator - Denominador
 * @param {number} limitPoint - Ponto limite
 * @param {number} maxIterations - Máximo de iterações (padrão: 2)
 * @returns {Object} {result, steps, iterations}
 */
export const applyLHospital = (numerator, denominator, limitPoint, maxIterations = 2) => {
  const steps = [];
  let currentNum = numerator;
  let currentDen = denominator;
  
  steps.push('Aplicando regra de L\'Hôpital');
  steps.push(`Numerador original: ${numerator}`);
  steps.push(`Denominador original: ${denominator}`);
  
  for (let i = 0; i < maxIterations; i++) {
    try {
      // Calcula derivadas
      const numDerivative = math.derivative(currentNum, 'x').toString();
      const denDerivative = math.derivative(currentDen, 'x').toString();
      
      steps.push(`Iteração ${i + 1}:`);
      steps.push(`Derivada do numerador: ${numDerivative}`);
      steps.push(`Derivada do denominador: ${denDerivative}`);
      
      // Avalia as derivadas no ponto limite
      const numExpr = math.compile(numDerivative);
      const denExpr = math.compile(denDerivative);
      
      let numValue, denValue;
      
      if (Math.abs(limitPoint) === Infinity) {
        const largeValue = limitPoint > 0 ? 1e10 : -1e10;
        numValue = numExpr.evaluate({ x: largeValue });
        denValue = denExpr.evaluate({ x: largeValue });
      } else {
        numValue = numExpr.evaluate({ x: limitPoint });
        denValue = denExpr.evaluate({ x: limitPoint });
      }
      
      steps.push(`f'(${limitPoint}) = ${formatResult(numValue)}`);
      steps.push(`g'(${limitPoint}) = ${formatResult(denValue)}`);
      
      // Verifica se ainda é forma indeterminada
      if (Math.abs(numValue) < 1e-10 && Math.abs(denValue) < 1e-10) {
        steps.push('Ainda forma 0/0, continuando L\'Hôpital');
        currentNum = numDerivative;
        currentDen = denDerivative;
        continue;
      } else if (Math.abs(numValue) > 1e10 && Math.abs(denValue) > 1e10) {
        steps.push('Ainda forma ∞/∞, continuando L\'Hôpital');
        currentNum = numDerivative;
        currentDen = denDerivative;
        continue;
      } else {
        // Não é mais forma indeterminada
        const result = denValue !== 0 ? numValue / denValue : 'Indeterminado';
        steps.push(`Resultado: ${formatResult(result)}`);
        
        return {
          result: result,
          steps,
          iterations: i + 1,
          success: true
        };
      }
      
    } catch (error) {
      steps.push(`Erro na iteração ${i + 1}: ${error.message}`);
      
      return {
        result: 'Erro',
        steps,
        iterations: i + 1,
        success: false,
        error: error.message
      };
    }
  }
  
  steps.push(`Máximo de ${maxIterations} iterações atingido`);
  
  return {
    result: 'Máximo de iterações atingido',
    steps,
    iterations: maxIterations,
    success: false
  };
};

/**
 * Trata indeterminadas exponenciais usando transformação
 * @param {string} expr - Expressão exponencial
 * @param {number|string} limitPoint - Ponto limite
 * @returns {Object} {result, steps, success}
 */
export const handleExponentialIndeterminates = (expr, limitPoint) => {
  const steps = [];
  
  try {
    // Verifica se é forma 1^∞
    if (expr.includes('**') && Math.abs(limitPoint) === Infinity) {
      const parts = expr.split('**');
      if (parts.length === 2) {
        const base = parts[0].trim();
        const exponent = parts[1].trim();
        
        steps.push('Detectada forma indeterminada 1^∞');
        steps.push(`Base: ${base}, Expoente: ${exponent}`);
        steps.push('Aplicando transformação: lim f(x)^g(x) = e^(lim g(x) * ln(f(x)))');
        
        // Cria expressão: g(x) * ln(f(x))
        const transformedExpr = `${exponent} * log(${base})`;
        steps.push(`Expressão transformada: ${transformedExpr}`);
        
        // Calcula o limite da expressão transformada
        const transformedLimit = calculateTransformedLimit(transformedExpr, limitPoint);
        steps.push(...transformedLimit.steps);
        
        if (transformedLimit.success) {
          const result = Math.exp(transformedLimit.result);
          steps.push(`Resultado: e^${transformedLimit.result} = ${formatResult(result)}`);
          
          return {
            result: result,
            steps,
            success: true,
            type: '1_to_infinity'
          };
        }
      }
    }
    
    // Verifica se é forma 0^0
    if (expr.includes('**') && limitPoint === 0) {
      const parts = expr.split('**');
      if (parts.length === 2) {
        const base = parts[0].trim();
        const exponent = parts[1].trim();
        
        steps.push('Detectada forma indeterminada 0^0');
        steps.push(`Base: ${base}, Expoente: ${exponent}`);
        steps.push('Aplicando transformação: lim f(x)^g(x) = e^(lim g(x) * ln(f(x)))');
        
        const transformedExpr = `${exponent} * log(${base})`;
        steps.push(`Expressão transformada: ${transformedExpr}`);
        
        const transformedLimit = calculateTransformedLimit(transformedExpr, limitPoint);
        steps.push(...transformedLimit.steps);
        
        if (transformedLimit.success) {
          const result = Math.exp(transformedLimit.result);
          steps.push(`Resultado: e^${transformedLimit.result} = ${formatResult(result)}`);
          
          return {
            result: result,
            steps,
            success: true,
            type: '0_to_0'
          };
        }
      }
    }
    
    // Verifica se é forma ∞^0
    if (expr.includes('**') && Math.abs(limitPoint) === Infinity) {
      const parts = expr.split('**');
      if (parts.length === 2) {
        const base = parts[0].trim();
        const exponent = parts[1].trim();
        
        // Verifica se base tende a ∞ e expoente tende a 0
        const baseExpr = math.compile(base);
        const expExpr = math.compile(exponent);
        
        const largeValue = limitPoint > 0 ? 1e10 : -1e10;
        const baseValue = baseExpr.evaluate({ x: largeValue });
        const expValue = expExpr.evaluate({ x: largeValue });
        
        if (Math.abs(baseValue) > 1e10 && Math.abs(expValue) < 1e-10) {
          steps.push('Detectada forma indeterminada ∞^0');
          steps.push(`Base: ${base}, Expoente: ${exponent}`);
          steps.push('Aplicando transformação: lim f(x)^g(x) = e^(lim g(x) * ln(f(x)))');
          
          const transformedExpr = `${exponent} * log(${base})`;
          steps.push(`Expressão transformada: ${transformedExpr}`);
          
          const transformedLimit = calculateTransformedLimit(transformedExpr, limitPoint);
          steps.push(...transformedLimit.steps);
          
          if (transformedLimit.success) {
            const result = Math.exp(transformedLimit.result);
            steps.push(`Resultado: e^${transformedLimit.result} = ${formatResult(result)}`);
            
            return {
              result: result,
              steps,
              success: true,
              type: 'infinity_to_0'
            };
          }
        }
      }
    }
    
    steps.push('Nenhuma forma exponencial indeterminada detectada');
    
    return {
      result: 'N/A',
      steps,
      success: false
    };
    
  } catch (error) {
    steps.push(`Erro no tratamento de indeterminadas exponenciais: ${error.message}`);
    
    return {
      result: 'Erro',
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Calcula limite de expressão transformada
 * @param {string} expr - Expressão transformada
 * @param {number|string} limitPoint - Ponto limite
 * @returns {Object} {result, steps, success}
 */
const calculateTransformedLimit = (expr, limitPoint) => {
  const steps = [];
  
  try {
    const exprCompiled = math.compile(expr);
    
    if (Math.abs(limitPoint) === Infinity) {
      const largeValue = limitPoint > 0 ? 1e10 : -1e10;
      const result = exprCompiled.evaluate({ x: largeValue });
      steps.push(`Avaliando em x = ${largeValue}: ${formatResult(result)}`);
      
      return {
        result: result,
        steps,
        success: true
      };
    } else {
      const result = exprCompiled.evaluate({ x: limitPoint });
      steps.push(`Avaliando em x = ${limitPoint}: ${formatResult(result)}`);
      
      return {
        result: result,
        steps,
        success: true
      };
    }
    
  } catch (error) {
    steps.push(`Erro no cálculo: ${error.message}`);
    
    return {
      result: 0,
      steps,
      success: false,
      error: error.message
    };
  }
};

/**
 * Gera mensagem de erro clara baseada no tipo de falha
 * @param {string} errorType - Tipo do erro
 * @param {string} expression - Expressão original
 * @param {string} limitPoint - Ponto limite
 * @param {Object} details - Detalhes adicionais do erro
 * @returns {string} Mensagem de erro clara
 */
export const generateClearErrorMessage = (errorType, expression, limitPoint, details = {}) => {
  const messages = {
    'syntax_error': {
      title: 'Erro de Sintaxe',
      message: 'A expressão matemática contém erros de sintaxe.',
      suggestions: [
        'Verifique se todos os parênteses estão balanceados',
        'Use ** em vez de ^ para potências',
        'Use . em vez de , para decimais',
        'Use sin, cos, tan em vez de sen, cos, tg',
        'Use log em vez de ln para logaritmo natural'
      ]
    },
    'convergence_failure': {
      title: 'Falha na Convergência',
      message: 'Não foi possível determinar o limite com segurança usando métodos numéricos.',
      suggestions: [
        'Tente reescrever a expressão de forma mais simples',
        'Verifique se a função é contínua no ponto',
        'Considere usar limites laterais se aplicável',
        'Use identidades matemáticas para simplificar'
      ]
    },
    'indeterminate_form': {
      title: 'Forma Indeterminada',
      message: 'A expressão resulta em uma forma indeterminada que requer técnicas especiais.',
      suggestions: [
        'Para 0/0: tente fatorar e cancelar termos comuns',
        'Para ∞/∞: divida pelo termo de maior grau',
        'Para ∞-∞: racionalize ou reescreva como fração',
        'Para 1^∞: use transformação exponencial',
        'Considere usar a regra de L\'Hôpital'
      ]
    },
    'lateral_limits_different': {
      title: 'Limite Não Existe',
      message: 'Os limites laterais são diferentes, portanto o limite não existe.',
      suggestions: [
        'Verifique se a função tem descontinuidade no ponto',
        'Considere calcular apenas um limite lateral',
        'Analise o comportamento da função graficamente'
      ]
    },
    'mathematical_error': {
      title: 'Erro Matemático',
      message: 'Ocorreu um erro durante o cálculo matemático.',
      suggestions: [
        'Verifique se a expressão está bem definida',
        'Evite divisão por zero',
        'Verifique o domínio da função',
        'Use valores válidos para as variáveis'
      ]
    },
    'timeout': {
      title: 'Tempo Esgotado',
      message: 'O cálculo demorou muito para ser concluído.',
      suggestions: [
        'Simplifique a expressão antes de calcular',
        'Use uma aproximação numérica',
        'Verifique se a expressão não é muito complexa'
      ]
    }
  };

  const errorInfo = messages[errorType] || messages['mathematical_error'];
  
  let fullMessage = `❌ ${errorInfo.title}\n\n`;
  fullMessage += `${errorInfo.message}\n\n`;
  
  if (expression) {
    fullMessage += `Expressão: ${expression}\n`;
  }
  
  if (limitPoint !== undefined) {
    fullMessage += `Ponto limite: ${limitPoint}\n\n`;
  }
  
  if (details.leftLimit !== undefined && details.rightLimit !== undefined) {
    fullMessage += `Limite à esquerda: ${formatResult(details.leftLimit)}\n`;
    fullMessage += `Limite à direita: ${formatResult(details.rightLimit)}\n\n`;
  }
  
  fullMessage += '💡 Sugestões:\n';
  errorInfo.suggestions.forEach((suggestion, index) => {
    fullMessage += `${index + 1}. ${suggestion}\n`;
  });
  
  if (details.originalError) {
    fullMessage += `\n🔍 Detalhes técnicos: ${details.originalError}`;
  }
  
  return fullMessage;
};

/**
 * Valida e fornece feedback sobre expressões problemáticas
 * @param {string} expression - Expressão a ser validada
 * @returns {Object} {valid, warnings, suggestions}
 */
export const validateExpressionWithFeedback = (expression) => {
  const warnings = [];
  const suggestions = [];
  
  // Verifica erros comuns
  if (expression.includes('^') && !expression.includes('**')) {
    warnings.push('Use "**" em vez de "^" para potências');
    suggestions.push('Substitua x^2 por x**2');
  }
  
  if (expression.includes(',')) {
    warnings.push('Use "." em vez de "," para decimais');
    suggestions.push('Substitua 3,14 por 3.14');
  }
  
  if (expression.includes('sen(')) {
    warnings.push('Use "sin(" em vez de "sen(" para seno');
    suggestions.push('Substitua sen(x) por sin(x)');
  }
  
  if (expression.includes('tg(')) {
    warnings.push('Use "tan(" em vez de "tg(" para tangente');
    suggestions.push('Substitua tg(x) por tan(x)');
  }
  
  if (expression.includes('ln(')) {
    warnings.push('Use "log(" em vez de "ln(" para logaritmo natural');
    suggestions.push('Substitua ln(x) por log(x)');
  }
  
  // Verifica parênteses balanceados
  const openParens = (expression.match(/\(/g) || []).length;
  const closeParens = (expression.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    warnings.push('Parênteses não balanceados');
    suggestions.push('Verifique se cada ( tem seu ) correspondente');
  }
  
  // Verifica divisão por zero potencial
  if (expression.includes('/0') || expression.includes('/x')) {
    warnings.push('Possível divisão por zero');
    suggestions.push('Verifique se o denominador pode ser zero no ponto limite');
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    suggestions,
    expression
  };
};

/**
 * Retorna ajuda de sintaxe
 * @returns {string} Texto de ajuda
 */
export const getSyntaxHelp = () => {
  return `
SINTAXE DE ENTRADA

Operadores:
• Adição: +
• Subtração: -
• Multiplicação: *
• Divisão: /
• Potência: ** (ou ^)
• Parênteses: ( )

Funções:
• Seno: sin(x)
• Cosseno: cos(x)
• Tangente: tan(x)
• Logaritmo natural: log(x)
• Exponencial: exp(x)
• Raiz quadrada: sqrt(x)
• Valor absoluto: abs(x)

Constantes:
• π (pi): pi
• e (Euler): E
• Infinito: oo
• Menos infinito: -oo

Exemplos de entrada:
• sin(x)/x
• (x^2-1)/(x-1)
• (sqrt(x+1)-1)/x
• (1+1/x)^x
• (2*x^3+5)/(x^3-7)
• (1-cos(x))/x

Dicas:
• Use parênteses para agrupar operações
• A vírgula decimal será convertida para ponto automaticamente
• O sistema aceita tanto ^ quanto ** para potências
• Use oo para infinito (não infinity)
• Funções trigonométricas devem usar sin, cos, tan (não sen, cos, tg)

Formas Indeterminadas Detectadas:
• 0/0: Fatorar e cancelar
• ∞/∞: Dividir pelos maiores graus
• ∞-∞: Fatorar ou racionalizar
• 1^∞: Usar identidade exponencial
• 0·∞: Reescrever como quociente
• 0^0, ∞^0: Usar logaritmo natural
  `;
};
