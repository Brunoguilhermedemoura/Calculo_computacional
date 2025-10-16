/**
 * Sistema avançado de detecção de formas indeterminadas
 * Implementa o esquema completo da imagem
 */

import { math } from './mathConfig.js';

/**
 * Tipos de formas indeterminadas
 */
export const INDETERMINATE_FORMS = {
  // Formas básicas
  ZERO_OVER_ZERO: '0/0',
  INFINITY_OVER_INFINITY: '∞/∞',
  INFINITY_MINUS_INFINITY: '∞-∞',
  ZERO_TIMES_INFINITY: '0·∞',
  
  // Formas exponenciais
  ONE_TO_INFINITY: '1^∞',
  ZERO_TO_ZERO: '0^0',
  INFINITY_TO_ZERO: '∞^0',
  
  // Formas especiais
  NON_ZERO_OVER_ZERO: '(número ≠ 0)/0',
  NUMERICAL: 'numérico',
  INFINITY: 'infinito',
  UNDEFINED: 'indefinida'
};

/**
 * Detecta a forma do limite baseada no esquema da imagem
 * @param {string} expr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto para onde x tende
 * @returns {Object} Informações da forma detectada
 */
export const detectLimitForm = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  try {
    // Verifica se é limite no infinito
    if (Math.abs(limitPoint) === Infinity) {
      return detectInfinityForm(expr, limitPoint);
    }
    
    // Para limites finitos, verifica substituição direta
    return detectFiniteForm(expr, limitPoint);
    
  } catch (error) {
    return {
      form: INDETERMINATE_FORMS.UNDEFINED,
      steps: [`Erro na detecção: ${error.message}`],
      tips: ['Verifique a sintaxe da expressão'],
      error: error.message
    };
  }
};

/**
 * Detecta forma para limites no infinito
 * @param {string} expr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto limite (±∞)
 * @returns {Object} Informações da forma
 */
const detectInfinityForm = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push(`Analisando limite quando x → ${limitPoint > 0 ? '∞' : '-∞'}`);
  
  // Verifica se é forma ∞/∞
  if (expr.includes('/') && expr.includes('x')) {
    const parts = expr.split('/');
    if (parts.length === 2) {
      const numerator = parts[0].trim();
      const denominator = parts[1].trim();
      
      if (numerator.includes('x') && denominator.includes('x')) {
        steps.push('Detectada forma indeterminada ∞/∞');
        steps.push('Estratégia: Colocar em evidência o termo de maior grau');
        tips.push('Divida numerador e denominador pelo termo de maior grau');
        tips.push('Para polinômios: limite = coeficiente do termo de maior grau');
        
        return {
          form: INDETERMINATE_FORMS.INFINITY_OVER_INFINITY,
          steps,
          tips,
          strategy: 'highest_degree',
          numerator,
          denominator
        };
      }
    }
  }
  
  // Verifica se é forma ∞-∞
  if (expr.includes('-') && expr.includes('x')) {
    const terms = expr.split('-');
    if (terms.length === 2) {
      const left = terms[0].trim();
      const right = terms[1].trim();
      
      if (left.includes('x') && right.includes('x')) {
        steps.push('Detectada forma indeterminada ∞-∞');
        steps.push('Estratégia: Multiplicar pelo conjugado');
        tips.push('Reescreva como uma fração');
        tips.push('Use identidade: a - b = (a² - b²)/(a + b)');
        
        return {
          form: INDETERMINATE_FORMS.INFINITY_MINUS_INFINITY,
          steps,
          tips,
          strategy: 'conjugate_multiplication',
          leftTerm: left,
          rightTerm: right
        };
      }
    }
  }
  
  // Verifica se é forma 1^∞
  if (expr.includes('**') && expr.includes('x')) {
    const parts = expr.split('**');
    if (parts.length === 2) {
      const base = parts[0].trim();
      const exponent = parts[1].trim();
      
      if (base.includes('x') && exponent.includes('x')) {
        steps.push('Detectada forma indeterminada 1^∞');
        steps.push('Estratégia: Usar limites fundamentais dos exponenciais');
        tips.push('Use identidade: lim(1+f(x))^g(x) = e^(lim f(x)*g(x))');
        tips.push('Ou aplique logaritmo natural e use L\'Hôpital');
        
        return {
          form: INDETERMINATE_FORMS.ONE_TO_INFINITY,
          steps,
          tips,
          strategy: 'exponential_fundamentals',
          base,
          exponent
        };
      }
    }
  }
  
  // Verifica se é forma ∞^0
  if (expr.includes('**') && expr.includes('x')) {
    const parts = expr.split('**');
    if (parts.length === 2) {
      const base = parts[0].trim();
      const exponent = parts[1].trim();
      
      if (base.includes('x') && exponent.includes('x')) {
        // Verifica se base tende a ∞ e expoente tende a 0
        steps.push('Detectada forma indeterminada ∞^0');
        steps.push('Estratégia: Usar limites fundamentais dos exponenciais');
        tips.push('Use logaritmo natural: lim f(x)^g(x) = e^(lim g(x)*ln(f(x)))');
        tips.push('Aplique L\'Hôpital se necessário');
        
        return {
          form: INDETERMINATE_FORMS.INFINITY_TO_ZERO,
          steps,
          tips,
          strategy: 'exponential_fundamentals',
          base,
          exponent
        };
      }
    }
  }
  
  // Forma padrão para infinito
  steps.push('Limite no infinito: usando aproximação numérica');
  tips.push('Substitua x por um valor muito grande');
  
  return {
    form: INDETERMINATE_FORMS.INFINITY,
    steps,
    tips,
    strategy: 'numerical_approximation'
  };
};

