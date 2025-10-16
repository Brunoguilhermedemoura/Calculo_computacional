/**
 * Configuração padronizada do Math.js para toda a aplicação
 * Centraliza a configuração para evitar inconsistências
 */

import { create, all } from 'mathjs';

// Configuração padronizada do Math.js
export const math = create(all, {
  number: 'number',
  precision: 15,
  // Configuração mais robusta para suportar expressões complexas
  matrix: 'Array',
  // Adiciona suporte explícito para operadores de potência
  operators: {
    'add': true,
    'multiply': true,
    'divide': true,
    'pow': true,
    'unaryMinus': true,
    'unaryPlus': true
  }
});

export default math;
