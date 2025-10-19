/**
 * Serviço aprimorado para geração de gráficos com detecção de descontinuidades
 */

import { math } from '../utils/mathConfig.js';
import { normalizeExpression, parseLimitPoint } from './mathParser.js';

/**
 * Gera dados aprimorados para plotagem com detecção de descontinuidades
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto limite
 * @returns {Object} Dados do gráfico aprimorados
 */
export const generateEnhancedGraphData = (functionStr, limitPointStr) => {
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const limitPoint = parseLimitPoint(limitPointStr);
    
    if (limitPoint === null) {
      throw new Error('Ponto limite inválido');
    }
    
    // Configuração do intervalo
    let xMin, xMax, numPoints;
    
    if (Math.abs(limitPoint) === Infinity) {
      if (limitPoint > 0) {
        xMin = 1;
        xMax = 100;
        numPoints = 2000;
      } else {
        xMin = -100;
        xMax = -1;
        numPoints = 2000;
      }
    } else {
      const range = 4;
      xMin = limitPoint - range;
      xMax = limitPoint + range;
      numPoints = 1000;
    }
    
    const expr = math.compile(normalizedExpr);
    
    // Gera pontos x
    const x = [];
    const y = [];
    const discontinuities = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const xi = xMin + (i / numPoints) * (xMax - xMin);
      x.push(xi);
      
      try {
        const yi = expr.evaluate({ x: xi });
        
        if (isFinite(yi)) {
          y.push(yi);
        } else {
          y.push(null);
          
          // Detecta descontinuidade
          if (Math.abs(xi - limitPoint) < 0.1) {
            discontinuities.push({
              x: xi,
              type: 'discontinuity',
              reason: 'Function undefined'
            });
          }
        }
      } catch (error) {
        y.push(null);
        
        // Detecta possível descontinuidade
        if (Math.abs(xi - limitPoint) < 0.1) {
          discontinuities.push({
            x: xi,
            type: 'discontinuity',
            reason: error.message
          });
        }
      }
    }
    
    // Cria traces
    const traces = [];
    
    // Trace principal da função
    traces.push({
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      name: `f(x) = ${functionStr}`,
      line: {
        color: '#6C63FF',
        width: 2
      },
      connectgaps: false
    });
    
    // Trace para descontinuidades
    if (discontinuities.length > 0) {
      const discX = discontinuities.map(d => d.x);
      const discY = discontinuities.map(d => {
        // Tenta calcular limites laterais
        try {
          const leftLimit = expr.evaluate({ x: d.x - 0.001 });
          const rightLimit = expr.evaluate({ x: d.x + 0.001 });
          return (leftLimit + rightLimit) / 2;
        } catch {
          return 0;
        }
      });
      
      traces.push({
        x: discX,
        y: discY,
        type: 'scatter',
        mode: 'markers',
        name: 'Descontinuidades',
        marker: {
          color: '#FF6B6B',
          size: 8,
          symbol: 'circle-open',
          line: {
            color: '#FF6B6B',
            width: 2
          }
        }
      });
    }
    
    // Trace da linha vertical no ponto limite (apenas para pontos finitos)
    if (Math.abs(limitPoint) !== Infinity) {
      const finiteY = y.filter(yi => yi !== null && isFinite(yi));
      if (finiteY.length > 0) {
        traces.push({
          x: [limitPoint, limitPoint],
          y: [Math.min(...finiteY), Math.max(...finiteY)],
          type: 'scatter',
          mode: 'lines',
          name: `x = ${limitPoint}`,
          line: {
            color: '#FFD166',
            width: 2,
            dash: 'dash'
          }
        });
      }
    }
    
    // Calcula limites inteligentes do eixo Y
    const finiteY = y.filter(yi => yi !== null && isFinite(yi));
    let yMin, yMax;
    
    if (finiteY.length > 0) {
      const yRange = Math.max(...finiteY) - Math.min(...finiteY);
      
      // Ajusta zoom baseado na variação da função
      if (yRange > 1000) {
        // Função cresce muito rapidamente - usa escala logarítmica
        yMin = Math.min(...finiteY.filter(yi => yi > 0));
        yMax = Math.max(...finiteY.filter(yi => yi > 0));
      } else {
        yMin = Math.min(...finiteY);
        yMax = Math.max(...finiteY);
        
        // Adiciona margem proporcional
        const margin = Math.max(0.1 * yRange, 1);
        yMin -= margin;
        yMax += margin;
      }
    } else {
      yMin = -10;
      yMax = 10;
    }
    
    return {
      data: traces,
      layout: {
        title: {
          text: `Gráfico de f(x) = ${functionStr}${Math.abs(limitPoint) === Infinity ? ' (comportamento no infinito)' : ''}`,
          font: { color: '#FFFFFF', size: 16 }
        },
        xaxis: {
          title: 'x',
          range: [xMin, xMax],
          color: '#B8B8CC',
          gridcolor: 'rgba(255, 255, 255, 0.1)',
          zerolinecolor: 'rgba(255, 255, 255, 0.3)'
        },
        yaxis: {
          title: 'f(x)',
          range: [yMin, yMax],
          color: '#B8B8CC',
          gridcolor: 'rgba(255, 255, 255, 0.1)',
          zerolinecolor: 'rgba(255, 255, 255, 0.3)'
        },
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        showlegend: true,
        legend: {
          font: { color: '#B8B8CC' }
        },
        margin: {
          l: 60,
          r: 30,
          t: 60,
          b: 60
        }
      },
      config: {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        displaylogo: false
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar gráfico aprimorado:', error);
    return {
      data: [{
        x: [0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Erro',
        marker: { color: '#FF6B6B', size: 10 }
      }],
      layout: {
        title: `Erro ao plotar: ${error.message}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' }
      },
      config: { responsive: true }
    };
  }
};

/**
 * Detecta pontos de descontinuidade em uma função
 * @param {string} functionStr - Expressão da função
 * @param {Array<number>} interval - Intervalo [min, max] para análise
 * @param {number} resolution - Resolução da análise
 * @returns {Array} Lista de pontos de descontinuidade
 */
export const detectDiscontinuities = (functionStr, interval, resolution = 1000) => {
  const discontinuities = [];
  
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    const [min, max] = interval;
    const step = (max - min) / resolution;
    
    for (let i = 0; i < resolution; i++) {
      const x = min + i * step;
      
      try {
        const y = expr.evaluate({ x });
        
        if (!isFinite(y)) {
          discontinuities.push({
            x: x,
            type: 'discontinuity',
            reason: 'Function undefined or infinite'
          });
        }
      } catch (error) {
        discontinuities.push({
          x: x,
          type: 'discontinuity',
          reason: error.message
        });
      }
    }
    
  } catch (error) {
    console.error('Erro na detecção de descontinuidades:', error);
  }
  
  return discontinuities;
};

/**
 * Calcula limites laterais em um ponto
 * @param {string} functionStr - Expressão da função
 * @param {number} point - Ponto para calcular os limites
 * @param {number} delta - Delta para aproximação
 * @returns {Object} {leftLimit, rightLimit, exists}
 */
export const calculateLateralLimits = (functionStr, point, delta = 0.001) => {
  try {
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    const leftLimit = expr.evaluate({ x: point - delta });
    const rightLimit = expr.evaluate({ x: point + delta });
    
    const exists = Math.abs(leftLimit - rightLimit) < 1e-6;
    
    return {
      leftLimit: isFinite(leftLimit) ? leftLimit : null,
      rightLimit: isFinite(rightLimit) ? rightLimit : null,
      exists: exists && isFinite(leftLimit) && isFinite(rightLimit)
    };
    
  } catch (error) {
    return {
      leftLimit: null,
      rightLimit: null,
      exists: false,
      error: error.message
    };
  }
};

/**
 * Gera gráfico com zoom inteligente baseado no comportamento da função
 * @param {string} functionStr - Expressão da função
 * @param {string} limitPointStr - Ponto limite
 * @returns {Object} Dados do gráfico com zoom otimizado
 */
export const generateSmartZoomGraph = (functionStr, limitPointStr) => {
  const baseGraph = generateEnhancedGraphData(functionStr, limitPointStr);
  
  try {
    const limitPoint = parseLimitPoint(limitPointStr);
    
    if (Math.abs(limitPoint) === Infinity) {
      return baseGraph;
    }
    
    // Analisa o comportamento da função próximo ao ponto limite
    const normalizedExpr = normalizeExpression(functionStr);
    const expr = math.compile(normalizedExpr);
    
    const testPoints = [
      limitPoint - 0.1,
      limitPoint - 0.01,
      limitPoint - 0.001,
      limitPoint + 0.001,
      limitPoint + 0.01,
      limitPoint + 0.1
    ];
    
    const values = testPoints.map(x => {
      try {
        return expr.evaluate({ x });
      } catch {
        return null;
      }
    }).filter(v => v !== null && isFinite(v));
    
    if (values.length > 0) {
      const range = Math.max(...values) - Math.min(...values);
      
      // Se a função varia muito rapidamente, ajusta o zoom
      if (range > 100) {
        const yMin = Math.min(...values) - range * 0.1;
        const yMax = Math.max(...values) + range * 0.1;
        
        baseGraph.layout.yaxis.range = [yMin, yMax];
      }
    }
    
    return baseGraph;
    
  } catch (error) {
    console.error('Erro no zoom inteligente:', error);
    return baseGraph;
  }
};