/**
 * Detecta forma para limites finitos
 * @param {string} expr - Expressão normalizada
 * @param {number} limitPoint - Ponto limite finito
 * @returns {Object} Informações da forma
 */
const detectFiniteForm = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push(`Analisando limite quando x → ${limitPoint}`);
  
  try {
    // Tenta substituição direta
    const exprCompiled = math.compile(expr);
    const directResult = exprCompiled.evaluate({ x: limitPoint });
    
    if (isFinite(directResult) && !isNaN(directResult)) {
      steps.push('Substituição direta possível');
      steps.push(`f(${limitPoint}) = ${directResult}`);
      tips.push('O limite é o valor da função no ponto');
      
      return {
        form: INDETERMINATE_FORMS.NUMERICAL,
        steps,
        tips,
        strategy: 'direct_substitution',
        result: directResult
      };
    }
    
    // Verifica se é forma (número ≠ 0)/0
    if (expr.includes('/')) {
      const parts = expr.split('/');
      if (parts.length === 2) {
        const numerator = math.compile(parts[0]);
        const denominator = math.compile(parts[1]);
        
        const numVal = numerator.evaluate({ x: limitPoint });
        const denVal = denominator.evaluate({ x: limitPoint });
        
        if (Math.abs(numVal) > 1e-10 && Math.abs(denVal) < 1e-10) {
          steps.push('Detectada forma (número ≠ 0)/0');
          steps.push('Estratégia: Usar limites laterais');
          tips.push('Calcule limite à esquerda e à direita');
          tips.push('Se forem diferentes, o limite não existe');
          
          return {
            form: INDETERMINATE_FORMS.NON_ZERO_OVER_ZERO,
            steps,
            tips,
            strategy: 'lateral_limits',
            numeratorValue: numVal,
            denominatorValue: denVal
          };
        }
        
        // Verifica se é forma 0/0
        if (Math.abs(numVal) < 1e-10 && Math.abs(denVal) < 1e-10) {
          steps.push('Detectada forma indeterminada 0/0');
          
          // Analisa o tipo de 0/0
          const analysis = analyzeZeroOverZero(expr, limitPoint);
          
          return {
            form: INDETERMINATE_FORMS.ZERO_OVER_ZERO,
            steps: [...steps, ...analysis.steps],
            tips: [...tips, ...analysis.tips],
            strategy: analysis.strategy,
            subType: analysis.subType,
            numeratorValue: numVal,
            denominatorValue: denVal
          };
        }
      }
    }
    
    // Verifica se é forma 0·∞
    if (expr.includes('*') && expr.includes('x')) {
      const terms = expr.split('*');
      if (terms.length === 2) {
        const left = math.compile(terms[0]);
        const right = math.compile(terms[1]);
        
        const leftVal = left.evaluate({ x: limitPoint });
        const rightVal = right.evaluate({ x: limitPoint });
        
        if (Math.abs(leftVal) < 1e-10 && Math.abs(rightVal) > 1e10) {
          steps.push('Detectada forma indeterminada 0·∞');
          steps.push('Estratégia: Reescrever como quociente 0/0 ou ∞/∞');
          tips.push('Use identidade: f(x)*g(x) = f(x)/(1/g(x))');
          tips.push('Ou: f(x)*g(x) = g(x)/(1/f(x))');
          
          return {
            form: INDETERMINATE_FORMS.ZERO_TIMES_INFINITY,
            steps,
            tips,
            strategy: 'rewrite_as_quotient',
            leftValue: leftVal,
            rightValue: rightVal
          };
        }
      }
    }
    
    // Verifica se é forma 0^0
    if (expr.includes('**') && expr.includes('x')) {
      const parts = expr.split('**');
      if (parts.length === 2) {
        const base = math.compile(parts[0]);
        const exponent = math.compile(parts[1]);
        
        const baseVal = base.evaluate({ x: limitPoint });
        const expVal = exponent.evaluate({ x: limitPoint });
        
        if (Math.abs(baseVal) < 1e-10 && Math.abs(expVal) < 1e-10) {
          steps.push('Detectada forma indeterminada 0^0');
          steps.push('Estratégia: Usar logaritmo natural e L\'Hôpital');
          tips.push('Use identidade: lim f(x)^g(x) = e^(lim g(x)*ln(f(x)))');
          tips.push('Aplique L\'Hôpital em g(x)*ln(f(x))');
          
          return {
            form: INDETERMINATE_FORMS.ZERO_TO_ZERO,
            steps,
            tips,
            strategy: 'logarithm_and_lhopital',
            baseValue: baseVal,
            exponentValue: expVal
          };
        }
      }
    }
    
    // Forma complexa
    steps.push('Forma complexa: análise detalhada necessária');
    tips.push('Analise cada termo separadamente');
    
    return {
      form: INDETERMINATE_FORMS.UNDEFINED,
      steps,
      tips,
      strategy: 'detailed_analysis'
    };
    
  } catch (error) {
    steps.push('Erro na análise: forma indefinida');
    tips.push('Verifique a sintaxe da expressão');
    
    return {
      form: INDETERMINATE_FORMS.UNDEFINED,
      steps,
      tips,
      strategy: 'error',
      error: error.message
    };
  }
};

