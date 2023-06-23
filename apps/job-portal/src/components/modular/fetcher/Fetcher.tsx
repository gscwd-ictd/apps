import axios, { AxiosRequestConfig } from 'axios'

//const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const axiosFetcher = (url: string) => axios.get(url, { withCredentials: true }).then((res) => res.data)

const fetcher = async (url: string, config: AxiosRequestConfig) =>
  await axios
    .get(url, config)
    .then((res) => res)
    .catch((error) => error)

export async function testFetcher<T>(url: string, config: AxiosRequestConfig<T>) {
  return await axios
    .get(url, config)
    .then((res) => res)
    .catch((error) => error)
}

export default fetcher
