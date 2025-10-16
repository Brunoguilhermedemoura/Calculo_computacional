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
    
  } catch (error) {
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
            } catch (e) {
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
      
    } catch (calcError) {
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
