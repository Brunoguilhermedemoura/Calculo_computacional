/**
 * Hook avançado para gerenciar o sistema completo de cálculo de limites
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  calculateDetailedLimit,
  validateExpression,
  suggestCorrections,
  autoCorrectExpression,
  getAdvancedExamples,
  getSystemStats
} from '../services/advancedLimitsEngine.js';

export const useAdvancedLimits = () => {
  // Estados principais
  const [functionValue, setFunctionValue] = useState('');
  const [limitPoint, setLimitPoint] = useState('');
  const [direction, setDirection] = useState('ambos');
  
  // Estados de resultado
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);
  const [tips, setTips] = useState([]);
  const [strategy, setStrategy] = useState('');
  const [form, setForm] = useState('');
  const [formInfo, setFormInfo] = useState(null);
  const [strategyInfo, setStrategyInfo] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  
  // Estados de interface
  const [isCalculating, setIsCalculating] = useState(false);
  const [showStrategyDetails, setShowStrategyDetails] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Estados de validação
  const [validation, setValidation] = useState({ valid: true, errors: [], warnings: [] });
  const [suggestions, setSuggestions] = useState([]);
  
  // Estados de modais
  const [showExamples, setShowExamples] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showSyntaxTips, setShowSyntaxTips] = useState(false);
  
  // Estado do histórico
  const [history, setHistory] = useState([]);
  
  // Referências para controle de animações
  const calculationTimeoutRef = useRef(null);
  const stepAnimationRef = useRef(null);

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }, []);

  // Validação em tempo real
  useEffect(() => {
    if (functionValue.trim()) {
      const validationResult = validateExpression(functionValue);
      setValidation(validationResult);
      
      // Sempre mostra sugestões para melhorar a expressão
      const corrections = suggestCorrections(functionValue);
      setSuggestions(corrections);
    } else {
      setValidation({ valid: true, errors: [], warnings: [] });
      setSuggestions([]);
    }
  }, [functionValue]);

  // Função para salvar cálculo no histórico
  const saveToHistory = useCallback((calculation) => {
    const newHistory = [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        ...calculation
      },
      ...history.slice(0, 4) // Mantém apenas os últimos 5
    ];
    setHistory(newHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(newHistory));
  }, [history]);

  // Função principal de cálculo
  const handleCalculate = useCallback(async () => {
    if (!functionValue.trim() || !limitPoint.trim()) {
      return;
    }
    
    if (!validation.valid) {
      return;
    }
    
    setIsCalculating(true);
    setShowStrategyDetails(true);
    setShowStepDetails(true);
    
    // Limpa resultados anteriores
    setResult('');
    setSteps([]);
    setTips([]);
    setStrategy('');
    setForm('');
    setFormInfo(null);
    setStrategyInfo(null);
    setCalculationResult(null);
    setCurrentStep(0);
    
    try {
      // Simula delay para mostrar animação
      await new Promise(resolve => {
        calculationTimeoutRef.current = setTimeout(resolve, 500);
      });
      
      const detailedResult = calculateDetailedLimit(functionValue, limitPoint, direction);
      
      setResult(detailedResult.result);
      setSteps(detailedResult.steps);
      setTips(detailedResult.tips);
      setStrategy(detailedResult.strategy);
      setForm(detailedResult.form);
      setFormInfo(detailedResult.formInfo);
      setStrategyInfo(detailedResult.strategyInfo);
      setCalculationResult(detailedResult.calculationResult);
      
      // Salva no histórico se o cálculo foi bem-sucedido
      if (detailedResult.result !== 'Erro') {
        saveToHistory({
          function: functionValue,
          point: limitPoint,
          direction: direction,
          result: detailedResult.result
        });
      }
      
      // Anima os passos sequencialmente
      let currentIndex = 0;
      const animateNextStep = () => {
        if (currentIndex < detailedResult.steps.length) {
          setCurrentStep(currentIndex);
          currentIndex++;
          stepAnimationRef.current = setTimeout(animateNextStep, 800);
        }
      };
      animateNextStep();
      
    } catch (error) {
      setResult('Erro');
      setSteps([`Erro: ${error.message}`]);
      setTips(['Verifique os dados de entrada']);
      setStrategy('error');
      setForm('indefinida');
    } finally {
      setIsCalculating(false);
    }
  }, [functionValue, limitPoint, direction, validation.valid, saveToHistory]);

  // Função para limpar resultados
  const clearResults = useCallback(() => {
    setResult('');
    setSteps([]);
    setTips([]);
    setStrategy('');
    setForm('');
    setFormInfo(null);
    setStrategyInfo(null);
    setCalculationResult(null);
    setCurrentStep(0);
    setShowStrategyDetails(false);
    setShowStepDetails(false);
    
    // Limpa timeouts
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }
    if (stepAnimationRef.current) {
      clearTimeout(stepAnimationRef.current);
    }
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

  // Função para alternar detalhes da estratégia
  const toggleStrategyDetails = useCallback(() => {
    setShowStrategyDetails(prev => !prev);
  }, []);

  // Função para alternar detalhes dos passos
  const toggleStepDetails = useCallback(() => {
    setShowStepDetails(prev => !prev);
  }, []);

  // Função para clicar em um passo específico
  const handleStepClick = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
  }, []);

  // Função para obter exemplos avançados
  const getExamples = useCallback(() => {
    return getAdvancedExamples();
  }, []);

  // Função para obter estatísticas do sistema
  const getStats = useCallback(() => {
    return getSystemStats();
  }, []);

  // Função para validar expressão manualmente
  const validateExpressionManually = useCallback((expr) => {
    return validateExpression(expr);
  }, []);

  // Função para obter sugestões de correção
  const getCorrections = useCallback((expr) => {
    return suggestCorrections(expr);
  }, []);

  // Função para auto-corrigir expressão
  const handleAutoCorrect = useCallback(() => {
    const corrected = autoCorrectExpression(functionValue);
    setFunctionValue(corrected);
  }, [functionValue]);

  // Função para limpar histórico
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('calculationHistory');
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
      if (stepAnimationRef.current) {
        clearTimeout(stepAnimationRef.current);
      }
    };
  }, []);

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
    strategy,
    form,
    formInfo,
    strategyInfo,
    calculationResult,
    
    // Estados de interface
    isCalculating,
    showStrategyDetails,
    showStepDetails,
    currentStep,
    
    // Estados de validação
    validation,
    suggestions,
    
    // Histórico
    history,
    clearHistory,
    
    // Estados de modais
    showExamples,
    setShowExamples,
    showHelp,
    setShowHelp,
    showGraph,
    setShowGraph,
    showSyntaxTips,
    setShowSyntaxTips,
    
    // Funções principais
    handleCalculate,
    clearResults,
    loadExample,
    resetCalculator,
    
    // Funções de interface
    toggleStrategyDetails,
    toggleStepDetails,
    handleStepClick,
    
    // Funções utilitárias
    getExamples,
    getStats,
    validateExpressionManually,
    getCorrections,
    handleAutoCorrect
  };
};
