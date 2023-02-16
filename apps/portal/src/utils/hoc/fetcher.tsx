import axios from 'axios';

// use this to fetch data using session
// export const getWithSession = (url: string) => axios(url, { withCredentials: true }).then((res: any) => res.data);

export const fetchWithSession = async (url: string) => {
  try {
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    return error;
  }
};

// use this to fetch data using token
export const fetchWithToken = (url: string, token: string) =>
  axios({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res: any) => res.data)
    .catch((error) => console.log(error));
