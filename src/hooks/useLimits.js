/**
 * Hook personalizado para gerenciar estado da calculadora de limites
 */

import { useState, useCallback } from 'react';
import { calculateLimit } from '../services/limitsEngine.js';

export const useLimits = () => {
  // Estados principais
  const [functionValue, setFunctionValue] = useState('');
  const [limitPoint, setLimitPoint] = useState('');
  const [direction, setDirection] = useState('ambos');
  
  // Estados de resultado
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);
  const [tips, setTips] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Estados de modais
  const [showExamples, setShowExamples] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  
  // Função para calcular limite
  const handleCalculate = useCallback(async () => {
    if (!functionValue.trim() || !limitPoint.trim()) {
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const { result: calcResult, steps: calcSteps, tips: calcTips } = 
        calculateLimit(functionValue, limitPoint, direction);
      
      setResult(calcResult);
      setSteps(calcSteps);
      setTips(calcTips);
    } catch (error) {
      setResult('Erro');
      setSteps([`Erro: ${error.message}`]);
      setTips(['Verifique os dados de entrada']);
    } finally {
      setIsCalculating(false);
    }
  }, [functionValue, limitPoint, direction]);
  
  // Função para limpar resultados
  const clearResults = useCallback(() => {
    setResult('');
    setSteps([]);
    setTips([]);
  }, []);
  
  // Função para carregar exemplo
  const loadExample = useCallback((example) => {
    setFunctionValue(example.function);
    setLimitPoint(example.point);
    setDirection(example.direction);
    clearResults();
  }, [clearResults]);
  
  // Função para resetar calculadora
  const resetCalculator = useCallback(() => {
    setFunctionValue('');
    setLimitPoint('');
    setDirection('ambos');
    clearResults();
  }, [clearResults]);
  
  return {
    // Estados de entrada
    functionValue,
    setFunctionValue,
    limitPoint,
    setLimitPoint,
    direction,
    setDirection,
    
    // Estados de resultado
    result,
    steps,
    tips,
    isCalculating,
    
    // Estados de modais
    showExamples,
    setShowExamples,
    showHelp,
    setShowHelp,
    showGraph,
    setShowGraph,
    
    // Funções
    handleCalculate,
    clearResults,
    loadExample,
    resetCalculator
  };
};
