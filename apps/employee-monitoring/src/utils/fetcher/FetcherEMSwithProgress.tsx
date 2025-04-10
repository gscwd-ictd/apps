import axios, { AxiosRequestConfig } from 'axios';
import { UseLoadingProgressStore } from '../../store/loading.store';

const fetcherEMSwithProgress = async (url: string, config: AxiosRequestConfig) => {
  const API_URL = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN;

  const axiosApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    // onDownloadProgress: function (progressEvent) {
    //   const percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);

    //   if (percentComplete === 100) {
    //     setLoadingProgress(percentComplete);
    //     console.log(percentComplete + '%');
    //   } else {
    //     setInterval(function () {
    //       setLoadingProgress(percentComplete);
    //       console.log(percentComplete + '%');
    //     }, 5000);
    //   }
    // },
  });

  axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  // const { setLoadingProgress } = UseLoadingProgressStore((state) => ({
  //   setLoadingProgress: state.setLoadingProgress,
  // }));

  return await axiosApi
    .get(url, config)
    .then((res) => res)
    .catch((error) => {
      throw error;
    });
};

export default fetcherEMSwithProgress;
