/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// GET
export const getHRMS = async (url: string, config = {}) =>
  await axiosApi
    .get(url, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });

// POST
export const postHRMS = async (url: string, data: any, config = {}) =>
  await axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });

// PUT
export const putHRMS = async (url: string, data: any, config = {}) =>
  await axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });

// PATCH
export const patchHRMS = async (url: string, data: any, config = {}) =>
  await axiosApi
    .patch(url, { ...data }, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });

// DELETE
export const deleteHRMS = async (url: string, config = {}) =>
  await axiosApi
    .delete(url, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });
