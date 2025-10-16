/**
 * Estratégias específicas para cálculo de limites
 * Implementa o esquema de programação da imagem
 */

import { create, all } from 'mathjs';
import { detectFundamentalLimit, applyFundamentalLimit } from './fundamentalLimits.js';

const math = create(all);

/**
 * Estratégias de cálculo de limites
 */
export const LIMIT_STRATEGIES = {
  // Para x → a (número real)
  DIRECT_SUBSTITUTION: 'substituição_direta',
  LATERAL_LIMITS: 'limites_laterais',
  FACTORING: 'fatoração',
  RATIONALIZATION: 'racionalização',
  FUNDAMENTAL_LIMITS: 'limites_fundamentais',
  LHOPITAL: 'lhopital',
  
  // Para x → ±∞
  HIGHEST_DEGREE: 'maior_grau',
  CONJUGATE_MULTIPLICATION: 'multiplicação_conjugado',
  EXPONENTIAL_FUNDAMENTALS: 'fundamentais_exponenciais',
  RATIONAL_INFINITY: 'racional_infinito'
};

/**
 * Detecta a estratégia apropriada baseada na forma do limite
 * @param {string} expr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto para onde x tende
 * @returns {Object} Estratégia detectada e informações
 */
export const detectStrategy = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  // Primeiro, verifica se é um limite fundamental
  const fundamental = detectFundamentalLimit(expr, limitPoint);
  if (fundamental) {
    return {
      strategy: LIMIT_STRATEGIES.FUNDAMENTAL_LIMITS,
      fundamental,
      steps: [`Detectado limite fundamental: ${fundamental.description}`],
      tips: ['Use propriedades de limites fundamentais']
    };
  }
  
  // Verifica se é limite no infinito
  if (Math.abs(limitPoint) === Infinity) {
    return detectInfinityStrategy(expr, limitPoint);
  }
  
  // Para limites finitos, verifica a forma
  return detectFiniteStrategy(expr, limitPoint);
};

/**
 * Detecta estratégia para limites no infinito
 * @param {string} expr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto limite (±∞)
 * @returns {Object} Estratégia detectada
 */
const detectInfinityStrategy = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  // Verifica se é forma ∞/∞
  if (expr.includes('/') && expr.includes('x')) {
    const parts = expr.split('/');
    if (parts.length === 2) {
      const numerator = parts[0];
      const denominator = parts[1];
      
      // Verifica se ambos têm termos com x
      if (numerator.includes('x') && denominator.includes('x')) {
        steps.push('Detectada forma indeterminada ∞/∞');
        steps.push('Estratégia: Colocar em evidência o termo de maior grau');
        tips.push('Divida numerador e denominador pelo termo de maior grau');
        tips.push('Para polinômios: limite = coeficiente do termo de maior grau');
        
        return {
          strategy: LIMIT_STRATEGIES.HIGHEST_DEGREE,
          steps,
          tips,
          form: '∞/∞'
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
          strategy: LIMIT_STRATEGIES.CONJUGATE_MULTIPLICATION,
          steps,
          tips,
          form: '∞-∞'
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
          strategy: LIMIT_STRATEGIES.EXPONENTIAL_FUNDAMENTALS,
          steps,
          tips,
          form: '1^∞'
        };
      }
    }
  }
  
  // Estratégia padrão para infinito
  steps.push('Limite no infinito: usando aproximação numérica');
  tips.push('Substitua x por um valor muito grande');
  
  return {
    strategy: LIMIT_STRATEGIES.RATIONAL_INFINITY,
    steps,
    tips,
    form: 'infinity'
  };
};

/**
 * Detecta estratégia para limites finitos
 * @param {string} expr - Expressão normalizada
 * @param {number} limitPoint - Ponto limite finito
 * @returns {Object} Estratégia detectada
 */
