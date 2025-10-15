/**
 * Serviço para geração de gráficos
 * Equivalente à funcionalidade de plotagem do Python
 */

import { create, all } from 'mathjs';
import { normalizeExpression, parseLimitPoint } from './mathParser.js';

const math = create(all);

/**
 * Gera dados para plotagem de gráfico
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto limite
 * @returns {Object} Dados do gráfico para Plotly
 */
export const generateGraphData = (functionStr, limitPointStr) => {
  try {
    console.log('Gerando gráfico para:', functionStr, 'em x =', limitPointStr);
    
    // Normaliza a expressão
    const normalizedExpr = normalizeExpression(functionStr);
    console.log('Expressão normalizada:', normalizedExpr);
    
    // Converte o ponto limite
    const limitPoint = parseLimitPoint(limitPointStr);
    console.log('Ponto limite convertido:', limitPoint);
    
    if (limitPoint === null || Math.abs(limitPoint) === Infinity) {
      throw new Error('Não é possível plotar em infinito');
    }
    
    // Compila a expressão
    const expr = math.compile(normalizedExpr);
    console.log('Expressão compilada com sucesso');
    
    // Define o intervalo de plotagem
    const range = 3;
    const xMin = limitPoint - range;
    const xMax = limitPoint + range;
    const numPoints = 1000;
    
    // Gera pontos x
    const x = [];
    const y = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const xi = xMin + (i / numPoints) * (xMax - xMin);
      x.push(xi);
      
      try {
        const yi = expr.evaluate({ x: xi });
        y.push(isFinite(yi) ? yi : null);
      } catch (error) {
        console.log(`Erro ao avaliar em x=${xi}:`, error.message);
        y.push(null);
      }
    }
    
    console.log('Pontos gerados:', x.length, 'pontos x,', y.filter(yi => yi !== null).length, 'pontos y válidos');
    
    // Cria o trace da função
    const functionTrace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      name: `f(x) = ${functionStr}`,
      line: {
        color: 'blue',
        width: 2
      }
    };
    
    // Cria o trace da linha vertical no ponto limite
    const limitTrace = {
      x: [limitPoint, limitPoint],
      y: [Math.min(...y.filter(yi => yi !== null)), Math.max(...y.filter(yi => yi !== null))],
      type: 'scatter',
      mode: 'lines',
      name: `x = ${limitPoint}`,
      line: {
        color: 'red',
        width: 2,
        dash: 'dash'
      }
    };
    
    // Calcula limites do eixo y
    const finiteY = y.filter(yi => yi !== null && isFinite(yi));
    let yMin, yMax;
    
    if (finiteY.length > 0) {
      yMin = Math.min(...finiteY);
      yMax = Math.max(...finiteY);
      
      // Adiciona margem
      const margin = 0.1 * (yMax - yMin);
      yMin -= margin;
      yMax += margin;
    } else {
      yMin = -10;
      yMax = 10;
    }
    
    const result = {
      data: [functionTrace, limitTrace],
      layout: {
        title: `Gráfico de f(x) = ${functionStr}`,
        xaxis: {
          title: 'x',
          range: [xMin, xMax]
        },
        yaxis: {
          title: 'f(x)',
          range: [yMin, yMax]
        },
        showlegend: true,
        grid: {
          show: true,
          alpha: 0.3
        },
        margin: {
          l: 50,
          r: 50,
          t: 50,
          b: 50
        }
      },
      config: {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
      }
    };
    
    console.log('Dados do gráfico gerados com sucesso:', result);
    return result;
    
  } catch (error) {
    console.error('Erro ao gerar gráfico:', error);
    return {
      data: [{
        x: [0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Erro',
        marker: { color: 'red', size: 10 }
      }],
      layout: {
        title: `Erro ao plotar: ${error.message}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' }
      },
      config: {
        responsive: true
      }
    };
  }
};

/**
 * Valida se é possível plotar a função
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto limite
 * @returns {Object} {canPlot, reason}
 */
export const canPlotFunction = (functionStr, limitPointStr) => {
  if (!functionStr || !functionStr.trim()) {
    return { canPlot: false, reason: 'Digite uma função para plotar' };
  }
  
  if (!limitPointStr || !limitPointStr.trim()) {
    return { canPlot: false, reason: 'Digite um ponto para plotar' };
  }
  
  const limitPoint = parseLimitPoint(limitPointStr);
  
  if (limitPoint === null) {
    return { canPlot: false, reason: 'Ponto limite inválido' };
  }
  
  if (Math.abs(limitPoint) === Infinity) {
    return { canPlot: false, reason: 'Não é possível plotar em infinito' };
  }
  
  return { canPlot: true, reason: '' };
};
