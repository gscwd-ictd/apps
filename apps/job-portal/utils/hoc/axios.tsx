import axios from 'axios'

const axiosInstance = axios.create({
  withCredentials: true,
})

export async function postData(url: string, data: any, timeout?: number) {
  timeout = 0
  try {
    const result = await axiosInstance({
      method: 'POST',
      url,
      data,
      timeout,
    })

    return { error: false, result: result.data }
  } catch (error: any) {
    return { error: true, result: error.response.data.message }
  }
}

export async function putData(url: string, data: any) {
  try {
    const result = await axiosInstance({
      method: 'PUT',
      url,
      data,
    })
    return { error: false, result: result.data }
  } catch (error: any) {
    return { error: true, result: error.response.data.message }
  }
}
