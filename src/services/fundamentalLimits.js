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
      return { ...info, category: 'trigonometric' };
    }
  }
  
  // Verifica limites exponenciais
  for (const [pattern, info] of Object.entries(FUNDAMENTAL_LIMITS.EXPONENTIAL)) {
    if (matchesPattern(normalized, pattern, limitPoint)) {
      return { ...info, category: 'exponential' };
    }
  }
  
  return null;
};

/**
 * Verifica se uma expressão corresponde a um padrão de limite fundamental
 * @param {string} expr - Expressão normalizada
 * @param {string} pattern - Padrão a ser verificado
 * @param {number|string} limitPoint - Ponto limite
 * @returns {boolean} True se corresponde ao padrão
 */
const matchesPattern = (expr, pattern, limitPoint) => {
  // Converte padrões para regex
  const regexPattern = pattern
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\*/g, '\\*')
    .replace(/\+/g, '\\+')
    .replace(/\^/g, '\\^')
    .replace(/x/g, 'x');
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  // Verifica se a expressão corresponde ao padrão
  if (!regex.test(expr)) return false;
  
  // Verifica se o ponto limite é compatível
  if (pattern.includes('x → 0') && limitPoint !== 0) return false;
  if (pattern.includes('x → ∞') && Math.abs(limitPoint) !== Infinity) return false;
  
  return true;
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
