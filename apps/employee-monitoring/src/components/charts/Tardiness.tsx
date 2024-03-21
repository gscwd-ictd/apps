/* eslint-disable react-hooks/exhaustive-deps */
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
import useSWR from 'swr';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import { useChartsStore } from '../../store/chart.store';
import { ToastNotification } from '@gscwd-apps/oneui';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend);

export const TardinessChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  // fetch data for tardiness chart
  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
  } = useSWR('/stats/lates/department', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 5 times.
      if (retryCount >= 5) return;

      // Retry after 15 seconds.
      setTimeout(() => revalidate({ retryCount }), 15000);
    },
  });

  // zustand initialization
  const { GetTardinessChartData, SetGetTardinessChartData, ErrorTardinessChartData, SetErrorTardinessChartData } =
    useChartsStore((state) => ({
      GetTardinessChartData: state.getTardinessChartData,
      SetGetTardinessChartData: state.setGetTardinessChartData,

      ErrorTardinessChartData: state.errorTardinessChartData,
      SetErrorTardinessChartData: state.setErrorTardinessChartData,
    }));

  // store data to zustand store
  useEffect(() => {
    // success
    if (!isEmpty(swrData)) SetGetTardinessChartData(swrData.data);

    // fail
    if (!isEmpty(swrError)) SetErrorTardinessChartData(swrError.message);
  }, [swrData, swrError]);

  useEffect(() => {
    if (!isEmpty(GetTardinessChartData)) {
      setChartData({
        labels: GetTardinessChartData.labels,
        datasets: [
          {
            label: 'Late/s',
            data: GetTardinessChartData.data,
            borderColor: 'rgb(77, 164, 218)',
            backgroundColor: 'rgba(77, 164, 218,0.95)',
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
            text: `Tardiness Data (Monthly) `,
          },
        },
      });
    } else {
      setChartData({
        labels: [],
        datasets: [
          {
            label: 'Late/s',
            data: [],
            borderColor: 'rgb(77, 164, 218)',
            backgroundColor: 'rgba(77, 164, 218,0.95)',
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
            text: `Tardiness Data (Monthly) `,
          },
        },
      });
    }
  }, [GetTardinessChartData]);

  return (
    <>
    {/*  Notifications */}
    {!isEmpty(ErrorTardinessChartData) ? (
        <ToastNotification toastType="error" notifMessage={ErrorTardinessChartData} />
      ) : null}

    <div className="flex justify-center w-full p-5 bg-white border rounded shadow">
      <Bar options={chartOptions} data={chartData} />
    </div>
    </>
    
  );
};
