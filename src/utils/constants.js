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
  {
    function: 'sin(x)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1',
    description: 'Limite fundamental do seno'
  },
  {
    function: '(x^2-1)/(x-1)',
    point: '1',
    direction: 'ambos',
    expectedResult: '2',
    description: 'Fatoração de polinômio'
  },
  {
    function: '(sqrt(x+1)-1)/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '1/2',
    description: 'Racionalização com raiz quadrada'
  },
  {
    function: '(1+1/x)^x',
    point: 'oo',
    direction: 'ambos',
    expectedResult: 'e',
    description: 'Limite fundamental exponencial'
  },
  {
    function: '(2*x^3+5)/(x^3-7)',
    point: 'oo',
    direction: 'ambos',
    expectedResult: '2',
    description: 'Limite de função racional no infinito'
  },
  {
    function: '(1-cos(x))/x',
    point: '0',
    direction: 'ambos',
    expectedResult: '0',
    description: 'Limite com cosseno'
  }
];
