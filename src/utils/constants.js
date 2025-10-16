/**
 * Constantes matemáticas e configurações para a calculadora de limites
 */

export const MATH_CONSTANTS = {
  PI: 'pi',
  E: 'E',
  INFINITY: 'oo',
  NEGATIVE_INFINITY: '-oo'
};

export const TRIGONOMETRIC_FUNCTIONS = {
  'sen': 'sin',
  'tg': 'tan',
  'ln': 'log'
};

export const INDETERMINATE_FORMS = {
  ZERO_OVER_ZERO: '0/0',
  INFINITY_OVER_INFINITY: '∞/∞',
  INFINITY_MINUS_INFINITY: '∞-∞',
  ONE_TO_INFINITY: '1^∞',
  ZERO_TIMES_INFINITY: '0·∞',
  ZERO_TO_ZERO: '0^0',
  INFINITY_TO_ZERO: '∞^0',
  NUMERICAL: 'numérico',
  INFINITY: 'infinito',
  UNDEFINED: 'indefinida'
};

export const DIRECTION_OPTIONS = [
  { value: 'ambos', label: 'Ambos' },
  { value: 'esquerda', label: 'Esquerda' },
  { value: 'direita', label: 'Direita' }
];

export const EXAMPLE_LIMITS = [
  // Limites fundamentais trigonométricos
  {
    function: 'sin(x)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Limite fundamental do seno',
    strategy: 'fundamental_trigonometric',
    category: 'Limites Fundamentais'
  },
  {
    function: '(1-cos(x))/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Limite fundamental do cosseno',
    strategy: 'fundamental_trigonometric',
    category: 'Limites Fundamentais'
  },
  {
    function: 'tan(x)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Limite fundamental da tangente',
    strategy: 'fundamental_trigonometric',
    category: 'Limites Fundamentais'
  },
  
  // Limites fundamentais exponenciais
  {
    function: '(1+1/x)^x',
    point: 'oo',
    direction: 'ambos',
    expectedResult: 'e',
    description: 'Limite fundamental exponencial (número de Euler)',
    strategy: 'fundamental_exponential',
    category: 'Limites Fundamentais'
  },
  {
    function: '(e^x-1)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Limite fundamental da exponencial natural',
    strategy: 'fundamental_exponential',
    category: 'Limites Fundamentais'
  },
  {
    function: 'ln(1+x)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Limite fundamental do logaritmo natural',
    strategy: 'fundamental_exponential',
    category: 'Limites Fundamentais'
  },
  
  // Fatoração de polinômios
  {
    function: '(x^2-1)/(x-1)',
    point: '1',
    direction: 'ambos',
    expectedResult: '2',
    description: 'Diferença de quadrados',
    strategy: 'factoring',
    category: 'Fatoração'
  },
  {
    function: '(x^2-4)/(x-2)',
    point: '2',
    direction: 'ambos',
    expectedResult: '4',
    description: 'Diferença de quadrados',
    strategy: 'factoring',
    category: 'Fatoração'
  },
  {
    function: '(x^3-8)/(x-2)',
    point: '2',
    direction: 'ambos',
    expectedResult: '12',
    description: 'Diferença de cubos',
    strategy: 'factoring',
    category: 'Fatoração'
  },
  {
    function: '(x^2-5*x+6)/(x-2)',
    point: '2',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Trinômio do segundo grau',
    strategy: 'factoring',
    category: 'Fatoração'
  },
  
  // Racionalização
  {
    function: '(sqrt(x+1)-1)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1/2',
    description: 'Racionalização com raiz quadrada',
    strategy: 'rationalization',
    category: 'Racionalização'
  },
  {
    function: '(sqrt(x+4)-2)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1/4',
    description: 'Racionalização com raiz quadrada',
    strategy: 'rationalization',
    category: 'Racionalização'
  },
  {
    function: '(sqrt(x^2+1)-x)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Racionalização no infinito',
    strategy: 'conjugate_multiplication',
    category: 'Racionalização'
  },
  
  // Limites no infinito
  {
    function: '(2*x^3+5)/(x^3-7)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: '2',
    description: 'Função racional no infinito',
    strategy: 'highest_degree',
    category: 'Limites no Infinito'
  },
  {
    function: '(x^2+1)/(x^3+2)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Grau do denominador maior',
    strategy: 'highest_degree',
    category: 'Limites no Infinito'
  },
  {
    function: '(x^3+1)/(x^2+1)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: 'oo',
    description: 'Grau do numerador maior',
    strategy: 'highest_degree',
    category: 'Limites no Infinito'
  },
  {
    function: '(3*x^4+2*x^2+1)/(2*x^4+x^3+5)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: '3/2',
    description: 'Mesmo grau, razão dos coeficientes',
    strategy: 'highest_degree',
    category: 'Limites no Infinito'
  },
  
  // Formas indeterminadas complexas
  {
    function: 'x*ln(x)',
    point: '0',
    direction: 'direita',
    expectedResult: '0',
    description: 'Forma 0·∞',
    strategy: 'rewrite_as_quotient',
    category: 'Formas Indeterminadas'
  },
  {
    function: 'x*sin(1/x)',
    point: '0',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Teorema do confronto',
    strategy: 'squeeze_theorem',
    category: 'Formas Indeterminadas'
  },
  {
    function: '(x^2*sin(1/x))/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Teorema do confronto com fatoração',
    strategy: 'squeeze_theorem',
    category: 'Formas Indeterminadas'
  }
];
