import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const Dashboard: React.FC = () => {
  const data = { labels: ['Task 1'], datasets: [{ label: 'Score', data: [100] }] };
  return <div><h2>Dashboard</h2><Bar data={data} /></div>;
};