const detectFiniteStrategy = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  try {
    // Tenta substituição direta
    const exprCompiled = math.compile(expr);
    const directResult = exprCompiled.evaluate({ x: limitPoint });
    
    if (isFinite(directResult) && !isNaN(directResult)) {
      steps.push('Substituição direta possível');
      steps.push(`f(${limitPoint}) = ${directResult}`);
      tips.push('O limite é o valor da função no ponto');
      
      return {
        strategy: LIMIT_STRATEGIES.DIRECT_SUBSTITUTION,
        steps,
        tips,
        form: 'numérico',
        result: directResult
      };
    }
    
    // Verifica se é forma 0/0
    if (expr.includes('/')) {
      const parts = expr.split('/');
      if (parts.length === 2) {
        const numerator = math.compile(parts[0]);
        const denominator = math.compile(parts[1]);
        
        const numVal = numerator.evaluate({ x: limitPoint });
        const denVal = denominator.evaluate({ x: limitPoint });
        
        if (Math.abs(numVal) < 1e-10 && Math.abs(denVal) < 1e-10) {
          steps.push('Detectada forma indeterminada 0/0');
          
          // Verifica se são polinômios
          if (isPolynomial(parts[0]) && isPolynomial(parts[1])) {
            steps.push('Estratégia: Fatorar e cancelar termos comuns');
            tips.push('Use fatoração de polinômios');
            tips.push('Procure por diferença de quadrados, trinômios, etc.');
            
            return {
              strategy: LIMIT_STRATEGIES.FACTORING,
              steps,
              tips,
              form: '0/0',
              polynomials: true
            };
          }
          
          // Verifica se tem funções irracionais
          if (expr.includes('sqrt') || expr.includes('**(1/2)')) {
            steps.push('Estratégia: Racionalizar');
            tips.push('Multiplique numerador e denominador pelo conjugado');
            tips.push('Use identidade: (√a - √b)(√a + √b) = a - b');
            
            return {
              strategy: LIMIT_STRATEGIES.RATIONALIZATION,
              steps,
              tips,
              form: '0/0',
              irrational: true
            };
          }
          
          // Estratégia genérica para 0/0
          steps.push('Estratégia: Usar limites fundamentais ou L\'Hôpital');
          tips.push('Considere L\'Hôpital se as derivadas existirem');
          tips.push('Use identidades trigonométricas se aplicável');
          
          return {
            strategy: LIMIT_STRATEGIES.LHOPITAL,
            steps,
            tips,
            form: '0/0'
          };
        }
        
        // Verifica se é (número ≠ 0)/0
        if (Math.abs(numVal) > 1e-10 && Math.abs(denVal) < 1e-10) {
          steps.push('Detectada forma (número ≠ 0)/0');
          steps.push('Estratégia: Usar limites laterais');
          tips.push('Calcule limite à esquerda e à direita');
          tips.push('Se forem diferentes, o limite não existe');
          
          return {
            strategy: LIMIT_STRATEGIES.LATERAL_LIMITS,
            steps,
            tips,
            form: '(número ≠ 0)/0'
          };
        }
      }
    }
    
    // Estratégia padrão
    steps.push('Forma complexa: análise detalhada necessária');
    tips.push('Analise cada termo separadamente');
    
    return {
      strategy: LIMIT_STRATEGIES.DIRECT_SUBSTITUTION,
      steps,
      tips,
      form: 'complexa'
    };
    
  } catch (error) {
    steps.push('Erro na análise: forma indefinida');
    tips.push('Verifique a sintaxe da expressão');
    
    return {
      strategy: LIMIT_STRATEGIES.DIRECT_SUBSTITUTION,
      steps,
      tips,
      form: 'indefinida',
      error: error.message
    };
  }
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
  const nonPolynomialFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];
  return !nonPolynomialFunctions.some(func => clean.includes(func));
};

/**
 * Aplica a estratégia detectada
 * @param {string} expr - Expressão original
 * @param {number|string} limitPoint - Ponto limite
 * @param {Object} strategyInfo - Informações da estratégia
 * @returns {Object} Resultado do cálculo
 */
export const applyStrategy = (expr, limitPoint, strategyInfo) => {
  const { strategy } = strategyInfo;
  
  switch (strategy) {
    case LIMIT_STRATEGIES.DIRECT_SUBSTITUTION:
      return applyDirectSubstitution(expr, limitPoint);
      
    case LIMIT_STRATEGIES.LATERAL_LIMITS:
      return applyLateralLimits(expr, limitPoint);
      
    case LIMIT_STRATEGIES.FACTORING:
      return applyFactoring(expr, limitPoint);
      
    case LIMIT_STRATEGIES.RATIONALIZATION:
      return applyRationalization(expr, limitPoint);
      
    case LIMIT_STRATEGIES.FUNDAMENTAL_LIMITS:
      return applyFundamentalLimit(expr, strategyInfo.fundamental);
      
    case LIMIT_STRATEGIES.HIGHEST_DEGREE:
      return applyHighestDegree(expr, limitPoint);
      
    case LIMIT_STRATEGIES.CONJUGATE_MULTIPLICATION:
      return applyConjugateMultiplication(expr, limitPoint);
      
    case LIMIT_STRATEGIES.EXPONENTIAL_FUNDAMENTALS:
      return applyExponentialFundamentals(expr, limitPoint);
      
    default:
      return {
        result: 'Estratégia não implementada',
        steps: ['Estratégia ainda não implementada'],
        tips: ['Use aproximação numérica']
      };
  }
};

