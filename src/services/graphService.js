/**
 * Serviço para geração de gráficos
 * Equivalente à funcionalidade de plotagem do Python
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, parseLimitPoint } from './mathParser.js';

// math já importado do mathConfig.js

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
    
    if (limitPoint === null) {
      throw new Error('Ponto limite inválido');
    }
    
    // Para limites no infinito, usa um intervalo especial
    let xMin, xMax, numPoints;
    
    if (Math.abs(limitPoint) === Infinity) {
      // Para infinito, plota em um intervalo grande mostrando o comportamento assintótico
      if (limitPoint > 0) {
        // Limite no +infinito: plota de 1 a 100
        xMin = 1;
        xMax = 100;
        numPoints = 2000; // Mais pontos para melhor resolução
      } else {
        // Limite no -infinito: plota de -100 a -1
        xMin = -100;
        xMax = -1;
        numPoints = 2000;
      }
    } else {
      // Para pontos finitos, usa o comportamento original
      const range = 3;
      xMin = limitPoint - range;
      xMax = limitPoint + range;
      numPoints = 1000;
    }
    
    // Compila a expressão
    const expr = math.compile(normalizedExpr);
    console.log('Expressão compilada com sucesso');
    
    // Intervalo de plotagem já definido acima
    
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
    
    // Cria o trace da linha vertical no ponto limite (apenas para pontos finitos)
    let limitTrace = null;
    if (Math.abs(limitPoint) !== Infinity) {
      const finiteY = y.filter(yi => yi !== null && isFinite(yi));
      if (finiteY.length > 0) {
        limitTrace = {
          x: [limitPoint, limitPoint],
          y: [Math.min(...finiteY), Math.max(...finiteY)],
          type: 'scatter',
          mode: 'lines',
          name: `x = ${limitPoint}`,
          line: {
            color: 'red',
            width: 2,
            dash: 'dash'
          }
        };
      }
    }
    
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
    
    const data = [functionTrace];
    if (limitTrace) {
      data.push(limitTrace);
    }
    
    const result = {
      data: data,
      layout: {
        title: `Gráfico de f(x) = ${functionStr}${Math.abs(limitPoint) === Infinity ? ' (comportamento no infinito)' : ''}`,
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
  
  // Agora permitimos plotagem no infinito com comportamento especial
  
  return { canPlot: true, reason: '' };
};
