import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

export async function postData(url: string, data: any) {
  try {
    const result = await axiosInstance({
      method: 'POST',
      url,
      data,
    });

    return { error: false, result: result.data };
  } catch (error: any) {
    console.log(error);
    // check if you can connect with the backend server
    if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

    // return the error sent by the backend server
    return { error: true, result: error.response.data.message };
  }
}


export async function patchData(url: string, data: any) {
  try {
    const result = await axiosInstance({
      method: 'PATCH',
      url,
      data
    });

    return { error: false, result: result.data }
  }
  catch (error: any) {
    console.log(error);
    // check if you can connect with the backend server
    if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

    // return the error sent by the backend server
    return { error: true, result: error.response.data.message };
  }
}