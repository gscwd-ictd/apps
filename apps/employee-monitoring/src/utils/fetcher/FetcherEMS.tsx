import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_DOMAIN;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const fetcherEMS = async (url: string, config: AxiosRequestConfig) => {
  return await axiosApi
    .get(url, config)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export default fetcherEMS;