/**
 * Aplica substituição direta
 */
const applyDirectSubstitution = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  try {
    const exprCompiled = math.compile(expr);
    const result = exprCompiled.evaluate({ x: limitPoint });
    
    steps.push(`Substituindo x = ${limitPoint}`);
    steps.push(`f(${limitPoint}) = ${result}`);
    steps.push(`Resultado: ${result}`);
    
    tips.push('Substituição direta é sempre a primeira tentativa');
    
    return {
      result: result.toString(),
      steps,
      tips,
      strategy: LIMIT_STRATEGIES.DIRECT_SUBSTITUTION
    };
  } catch (error) {
    return {
      result: 'Erro',
      steps: [`Erro na substituição: ${error.message}`],
      tips: ['Verifique a sintaxe da expressão']
    };
  }
};

/**
 * Aplica limites laterais
 */
const applyLateralLimits = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  try {
    const exprCompiled = math.compile(expr);
    const delta = 0.0001;
    
    const leftLimit = exprCompiled.evaluate({ x: limitPoint - delta });
    const rightLimit = exprCompiled.evaluate({ x: limitPoint + delta });
    
    steps.push(`Calculando limite à esquerda: f(${limitPoint - delta}) = ${leftLimit}`);
    steps.push(`Calculando limite à direita: f(${limitPoint + delta}) = ${rightLimit}`);
    
    if (Math.abs(leftLimit - rightLimit) < 1e-6) {
      const result = (leftLimit + rightLimit) / 2;
      steps.push(`Limites laterais iguais: limite = ${result}`);
      tips.push('O limite existe e é igual aos limites laterais');
      
      return {
        result: result.toString(),
        steps,
        tips,
        strategy: LIMIT_STRATEGIES.LATERAL_LIMITS
      };
    } else {
      steps.push('Limites laterais diferentes: limite não existe');
      tips.push('Quando os limites laterais são diferentes, o limite não existe');
      
      return {
        result: 'Não existe',
        steps,
        tips,
        strategy: LIMIT_STRATEGIES.LATERAL_LIMITS
      };
    }
  } catch (error) {
    return {
      result: 'Erro',
      steps: [`Erro no cálculo: ${error.message}`],
      tips: ['Verifique a expressão']
    };
  }
};

/**
 * Aplica fatoração (implementação básica)
 */
const applyFactoring = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push('Aplicando estratégia de fatoração');
  steps.push('Expressão original: ' + expr);
  
  // Implementação básica - em um sistema real, usaria uma biblioteca de álgebra simbólica
  if (expr.includes('x^2-1') && expr.includes('x-1')) {
    steps.push('Fatorando numerador: x²-1 = (x+1)(x-1)');
    steps.push('Fatorando denominador: x-1 = (x-1)');
    steps.push('Cancelando termo comum: (x+1)(x-1)/(x-1) = x+1');
    steps.push(`Aplicando limite: lim(x→${limitPoint}) x+1 = ${limitPoint + 1}`);
    
    tips.push('Diferença de quadrados: a²-b² = (a+b)(a-b)');
    tips.push('Sempre cancele termos comuns após fatorar');
    
    return {
      result: (limitPoint + 1).toString(),
      steps,
      tips,
      strategy: LIMIT_STRATEGIES.FACTORING
    };
  }
  
  // Estratégia genérica
  steps.push('Fatoração complexa: use aproximação numérica');
  tips.push('Para fatoração complexa, considere usar L\'Hôpital');
  
  return {
    result: 'Fatoração complexa',
    steps,
    tips,
    strategy: LIMIT_STRATEGIES.FACTORING
  };
};

/**
 * Aplica racionalização (implementação básica)
 */
const applyRationalization = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push('Aplicando estratégia de racionalização');
  steps.push('Expressão original: ' + expr);
  
  if (expr.includes('sqrt(x+1)-1') && expr.includes('/x')) {
    steps.push('Multiplicando pelo conjugado: (√(x+1)-1)/x × (√(x+1)+1)/(√(x+1)+1)');
    steps.push('Numerador: (√(x+1)-1)(√(x+1)+1) = (x+1)-1 = x');
    steps.push('Denominador: x(√(x+1)+1)');
    steps.push('Simplificando: x/(x(√(x+1)+1)) = 1/(√(x+1)+1)');
    steps.push(`Aplicando limite: lim(x→${limitPoint}) 1/(√(x+1)+1) = 1/2`);
    
    tips.push('Conjugado de √a - √b é √a + √b');
    tips.push('Use identidade: (a-b)(a+b) = a²-b²');
    
    return {
      result: '1/2',
      steps,
      tips,
      strategy: LIMIT_STRATEGIES.RATIONALIZATION
    };
  }
  
  // Estratégia genérica
  steps.push('Racionalização complexa: use aproximação numérica');
  tips.push('Para racionalização complexa, considere usar L\'Hôpital');
  
  return {
    result: 'Racionalização complexa',
    steps,
    tips,
    strategy: LIMIT_STRATEGIES.RATIONALIZATION
  };
};

