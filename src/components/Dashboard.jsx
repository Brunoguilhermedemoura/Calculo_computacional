/**
 * Dashboard do usuário
 * Tela intermediária com estatísticas e acesso à calculadora
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
  Divider
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

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card
      sx={{
        background: 'rgba(30, 30, 47, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Typography
          variant="h3"
          sx={{
            color: color,
            fontWeight: 700,
            mb: 1
          }}
        >
          {value}
        </Typography>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#00D2FF', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: '#00D2FF' }}>
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%)',
          padding: 2
        }}
      >
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%)',
        padding: 0,
        position: 'relative'
      }}
    >
      {/* Background decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 209, 102, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(30, 30, 47, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: 0,
          p: 3,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                {getGreeting()}, {user.name.split(' ')[0]}!
              </Typography>
              <Typography variant="body1" sx={{ color: '#B8B8CC' }}>
                Pronto para calcular alguns limites?
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Sair">
              <IconButton
                onClick={onLogout}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Conteúdo Principal */}
      <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Estatísticas Principais */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              sx={{
                color: '#6C63FF',
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <BarChartIcon />
              Suas Estatísticas
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total de Cálculos"
                  value={stats.totalCalculations}
                  icon={<CalculateIcon />}
                  color="#6C63FF"
                  subtitle="Limites resolvidos"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Complexidade Média"
                  value={stats.averageComplexity}
                  icon={<SpeedIcon />}
                  color="#00D2FF"
                  subtitle="Passos por cálculo"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Estratégias Usadas"
                  value={stats.mostUsedStrategies.length}
                  icon={<FunctionsIcon />}
                  color="#FFD166"
                  subtitle="Diferentes métodos"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Última Atividade"
                  value={stats.lastCalculation ? 'Hoje' : 'Nunca'}
                  icon={<TimelineIcon />}
                  color="#FF6B6B"
                  subtitle={stats.lastCalculation ? 'Cálculo recente' : 'Primeira vez'}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Ação Principal */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                background: 'rgba(30, 30, 47, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                p: 4,
                textAlign: 'center',
                height: 'fit-content'
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)'
                }}
              >
                <CalculateIcon sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography
                variant="h5"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Começar a Calcular
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#B8B8CC',
                  mb: 4,
                  lineHeight: 1.6
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
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Iniciar Cálculo
              </Button>
              
              <Typography variant="caption" sx={{ color: '#8B8B9E' }}>
                Seus cálculos serão salvos automaticamente
              </Typography>
            </Paper>
          </Grid>

          {/* Estratégias Mais Usadas */}
          {stats.mostUsedStrategies.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  background: 'rgba(30, 30, 47, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  p: 3
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6C63FF',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <FunctionsIcon />
                  Estratégias Mais Usadas
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {stats.mostUsedStrategies.slice(0, 5).map((strategy, index) => (
                    <Chip
                      key={strategy.strategy}
                      label={`${strategy.strategy} (${strategy.count})`}
                      sx={{
                        background: `rgba(108, 99, 255, ${0.1 + (index * 0.1)})`,
                        color: '#6C63FF',
                        border: '1px solid rgba(108, 99, 255, 0.3)',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Cálculos Recentes */}
          {stats.recentCalculations.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  background: 'rgba(30, 30, 47, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  p: 3
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6C63FF',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <HistoryIcon />
                  Cálculos Recentes
                </Typography>
                
                <List dense>
                  {stats.recentCalculations.slice(0, 3).map((calc, index) => (
                    <React.Fragment key={calc.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: '#00D2FF' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                              lim x→{calc.limit} {calc.function}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: '#B8B8CC' }}>
                              Resultado: {calc.result} • {new Date(calc.timestamp).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < stats.recentCalculations.slice(0, 3).length - 1 && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
