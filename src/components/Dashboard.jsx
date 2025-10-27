/**
 * Dashboard do usuário
 * Tela intermediária com estatísticas e acesso à calculadora
 * Versão premium com animações 3D e efeitos visuais avançados
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import { getCalculationStats } from '../services/userStorageService.js';

const Dashboard = ({ onStartCalculator, onLogout }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCalculations: 0,
    mostUsedStrategies: [],
    recentCalculations: [],
    averageComplexity: 0,
    lastCalculation: null
  });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const userStats = getCalculationStats();
        setStats(userStats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend, delay = 0 }) => (
    <Fade in timeout={800 + delay}>
      <Card
        sx={{
          background: 'rgba(30, 30, 47, 0.85)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 4,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          height: '100%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
          animation: 'fadeInUp 0.8s ease-out',
          animationDelay: `${delay}ms`,
          '&:hover': {
            transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-8px)',
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.5),
              0 8px 20px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1),
              0 0 30px ${color}40
            `,
            '& .stat-number': {
              animation: 'pulse 2s ease-in-out infinite',
            },
            '& .stat-icon': {
              animation: 'float 3s ease-in-out infinite',
            }
          }
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Avatar
              className="stat-icon"
              sx={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                mr: 2.5,
                width: 52,
                height: 52,
                boxShadow: `0 8px 25px ${color}40, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                transition: 'all 0.3s ease'
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '0.02em'
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#B8B8CC',
                    fontWeight: 400,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Typography
            className="stat-number"
            variant="h3"
            sx={{
              color: color,
              fontWeight: 700,
              mb: 1,
              fontFamily: '"Roboto Mono", monospace',
              textShadow: `0 4px 8px ${color}30`,
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
          >
            {value}
          </Typography>
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ 
                color: '#00D2FF', 
                fontSize: 18,
                filter: 'drop-shadow(0 2px 4px rgba(0, 210, 255, 0.3))'
              }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#00D2FF',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0, 210, 255, 0.3)'
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%),
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%',
          animation: 'gradientShift 8s ease-in-out infinite',
          padding: 2,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            background: 'rgba(30, 30, 47, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            p: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              mb: 3,
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            Carregando suas estatísticas...
          </Typography>
          <LinearProgress 
            sx={{ 
              width: '100%',
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #6C63FF 0%, #00D2FF 100%)',
                borderRadius: 4,
                animation: 'shimmer 2s ease-in-out infinite'
              }
            }} 
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%),
          linear-gradient(45deg, #6C63FF 0%, #00D2FF 50%, #FFD166 100%)
        `,
        backgroundSize: '100% 100%, 200% 200%',
        animation: 'gradientShift 12s ease-in-out infinite',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorativo com animação */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 209, 102, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
          animation: 'gradientShift 15s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      {/* Partículas flutuantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 4,
            height: 4,
            background: 'rgba(108, 99, 255, 0.3)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          },
          '&::before': {
            top: '20%',
            left: '10%',
            animationDelay: '0s'
          },
          '&::after': {
            top: '60%',
            right: '15%',
            animationDelay: '3s',
            background: 'rgba(0, 210, 255, 0.3)'
          }
        }}
      />

      {/* Header */}
      <Slide direction="down" in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(30, 30, 47, 0.95)',
            backdropFilter: 'blur(25px)',
            borderBottom: '1px solid rgba(108, 99, 255, 0.3)',
            borderRadius: 0,
            p: 3.5,
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #6C63FF 50%, transparent 100%)',
              opacity: 0.6
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  animation: 'glow 3s ease-in-out infinite',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: '0 12px 35px rgba(108, 99, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                  }
                }}
              >
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {getGreeting()}, {user.name.split(' ')[0]}!
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#B8B8CC',
                    fontWeight: 400,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '0.01em'
                  }}
                >
                  Pronto para calcular alguns limites?
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Tooltip title="Sair" arrow>
                <IconButton
                  onClick={onLogout}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.1) rotate(5deg)',
                      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <LogoutIcon sx={{ color: '#FFFFFF' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Conteúdo Principal */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Estatísticas Principais */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1200}>
              <Typography
                variant="h5"
                sx={{
                  color: '#6C63FF',
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.01em'
                }}
              >
                <BarChartIcon sx={{ 
                  fontSize: 28,
                  filter: 'drop-shadow(0 2px 4px rgba(108, 99, 255, 0.3))'
                }} />
                Suas Estatísticas
              </Typography>
            </Fade>
            
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Total de Cálculos"
                  value={stats.totalCalculations}
                  icon={<CalculateIcon />}
                  color="#6C63FF"
                  subtitle="Limites resolvidos"
                  delay={0}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Complexidade Média"
                  value={stats.averageComplexity}
                  icon={<SpeedIcon />}
                  color="#00D2FF"
                  subtitle="Passos por cálculo"
                  delay={200}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Estratégias Usadas"
                  value={stats.mostUsedStrategies.length}
                  icon={<FunctionsIcon />}
                  color="#FFD166"
                  subtitle="Diferentes métodos"
                  delay={400}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Última Atividade"
                  value={stats.lastCalculation ? 'Hoje' : 'Nunca'}
                  icon={<TimelineIcon />}
                  color="#FF6B6B"
                  subtitle={stats.lastCalculation ? 'Cálculo recente' : 'Primeira vez'}
                  delay={600}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Ação Principal */}
          <Grid item xs={12} lg={4}>
            <Slide direction="left" in timeout={1400}>
              <Paper
                sx={{
                  background: 'rgba(30, 30, 47, 0.9)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 4,
                  boxShadow: `
                    0 12px 40px rgba(0, 0, 0, 0.4),
                    0 4px 12px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                  p: 4.5,
                  textAlign: 'center',
                  height: 'fit-content',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  animation: 'glow 4s ease-in-out infinite',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-4px)',
                    boxShadow: `
                      0 20px 60px rgba(0, 0, 0, 0.5),
                      0 8px 20px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                      0 0 40px rgba(108, 99, 255, 0.3)
                    `,
                    '& .main-icon': {
                      animation: 'float 3s ease-in-out infinite',
                      transform: 'scale(1.1)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }
                }}
              >
                <Box
                  className="main-icon"
                  sx={{
                    width: 88,
                    height: 88,
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                    margin: '0 auto 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    boxShadow: `
                      0 12px 40px rgba(108, 99, 255, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `,
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src="/logo.png" 
                    alt="Logo Calculadora" 
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    mb: 2.5,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Começar a Calcular
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#B8B8CC',
                    mb: 4.5,
                    lineHeight: 1.7,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    fontWeight: 400
                  }}
                >
                  Acesse a calculadora de limites e resolva problemas de cálculo diferencial e integral.
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={onStartCalculator}
                  startIcon={<CalculateIcon />}
                  sx={{
                    py: 2.5,
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    mb: 2.5,
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                    boxShadow: '0 8px 25px rgba(108, 99, 255, 0.4)',
                    borderRadius: 3,
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5A52E5 0%, #00B8E6 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(108, 99, 255, 0.6)'
                    },
                    '&:active': {
                      transform: 'translateY(0px)'
                    }
                  }}
                >
                  Iniciar Cálculo
                </Button>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#8B8B9E',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    fontWeight: 400
                  }}
                >
                  Seus cálculos serão salvos automaticamente
                </Typography>
              </Paper>
            </Slide>
          </Grid>

          {/* Estratégias Mais Usadas */}
          {stats.mostUsedStrategies.length > 0 && (
            <Grid item xs={12} lg={6}>
              <Grow in timeout={1600}>
                <Paper
                  sx={{
                    background: 'rgba(30, 30, 47, 0.85)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 4,
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.4),
                      0 2px 8px rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    p: 3.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `
                        0 12px 40px rgba(0, 0, 0, 0.5),
                        0 4px 12px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15)
                      `
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#6C63FF',
                      fontWeight: 600,
                      mb: 3.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    <FunctionsIcon sx={{ 
                      fontSize: 24,
                      filter: 'drop-shadow(0 2px 4px rgba(108, 99, 255, 0.3))'
                    }} />
                    Estratégias Mais Usadas
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {stats.mostUsedStrategies.slice(0, 5).map((strategy, index) => (
                      <Chip
                        key={strategy.strategy}
                        label={`${strategy.strategy} (${strategy.count})`}
                        sx={{
                          background: `rgba(108, 99, 255, ${0.15 + (index * 0.08)})`,
                          color: '#6C63FF',
                          border: '1px solid rgba(108, 99, 255, 0.4)',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                          height: 32,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `rgba(108, 99, 255, ${0.25 + (index * 0.1)})`,
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grow>
            </Grid>
          )}

          {/* Cálculos Recentes */}
          {stats.recentCalculations.length > 0 && (
            <Grid item xs={12} lg={6}>
              <Grow in timeout={1800}>
                <Paper
                  sx={{
                    background: 'rgba(30, 30, 47, 0.85)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 4,
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.4),
                      0 2px 8px rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    p: 3.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `
                        0 12px 40px rgba(0, 0, 0, 0.5),
                        0 4px 12px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15)
                      `
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#6C63FF',
                      fontWeight: 600,
                      mb: 3.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    <HistoryIcon sx={{ 
                      fontSize: 24,
                      filter: 'drop-shadow(0 2px 4px rgba(108, 99, 255, 0.3))'
                    }} />
                    Cálculos Recentes
                  </Typography>
                  
                  <List dense>
                    {stats.recentCalculations.slice(0, 3).map((calc, index) => (
                      <React.Fragment key={calc.id}>
                        <ListItem 
                          sx={{ 
                            px: 0,
                            py: 1.5,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(108, 99, 255, 0.05)',
                              borderRadius: 2,
                              px: 1
                            }
                          }}
                        >
                          <ListItemIcon>
                            <CheckIcon 
                              sx={{ 
                                color: '#00D2FF',
                                filter: 'drop-shadow(0 2px 4px rgba(0, 210, 255, 0.3))',
                                animation: 'pulse 2s ease-in-out infinite',
                                animationDelay: `${index * 0.5}s`
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#FFFFFF', 
                                  fontWeight: 500,
                                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                  fontFamily: '"Roboto Mono", monospace',
                                  fontSize: '0.9rem'
                                }}
                              >
                                lim x→{calc.limit} {calc.function}
                              </Typography>
                            }
                            secondary={
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#B8B8CC',
                                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                  fontWeight: 400
                                }}
                              >
                                Resultado: {calc.result} • {new Date(calc.timestamp).toLocaleDateString()}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < stats.recentCalculations.slice(0, 3).length - 1 && (
                          <Divider 
                            sx={{ 
                              borderColor: 'rgba(255, 255, 255, 0.1)', 
                              my: 1,
                              mx: 2
                            }} 
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grow>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
