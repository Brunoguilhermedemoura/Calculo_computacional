/**
 * Biblioteca completa de limites fundamentais
 * Baseada no esquema de programação da imagem
 */

export const FUNDAMENTAL_LIMITS = {
  // Limites trigonométricos fundamentais
  TRIGONOMETRIC: {
    'sin(x)/x': {
      limit: 1,
      description: 'Limite fundamental do seno',
      when: 'x → 0',
      strategy: 'fundamental_trigonometric'
    },
    '(1-cos(x))/x': {
      limit: 0,
      description: 'Limite fundamental do cosseno',
      when: 'x → 0',
      strategy: 'fundamental_trigonometric'
    },
    'tan(x)/x': {
      limit: 1,
      description: 'Limite fundamental da tangente',
      when: 'x → 0',
      strategy: 'fundamental_trigonometric'
    },
    'sin(x)/x^2': {
      limit: 'indeterminate',
      description: 'Forma indeterminada que requer L\'Hôpital',
      when: 'x → 0',
      strategy: 'lhopital'
    },
    '(1-cos(x))/x^2': {
      limit: '1/2',
      description: 'Limite fundamental do cosseno ao quadrado',
      when: 'x → 0',
      strategy: 'fundamental_trigonometric'
    }
  },

  // Limites exponenciais fundamentais
  EXPONENTIAL: {
    '(1+1/x)^x': {
      limit: 'e',
      description: 'Limite fundamental exponencial (número de Euler)',
      when: 'x → ∞',
      strategy: 'fundamental_exponential'
    },
    '(1+x)^(1/x)': {
      limit: 'e',
      description: 'Limite fundamental exponencial alternativo',
      when: 'x → 0',
      strategy: 'fundamental_exponential'
    },
    '(a^x-1)/x': {
      limit: 'ln(a)',
      description: 'Limite fundamental exponencial com base a',
      when: 'x → 0',
      strategy: 'fundamental_exponential'
    },
    '(e^x-1)/x': {
      limit: 1,
      description: 'Limite fundamental da exponencial natural',
      when: 'x → 0',
      strategy: 'fundamental_exponential'
    },
    'ln(1+x)/x': {
      limit: 1,
      description: 'Limite fundamental do logaritmo natural',
      when: 'x → 0',
      strategy: 'fundamental_exponential'
    }
  },

  // Limites de funções racionais no infinito
  RATIONAL_INFINITY: {
    'polynomial_ratio': {
      description: 'Para P(x)/Q(x) quando x → ±∞',
      strategy: 'highest_degree',
      rules: [
        'Se grau(P) = grau(Q): limite = coeficiente_principal_P / coeficiente_principal_Q',
        'Se grau(P) > grau(Q): limite = ±∞ (depende dos sinais)',
        'Se grau(P) < grau(Q): limite = 0'
      ]
    }
  },

  // Limites de funções irracionais
  IRRATIONAL: {
    'sqrt_fraction': {
      description: 'Para (√f(x) - √g(x)) quando x → a',
      strategy: 'rationalization',
      method: 'Multiplicar pelo conjugado'
    }
  }
};

/**
 * Verifica se uma expressão corresponde a um limite fundamental
 * @param {string} expr - Expressão normalizada
 * @param {number|string} limitPoint - Ponto para onde x tende
 * @returns {Object|null} Informações do limite fundamental ou null
 */
export const detectFundamentalLimit = (expr, limitPoint) => {
  // Remove espaços e normaliza
  const normalized = expr.replace(/\s/g, '');
  
  // Verifica limites trigonométricos
  for (const [pattern, info] of Object.entries(FUNDAMENTAL_LIMITS.TRIGONOMETRIC)) {
    if (matchesPattern(normalized, pattern, limitPoint)) {
      // Verifica compatibilidade do ponto limite baseado no info.when
      if (info.when === 'x → 0' && limitPoint !== 0 && Math.abs(limitPoint) > 1e-10) {
        continue; // Pula este padrão se o limite não é 0
      }
      if (info.when === 'x → ∞' && Math.abs(limitPoint) !== Infinity) {
        continue; // Pula este padrão se o limite não é infinito
      }
      return { ...info, category: 'trigonometric' };
    }
  }
  
  // Verifica limites exponenciais
  for (const [pattern, info] of Object.entries(FUNDAMENTAL_LIMITS.EXPONENTIAL)) {
    if (matchesPattern(normalized, pattern, limitPoint)) {
      // Verifica compatibilidade do ponto limite baseado no info.when
      if (info.when === 'x → 0' && limitPoint !== 0 && Math.abs(limitPoint) > 1e-10) {
        continue;
      }
      if (info.when === 'x → ∞' && Math.abs(limitPoint) !== Infinity) {
        continue;
      }
      return { ...info, category: 'exponential' };
    }
  }
  
  return null;
};

