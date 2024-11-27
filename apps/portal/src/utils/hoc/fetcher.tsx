import axios from 'axios';

// use this to fetch data using session
// export const getWithSession = (url: string) => axios(url, { withCredentials: true }).then((res: any) => res.data);
const axiosApi = axios.create({
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const fetchWithSession = async (url: string) => {
  try {
    const { data } = await axiosApi.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    return error;
  }
};

// use this to fetch data using token
export const fetchWithToken = (url: string, token: string) =>
  axiosApi({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }).then((res: any) => res.data);
