import { CardEmployee } from '../components/cards/CardEmployee';
import { PendingDashboard } from '../components/layouts/PendingDashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Index() {
  /*

  
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ['Allyn', 'Eric', 'Rani', 'Ricardo', 'Alexis', 'Elea', 'Mikhail'],
      datasets: [
        {
          label: 'Who let the dogs out',
          data: [455, 55, 354, 720, 120, 20, 385],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(1, 54, 119, 0.378)',
        },
        {
          label: 'Who let the cats out',
          data: [12, 255, 247, 240, 120, 420, 775],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(1, 119, 38, 0.378)',
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Serious Question',
        },
      },
    });
  }, []);

  return (
    <div className="w-full h-full ">
      <div className="flex justify-center w-full h-full">
        <div className="flex flex-col w-full gap-5 px-5 ">
          <div className="flex w-full gap-5">
            <CardEmployee />
            <PendingDashboard />
          </div>
          <div className="w-[44rem] flex justify-center p-5 bg-white border-none">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
