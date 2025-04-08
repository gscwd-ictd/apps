import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  onDownloadProgress: function (progressEvent) {
    const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);

    if (percentComplete !== 100) {
      setInterval(() => console.log(percentComplete + '%'));
    } else {
      setTimeout(() => {
        console.log(percentComplete + '%');
        //     setLoading(false);
      }, 400);
    }
  },
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// axiosApi.interceptors.request.use(
//   (config) => {
//     this.$Progress.start();
//     return config;
//   }
// );
// axiosApi.interceptors.response.use(
//   (response) => {
//       this.$Progress.finish();
//       return Promise.resolve(response);
//   },
//   (error) => {
//       this.$Progress.finish();
//       return Promise.reject(error);
//   },
// );

const FetcherEMSwithProgress = async (url: string, config: AxiosRequestConfig) => {
  return await axiosApi
    .get(url, config)
    .then((res) => res)
    .catch((error) => {
      throw error;
    });
};

export default FetcherEMSwithProgress;