/**
 * Analisa o tipo específico de forma 0/0
 * @param {string} expr - Expressão original
 * @param {number} limitPoint - Ponto limite
 * @returns {Object} Análise detalhada
 */
const analyzeZeroOverZero = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  // Verifica se são polinômios
  if (expr.includes('/')) {
    const parts = expr.split('/');
    if (parts.length === 2) {
      const numerator = parts[0].trim();
      const denominator = parts[1].trim();
      
      if (isPolynomial(numerator) && isPolynomial(denominator)) {
        steps.push('Identificados polinômios no numerador e denominador');
        steps.push('Estratégia: Fatorar e cancelar termos comuns');
        tips.push('Use fatoração de polinômios');
        tips.push('Procure por diferença de quadrados, trinômios, etc.');
        
        return {
          strategy: 'factoring',
          subType: 'polynomials',
          steps,
          tips
        };
      }
    }
  }
  
  // Verifica se tem funções irracionais
  if (expr.includes('sqrt') || expr.includes('**(1/2)')) {
    steps.push('Identificada função irracional');
    steps.push('Estratégia: Racionalizar');
    tips.push('Multiplique numerador e denominador pelo conjugado');
    tips.push('Use identidade: (√a - √b)(√a + √b) = a - b');
    
    return {
      strategy: 'rationalization',
      subType: 'irrational',
      steps,
      tips
    };
  }
  
  // Verifica se tem funções trigonométricas
  if (expr.includes('sin') || expr.includes('cos') || expr.includes('tan')) {
    steps.push('Identificadas funções trigonométricas');
    steps.push('Estratégia: Usar limites fundamentais trigonométricos');
    tips.push('Use identidades trigonométricas');
    tips.push('Considere L\'Hôpital se necessário');
    
    return {
      strategy: 'trigonometric_fundamentals',
      subType: 'trigonometric',
      steps,
      tips
    };
  }
  
  // Verifica se tem funções exponenciais
  if (expr.includes('exp') || expr.includes('log') || expr.includes('ln')) {
    steps.push('Identificadas funções exponenciais/logarítmicas');
    steps.push('Estratégia: Usar limites fundamentais exponenciais');
    tips.push('Use propriedades de logaritmos');
    tips.push('Considere L\'Hôpital se necessário');
    
    return {
      strategy: 'exponential_fundamentals',
      subType: 'exponential',
      steps,
      tips
    };
  }
  
  // Estratégia genérica
  steps.push('Forma 0/0 genérica');
  steps.push('Estratégia: Usar L\'Hôpital ou limites fundamentais');
  tips.push('Considere L\'Hôpital se as derivadas existirem');
  tips.push('Use identidades matemáticas apropriadas');
  
  return {
    strategy: 'lhopital_or_fundamentals',
    subType: 'generic',
    steps,
    tips
  };
};

