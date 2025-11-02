/**
 * Versão simplificada do motor de cálculo de limites
 * Para debug e teste básico
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, parseLimitPoint, formatResult } from './mathParser.js';
import { detectFundamentalLimit, applyFundamentalLimit } from './fundamentalLimits.js';
import { applyLHospitalRule } from './lhopitalEngine.js';

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
    
    // VERIFICA SE É LIMITE NO INFINITO
    if (Math.abs(point) === Infinity) {
      steps.push('🔍 Limite no infinito detectado');
      
      // PRIMEIRO: Verifica se é um limite fundamental (ex: (1+1/x)^x → e)
      const fundamental = detectFundamentalLimit(normalizedExpr, point);
      if (fundamental) {
        steps.push(`✨ Limite fundamental detectado: ${fundamental.description}`);
        const fundamentalResult = applyFundamentalLimit(normalizedExpr, fundamental);
        
        // Converte resultado 'e' para Math.E se necessário
        let resultValue = fundamentalResult.result;
        if (resultValue === 'e') {
          resultValue = Math.E;
        }
        
        return {
          result: formatResult(resultValue),
          steps: [...steps, ...fundamentalResult.steps],
          tips: [...tips, ...fundamentalResult.tips],
          strategy: fundamentalResult.strategy,
          form: fundamental.when === 'x → ∞' ? '1^∞' : 'numérico'
        };
      }
      
      // Para funções racionais no infinito, aplica regra do maior grau
      if (normalizedExpr.includes('/') && (normalizedExpr.includes('pow(x') || normalizedExpr.includes('x**') || normalizedExpr.includes('x^'))) {
        steps.push('📊 Aplicando estratégia de maior grau para função racional');
        
        try {
          const parts = normalizedExpr.split('/');
          if (parts.length === 2) {
            const numerator = parts[0].trim();
            const denominator = parts[1].trim();
            
            // Função auxiliar para extrair o maior grau
            const getMaxDegree = (expr) => {
              // Procura por pow(x, n) ou x**n ou x^n
              const powMatches = expr.match(/pow\(x,\s*(\d+)\)/g);
              const powDegrees = powMatches ? powMatches.map(m => parseInt(m.match(/(\d+)/)[0])) : [];
              
              const doubleStarMatches = expr.match(/x\*\*(\d+)/g);
              const doubleStarDegrees = doubleStarMatches ? doubleStarMatches.map(m => parseInt(m.match(/(\d+)/)[0])) : [];
              
              const singleXMatches = expr.match(/\bx\b(?!\*\*|\^)/g);
              const singleXDegree = singleXMatches ? [1] : [];
              
              const allDegrees = [...powDegrees, ...doubleStarDegrees, ...singleXDegree];
              return allDegrees.length > 0 ? Math.max(...allDegrees) : 0;
            };
            
            // Função auxiliar para extrair coeficiente principal
            const getLeadingCoeff = (expr, degree) => {
              if (degree === 0) {
                // Tenta extrair constante
                const constMatch = expr.match(/(?:^|\+|-|\()(\d+(?:\.\d+)?)(?![*x])/);
                return constMatch ? parseFloat(constMatch[1]) : 1;
              }
              
              // Verifica se o termo começa com sinal negativo
              let sign = 1;
              const termPattern = new RegExp(`([+-]?)\\s*(?:\\d*(?:\\.\\d+)?\\s*\\*\\s*)?(?:pow\\(x,\\s*${degree}\\)|x\\*\\*${degree})`);
              const termMatch = expr.match(termPattern);
              
              if (termMatch && termMatch[1] === '-') {
                sign = -1;
              }
              
              // Procura coeficiente de pow(x, degree) ou x**degree com multiplicação explícita
              const powPattern = new RegExp(`([+-]?)(\\d+(?:\\.\\d+)?)\\s*\\*\\s*pow\\(x,\\s*${degree}\\)`);
              const powMatch = expr.match(powPattern);
              if (powMatch) {
                const coeffValue = parseFloat(powMatch[2] || '1');
                const coeffSign = powMatch[1] === '-' ? -1 : 1;
                return coeffValue * coeffSign;
              }
              
              const doubleStarPattern = new RegExp(`([+-]?)(\\d+(?:\\.\\d+)?)\\s*\\*\\s*x\\*\\*${degree}`);
              const doubleStarMatch = expr.match(doubleStarPattern);
              if (doubleStarMatch) {
                const coeffValue = parseFloat(doubleStarMatch[2] || '1');
                const coeffSign = doubleStarMatch[1] === '-' ? -1 : 1;
                return coeffValue * coeffSign;
              }
              
              // Procura por x**degree ou pow(x, degree) sem coeficiente explícito
              // Mas verifica se há um sinal negativo antes
              const implicitPattern = new RegExp(`([+-]?)\\s*(?:pow\\(x,\\s*${degree}\\)|x\\*\\*${degree})`);
              const implicitMatch = expr.match(implicitPattern);
              if (implicitMatch) {
                return implicitMatch[1] === '-' ? -1 : 1;
              }
              
              // Se encontrou o termo mas sem sinal explícito, assume positivo
              if (expr.includes(`pow(x, ${degree})`) || expr.includes(`x**${degree}`)) {
                // Verifica se há um sinal negativo antes do termo
                const beforePattern = new RegExp(`([+-])\\s*(?:pow\\(x,\\s*${degree}\\)|x\\*\\*${degree})`);
                const beforeMatch = expr.match(beforePattern);
                return beforeMatch && beforeMatch[1] === '-' ? -1 : 1;
              }
              
              return sign; // Retorna o sinal detectado ou 1
            };
            
            const numDegree = getMaxDegree(numerator);
            const denDegree = getMaxDegree(denominator);
            
            steps.push(`📐 Grau do numerador: ${numDegree}`);
            steps.push(`📐 Grau do denominador: ${denDegree}`);
            
            if (numDegree === denDegree) {
              // Mesmo grau: limite = coeficiente principal do numerador / coeficiente principal do denominador
              const numCoeff = getLeadingCoeff(numerator, numDegree);
              const denCoeff = getLeadingCoeff(denominator, denDegree);
              const result = numCoeff / denCoeff;
              
              steps.push(`✨ Mesmo grau: limite = ${numCoeff}/${denCoeff} = ${result}`);
              tips.push('Para funções racionais com mesmo grau, o limite é a razão dos coeficientes principais');
              
              return {
                result: formatResult(result),
                steps,
                tips,
                strategy: 'maior_grau',
                form: '∞/∞'
              };
            } else if (numDegree > denDegree) {
              // Grau do numerador maior: limite = ±∞
              const result = point > 0 ? Infinity : -Infinity;
              steps.push(`✨ Grau do numerador maior: limite = ${result > 0 ? '∞' : '-∞'}`);
              tips.push('Quando o grau do numerador é maior, o limite tende ao infinito');
              
              return {
                result: result > 0 ? '∞' : '-∞',
                steps,
                tips,
                strategy: 'maior_grau',
                form: '∞/∞'
              };
            } else {
              // Grau do denominador maior: limite = 0
              steps.push('✨ Grau do denominador maior: limite = 0');
              tips.push('Quando o grau do denominador é maior, o limite tende a zero');
              
              return {
                result: formatResult(0),
                steps,
                tips,
                strategy: 'maior_grau',
                form: '∞/∞'
              };
            }
          }
        } catch (infinityError) {
          steps.push(`⚠️ Erro ao calcular limite no infinito: ${infinityError.message}`);
        }
      }
    }
    
    // Tenta substituição direta
    try {
      const compiled = math.compile(normalizedExpr);
      const result = compiled.evaluate({ x: point });
      
      if (isFinite(result) && !isNaN(result)) {
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
      // Se falhar, verifica se é erro de divisão por zero ou forma indeterminada
      steps.push(`⚠️ Substituição direta falhou: ${error.message}`);
      
      // Verifica se há divisão na expressão
      if (normalizedExpr.includes('/')) {
        const parts = normalizedExpr.split('/');
        if (parts.length === 2) {
          try {
            const numerator = math.compile(parts[0].trim());
            const denominator = math.compile(parts[1].trim());
            
            const numVal = numerator.evaluate({ x: point });
            const denVal = denominator.evaluate({ x: point });
            
            // Verifica se é forma 0/0
            if (Math.abs(numVal) < 1e-10 && Math.abs(denVal) < 1e-10) {
              steps.push('🔍 Detectada forma indeterminada 0/0');
              
              // PRIMEIRO: Verifica se é um limite fundamental
              const fundamental = detectFundamentalLimit(normalizedExpr, point);
              
              if (fundamental) {
                steps.push(`✨ Limite fundamental detectado: ${fundamental.description}`);
                const fundamentalResult = applyFundamentalLimit(normalizedExpr, fundamental);
                return {
                  result: formatResult(fundamentalResult.result),
                  steps: [...steps, ...fundamentalResult.steps],
                  tips: [...tips, ...fundamentalResult.tips],
                  strategy: fundamentalResult.strategy,
                  form: '0/0'
                };
              }
              
              // SEGUNDO: Tenta L'Hôpital para 0/0
              steps.push('🔄 Tentando aplicar Regra de L\'Hôpital...');
              try {
                const numDerivative = math.derivative(parts[0].trim(), 'x').toString();
                const denDerivative = math.derivative(parts[1].trim(), 'x').toString();
                
                steps.push(`📐 Derivada do numerador: ${numDerivative}`);
                steps.push(`📐 Derivada do denominador: ${denDerivative}`);
                
                const lhopitalResult = applyLHospitalRule(
                  parts[0].trim(),
                  parts[1].trim(),
                  point
                );
                
                if (lhopitalResult.success) {
                  return {
                    result: formatResult(lhopitalResult.result),
                    steps: [...steps, ...lhopitalResult.steps],
                    tips: [...tips, 'Regra de L\'Hôpital aplicada com sucesso'],
                    strategy: 'lhopital',
                    form: '0/0'
                  };
                } else {
                  steps.push(`⚠️ L'Hôpital não resolveu: ${lhopitalResult.error || 'Máximo de iterações'}`);
                }
              } catch (lhopitalError) {
                steps.push(`❌ Erro ao aplicar L'Hôpital: ${lhopitalError.message}`);
              }
            }
            
            // Verifica se é (número ≠ 0)/0
            if (Math.abs(numVal) > 1e-10 && Math.abs(denVal) < 1e-10) {
              steps.push('⚠️ Forma (número ≠ 0)/0 detectada');
              steps.push('💡 Calcule limites laterais para determinar se o limite existe');
              tips.push('Se os limites laterais forem diferentes, o limite não existe');
              
              return {
                result: 'Não existe ou ±∞',
                steps,
                tips,
                strategy: 'limites_laterais',
                form: 'não_zero/0'
              };
            }
          } catch (evalError) {
            steps.push(`⚠️ Não foi possível avaliar numerador/denominador: ${evalError.message}`);
          }
        }
      }
      
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