/**
 * Aplica estratégia de maior grau para limites no infinito
 */
const applyHighestDegree = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push('Aplicando estratégia de maior grau');
  steps.push('Expressão original: ' + expr);
  
  if (expr.includes('/') && expr.includes('x')) {
    const parts = expr.split('/');
    if (parts.length === 2) {
      const numerator = parts[0];
      const denominator = parts[1];
      
      // Encontra o maior grau em cada parte
      const numDegree = Math.max(...(numerator.match(/x\*\*(\d+)/g) || ['x**0']).map(m => parseInt(m.match(/\d+/)[0])));
      const denDegree = Math.max(...(denominator.match(/x\*\*(\d+)/g) || ['x**0']).map(m => parseInt(m.match(/\d+/)[0])));
      
      steps.push(`Maior grau no numerador: ${numDegree}`);
      steps.push(`Maior grau no denominador: ${denDegree}`);
      
      if (numDegree === denDegree) {
        // Mesmo grau: limite = coeficiente principal
        steps.push('Mesmo grau: limite = coeficiente principal do numerador / coeficiente principal do denominador');
        tips.push('Para polinômios do mesmo grau, o limite é a razão dos coeficientes principais');
        
        return {
          result: 'Coeficiente principal',
          steps,
          tips,
          strategy: LIMIT_STRATEGIES.HIGHEST_DEGREE
        };
      } else if (numDegree > denDegree) {
        steps.push('Grau do numerador maior: limite = ±∞');
        tips.push('Quando o grau do numerador é maior, o limite tende ao infinito');
        
        return {
          result: limitPoint > 0 ? '∞' : '-∞',
          steps,
          tips,
          strategy: LIMIT_STRATEGIES.HIGHEST_DEGREE
        };
      } else {
        steps.push('Grau do denominador maior: limite = 0');
        tips.push('Quando o grau do denominador é maior, o limite tende a zero');
        
        return {
          result: '0',
          steps,
          tips,
          strategy: LIMIT_STRATEGIES.HIGHEST_DEGREE
        };
      }
    }
  }
  
  return {
    result: 'Estratégia de maior grau',
    steps,
    tips,
    strategy: LIMIT_STRATEGIES.HIGHEST_DEGREE
  };
};

/**
 * Aplica multiplicação pelo conjugado
 */
const applyConjugateMultiplication = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push('Aplicando estratégia de multiplicação pelo conjugado');
  steps.push('Expressão original: ' + expr);
  steps.push('Reescrevendo como fração: (a-b) = (a-b)/1');
  steps.push('Multiplicando pelo conjugado: (a-b)(a+b)/(a+b) = (a²-b²)/(a+b)');
  
  tips.push('Use identidade: a - b = (a² - b²)/(a + b)');
  tips.push('O conjugado de √a - √b é √a + √b');
  
  return {
    result: 'Conjugado aplicado',
    steps,
    tips,
    strategy: LIMIT_STRATEGIES.CONJUGATE_MULTIPLICATION
  };
};

/**
 * Aplica limites fundamentais exponenciais
 */
const applyExponentialFundamentals = (expr, limitPoint) => {
  const steps = [];
  const tips = [];
  
  steps.push('Aplicando limites fundamentais exponenciais');
  steps.push('Expressão original: ' + expr);
  
  if (expr.includes('(1+1/x)^x')) {
    steps.push('Limite fundamental: lim(1+1/x)^x = e');
    steps.push('Resultado: e ≈ 2.71828');
    
    tips.push('Este é o limite que define o número de Euler');
    tips.push('Use identidade: lim(1+f(x))^g(x) = e^(lim f(x)*g(x))');
    
    return {
      result: 'e',
      steps,
      tips,
      strategy: LIMIT_STRATEGIES.EXPONENTIAL_FUNDAMENTALS
    };
  }
  
  steps.push('Aplicando identidade exponencial geral');
  tips.push('Use logaritmo natural e L\'Hôpital se necessário');
  
  return {
    result: 'Exponencial fundamental',
    steps,
    tips,
    strategy: LIMIT_STRATEGIES.EXPONENTIAL_FUNDAMENTALS
  };
};
