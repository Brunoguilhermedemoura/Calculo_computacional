/**
 * Componente de gráfico simples usando Chart.js como fallback
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SimpleChart = ({ data, title = 'Gráfico' }) => {
  // Filtra pontos válidos (não nulos e finitos)
  const validPoints = data?.x?.map((x, i) => ({ x, y: data?.y?.[i] }))
    .filter(point => point.y !== null && isFinite(point.y)) || [];
  
  const chartData = {
    labels: validPoints.map(p => p.x.toFixed(2)),
    datasets: [
      {
        label: data?.name || 'Função',
        data: validPoints.map(p => p.y),
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        borderWidth: 4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6C63FF',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#B8B8CC',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#FFFFFF',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(184, 184, 204, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: '#B8B8CC',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'x',
          color: '#B8B8CC',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(184, 184, 204, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: '#B8B8CC',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'f(x)',
          color: '#B8B8CC',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '450px',
      maxHeight: '600px'
    }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default SimpleChart;
