import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

// use this to fetch data using session
// export const fetchWithSession = (url: string) => axios(url, { withCredentials: true }).then((res: any) => res.data);

// export const fetchWithSession = async (url: string) => {
//     try {

//         const { data } = await axios.get(url, { withCredentials: true })

//         return data

//     } catch (error) {

//         console.log(error)
//     }
// }

export const fetchWithSession = async (url: string) => {
  try {
    const { data } = await axios({
      method: 'GET',
      url,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    //
  }
};

// use this to fetch data using token
export const fetchWithToken = async (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  token: string
) => {
  const { data } = await axios({
    method,
    url,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const serverSideFetch = async (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  context: GetServerSidePropsContext
) => {
  try {
    const { data } = await axios({
      method,
      url,
      headers: { Cookies: `${context.req.headers.cookie}` },
    });

    return data;
  } catch (error) {
    //
  }
};
