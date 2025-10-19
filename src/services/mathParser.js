/**
 * Parser matemático para normalização de expressões
 * Equivalente ao normalize_expr do Python
 */

import { TRIGONOMETRIC_FUNCTIONS, MATH_CONSTANTS } from '../utils/constants.js';

/**
 * Normaliza expressão matemática do português brasileiro para sintaxe do Math.js
 * @param {string} exprStr - Expressão em português brasileiro
 * @returns {string} Expressão normalizada para Math.js
 */
export const normalizeExpression = (exprStr) => {
  if (!exprStr || !exprStr.trim()) {
    return '';
  }

  let expr = exprStr.trim();

  // Converte vírgula decimal para ponto
  expr = expr.replace(/,/g, '.');

  // Converte operadores de potência (mais robusto)
  expr = expr.replace(/\^/g, '**');
  
  // Converte ** para pow() quando o expoente é uma variável OU número
  // Isso resolve o problema "Value expected" do Math.js
  expr = expr.replace(/\(([^)]+)\)\*\*([a-zA-Z0-9]+)/g, 'pow($1, $2)');
  expr = expr.replace(/([a-zA-Z0-9]+)\*\*([a-zA-Z0-9]+)/g, 'pow($1, $2)');

  // Converte funções trigonométricas
  Object.entries(TRIGONOMETRIC_FUNCTIONS).forEach(([pt, en]) => {
    const regex = new RegExp(`\\b${pt}\\b`, 'g');
    expr = expr.replace(regex, en);
  });

  // REMOVIDO: Não converter 'e' para 'E' - o Math.js já reconhece 'e' como constante de Euler
  // expr = expr.replace(/\be\b/g, MATH_CONSTANTS.E);

  // Normaliza infinito
  expr = expr.replace(/\boo\b/g, MATH_CONSTANTS.INFINITY);
  expr = expr.replace(/-oo/g, MATH_CONSTANTS.NEGATIVE_INFINITY);

  // Remove espaços extras
  expr = expr.replace(/\s+/g, ' ').trim();

  return expr;
};

// Removido: função de normalização alternativa - solução integrada na função principal

/**
 * Valida se uma expressão matemática é válida
 * @param {string} expr - Expressão a ser validada
 * @returns {boolean} True se válida, false caso contrário
 */
export const isValidExpression = (expr) => {
  try {
    // Tenta fazer parse da expressão normalizada
    const normalized = normalizeExpression(expr);
    if (!normalized) return false;

    // Verifica se contém caracteres válidos (regex mais permissiva)
    const validChars = /^[0-9+\-*/.()x\s\w\*\*]+$/;
    return validChars.test(normalized);
  } catch (error) {
    return false;
  }
};

/**
 * Converte string de ponto limite para valor numérico
 * @param {string} pointStr - String do ponto (ex: "0", "oo", "-oo")
 * @returns {number|string} Valor numérico ou string especial
 */
export const parseLimitPoint = (pointStr) => {
  if (!pointStr || !pointStr.trim()) {
    return null;
  }

  const point = pointStr.trim().toLowerCase();

  // Diferentes formatos de infinito
  if (point === MATH_CONSTANTS.INFINITY || 
      point === 'oo' || 
      point === 'infinity' || 
      point === 'inf' ||
      point === '00' ||
      point === '∞') {
    return Infinity;
  } else if (point === MATH_CONSTANTS.NEGATIVE_INFINITY || 
             point === '-oo' || 
             point === '-infinity' || 
             point === '-inf' ||
             point === '-00' ||
             point === '-∞') {
    return -Infinity;
  } else {
    const num = parseFloat(point);
    return isNaN(num) ? null : num;
  }
};

/**
 * Formata resultado para exibição
 * @param {*} result - Resultado do cálculo
 * @returns {string} Resultado formatado
 */
export const formatResult = (result) => {
  if (result === Infinity) {
    return '∞';
  } else if (result === -Infinity) {
    return '-∞';
  } else if (typeof result === 'number') {
    // Arredonda para 6 casas decimais se necessário
    if (Number.isInteger(result)) {
      return result.toString();
    } else {
      return parseFloat(result.toFixed(6)).toString();
    }
  } else {
    return String(result);
  }
};