/**
 * Verifica se uma expressão é um polinômio
 * @param {string} expr - Expressão a ser verificada
 * @returns {boolean} True se é polinômio
 */
const isPolynomial = (expr) => {
  // Remove espaços
  const clean = expr.replace(/\s/g, '');
  
  // Verifica se contém apenas operações polinomiais
  const polynomialPattern = /^[0-9+\-*/.()x\s\*\*]+$/;
  
  if (!polynomialPattern.test(clean)) return false;
  
  // Verifica se não contém funções não-polinomiais
  const nonPolynomialFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt', 'ln'];
  return !nonPolynomialFunctions.some(func => clean.includes(func));
};

/**
 * Gera dicas específicas baseadas na forma detectada
 * @param {string} form - Forma detectada
 * @param {Object} formInfo - Informações da forma
 * @returns {Array<string>} Lista de dicas específicas
 */
export const generateFormSpecificTips = (form, formInfo) => {
  const tips = [];
  
  switch (form) {
    case INDETERMINATE_FORMS.ZERO_OVER_ZERO:
      tips.push('Forma indeterminada 0/0: tente fatorar e cancelar termos comuns');
      if (formInfo.subType === 'polynomials') {
        tips.push('Para polinômios: use fatoração (diferença de quadrados, trinômios)');
      }
      if (formInfo.subType === 'irrational') {
        tips.push('Para funções irracionais: racionalize multiplicando pelo conjugado');
      }
      if (formInfo.subType === 'trigonometric') {
        tips.push('Para funções trigonométricas: use limites fundamentais');
      }
      if (formInfo.subType === 'exponential') {
        tips.push('Para funções exponenciais: use propriedades de logaritmos');
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
      
    case INDETERMINATE_FORMS.NON_ZERO_OVER_ZERO:
      tips.push('Forma (número ≠ 0)/0: use limites laterais');
      tips.push('Se os limites laterais forem diferentes, o limite não existe');
      break;
      
    case INDETERMINATE_FORMS.NUMERICAL:
      tips.push('Substituição direta: o limite é o valor da função no ponto');
      break;
      
    case INDETERMINATE_FORMS.INFINITY:
      tips.push('O limite tende ao infinito: verifique o comportamento assintótico');
      break;
      
    default:
      tips.push('Forma complexa: analise cada termo separadamente');
      if (formInfo && formInfo.error) {
        tips.push('Verifique a sintaxe da expressão');
      }
  }
  
  return tips;
};
