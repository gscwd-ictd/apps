import axios, { AxiosRequestConfig } from 'axios';

// export const axiosFetcher = (url: string) =>
//   axios.get(url, { withCredentials: true }).then((res) => res.data);

const API_URL = process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const fetcherHRMS = async (url: string, config: AxiosRequestConfig) => {
  return await axiosApi
    .get(url, config)
    .then((res) => res)
    .catch((error) => {
      throw error;
    });
};

export default fetcherHRMS;
