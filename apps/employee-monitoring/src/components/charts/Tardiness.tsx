import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const TardinessChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: [
        'OGM',
        'HRD',
        'GSPMMD',
        'ICTD',
        'AFMD',
        'CSD',
        'PSD',
        'PAMD',
        'ECD',
      ],
      datasets: [
        {
          label: 'Male',
          data: [12, 2, 15, 4, 7, 4, 1, 6, 9],
          borderColor: 'rgb(77, 164, 218)',
          backgroundColor: 'rgba(77, 164, 218,0.95)',
        },
        {
          label: 'Female',
          data: [5, 8, 14, 1, 6, 1, 1, 2, 3],
          borderColor: 'rgb(231, 100, 100)',
          backgroundColor: 'rgba(231, 100, 100, 0.95)',
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Tardiness Data (Today) `,
        },
      },
    });
  }, []);

  return (
    <div className="flex justify-center w-full p-5 bg-white border rounded shadow">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};
