import axios, { AxiosRequestConfig } from 'axios';

export const axiosFetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const fetcher = async (url: string, config: AxiosRequestConfig) =>
  await axios
    .get(url, config)
    .then((res) => res)
    .catch((error) => error);
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default fetcher;