/**
 * Converte pow(a, b) para (a)^b ou (a)**b para comparação
 * @param {string} expr - Expressão com pow()
 * @returns {string} Expressão convertida
 */
const normalizePowToPower = (expr) => {
  // Converte pow(base, exp) para (base)^exp ou (base)**exp
  return expr.replace(/pow\(([^,]+),\s*([^)]+)\)/g, '($1)^($2)')
             .replace(/\*\*/g, '^'); // Também converte ** para ^ para comparação
};

/**
 * Verifica se uma expressão corresponde a um padrão de limite fundamental
 * @param {string} expr - Expressão normalizada
 * @param {string} pattern - Padrão a ser verificado
 * @param {number|string} limitPoint - Ponto limite (não usado nesta função, mas necessário para compatibilidade)
 * @returns {boolean} True se corresponde ao padrão
 */
// eslint-disable-next-line no-unused-vars
const matchesPattern = (expr, pattern, limitPoint) => {
  // Remove espaços de ambos para comparação
  let exprClean = expr.replace(/\s/g, '');
  const patternClean = pattern.replace(/\s/g, '');
  
  // Normaliza pow() para ^ para comparação
  exprClean = normalizePowToPower(exprClean);
  let patternNormalized = normalizePowToPower(patternClean);
  
  // Comparação direta primeiro (mais eficiente)
  if (exprClean === patternNormalized) {
    return true;
  }
  
  // Também tenta comparação após normalizar ambas para formato comum
  // Remove parênteses extras para comparação mais flexível
  const exprSimplified = exprClean.replace(/\(/g, '').replace(/\)/g, '');
  const patternSimplified = patternNormalized.replace(/\(/g, '').replace(/\)/g, '');
  
  if (exprSimplified === patternSimplified) {
    return true;
  }
  
  // Verifica padrões específicos conhecidos
  // Padrão: (1+1/x)^x ou pow(1+1/x, x)
  if (pattern === '(1+1/x)^x') {
    // Após normalização, ambas devem ter (1+1/x) e ^(x) ou similar
    const hasBase = exprClean.includes('(1+1/x)') || exprClean.includes('1+1/x');
    const hasExponent = exprClean.includes('^x') || exprClean.includes('^(x)') || exprClean.includes('^(x)');
    return hasBase && hasExponent;
  }
  
  // Tenta correspondência com regex como fallback (para casos com variações)
  const regexPattern = patternNormalized
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\*/g, '\\*')
    .replace(/\+/g, '\\+')
    .replace(/\^/g, '\\^');
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  // Verifica se a expressão corresponde ao padrão
  if (regex.test(exprClean)) {
    return true;
  }
  
  return false;
};

/**
 * Aplica um limite fundamental conhecido
 * @param {string} expr - Expressão
 * @param {Object} fundamentalInfo - Informações do limite fundamental
 * @returns {Object} Resultado do cálculo
 */
export const applyFundamentalLimit = (expr, fundamentalInfo) => {
  const steps = [];
  const tips = [];
  
  steps.push(`Aplicando limite fundamental: ${fundamentalInfo.description}`);
  steps.push(`Expressão: ${expr}`);
  steps.push(`Quando: ${fundamentalInfo.when}`);
  
  if (fundamentalInfo.category === 'trigonometric') {
    steps.push('Usando propriedades trigonométricas fundamentais');
    tips.push('Este é um limite fundamental que deve ser memorizado');
  } else if (fundamentalInfo.category === 'exponential') {
    steps.push('Usando propriedades exponenciais fundamentais');
    tips.push('Este limite define o número de Euler (e ≈ 2.71828)');
  }
  
  steps.push(`Resultado: ${fundamentalInfo.limit}`);
  
  return {
    result: fundamentalInfo.limit,
    steps,
    tips,
    strategy: fundamentalInfo.strategy
  };
};

/**
 * Retorna dicas específicas para limites fundamentais
 * @param {string} category - Categoria do limite (trigonometric, exponential)
 * @returns {Array<string>} Lista de dicas
 */
export const getFundamentalTips = (category) => {
  const tips = {
    trigonometric: [
      'Limites trigonométricos fundamentais são essenciais para o cálculo',
      'Use identidades trigonométricas quando necessário',
      'Para formas 0/0 com funções trigonométricas, considere L\'Hôpital'
    ],
    exponential: [
      'O número e é fundamental em muitos cálculos de limites',
      'Use propriedades de logaritmos para simplificar expressões exponenciais',
      'Para formas 1^∞, use a identidade: lim(1+f(x))^g(x) = e^(lim f(x)*g(x))'
    ]
  };
  
  return tips[category] || [];
};
