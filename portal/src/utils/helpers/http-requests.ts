import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

export class HttpRequest {
  static async getWithSession(url: string) {
    return await (
      await axios(url, { withCredentials: true })
    ).data;
  }

  static async getWithToken(url: string, token: string) {
    return await axios({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res: any) => res.data)
      .catch((error) => console.log(error));
  }

  static async post(url: string, data: any) {
    try {
      const result = await axiosInstance({
        method: 'POST',
        url,
        data,
      });

      return { error: false, result: result.data };
    } catch (error: any) {
      // check if you can connect with the backend server
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      // return the error sent by the backend server
      return { error: true, result: error.response.data.message };
    }
  }
}
