import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSidePropsContext } from 'next';
import { CreatedPrf, Position, RequestedPosition } from '../../types/prf.types';
import { post } from '../../utils/helpers/http-request';

const API_URL = process.env.NEXT_PUBLIC_HRIS_URL;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getPendingPrfs = async (employeeId: string) => {
  const { data } = await axios.get(`${API_URL}/prf/${employeeId}?status=pending`);

  return data;
};

export const getDisapprovedPrfs = async (employeeId: string) => {
  const { data } = await axios.get(`${API_URL}/prf/${employeeId}?status=disapproved`);

  return data;
};

export const getForApprovalPrfs = async (employeeId: string) => {
  const { data } = await axios.get(`${API_URL}/prf-trail/employee/${employeeId}`);

  return data;
};

export const getPrfById = async (prfId: string, context: GetServerSidePropsContext) => {
  const { data } = await axios.get(`${API_URL}/prf/details/${prfId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  return data;
};

export const getPrfTrailByPrfId = async (prfId: string, context: GetServerSidePropsContext) => {
  const { data } = await axios.get(`${API_URL}/prf-trail/${prfId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  return data;
};

//old prf patch
// export const approvePrf = async (
//   prfId: string,
//   status: string,
//   employeeId: string,
//   remarks: string
// ) => {
//   const { data } = await axios.patch(`${API_URL}/prf-trail/${prfId}`, {
//     status,
//     employeeId,
//     remarks,
//   });

//   return data;
// };

//new prf patch with zustand endpoint
export const patchPrfRequest = async (url: string, data: any, config = {}) =>
  await axiosApi
    .patch(url, { ...data }, { ...config })
    .then((response) => {
      return { error: false, result: response.data };
    })
    .catch((error) => {
      if (error.message === 'Network Error') return { error: true, result: `Cannot connect to the server.` };

      return { error: true, result: error.response.data.message };
    });

export const savePrf = async (prfData: CreatedPrf) => await post(`${API_URL}/prf`, prfData);

export const createPrf = (selectedPositions: Array<Position>, withExam: boolean, employeeId: string) => {
  // create an empty array that will hold all requested positions
  const requestedPositions: Array<RequestedPosition> = [];

  // loop through all selected positions
  selectedPositions.forEach((position: Position) => {
    // remove unnecesary fields from selected positions
    const trimmedData = (({ designation, sequenceNo, itemNumber, positionTitle, isSelected, ...rest }) => rest)(
      position
    );

    // insert the trimmed object to requested positions array
    requestedPositions.push(trimmedData);
  });

  // return as newly created prf
  return {
    status: 'Pending',
    employeeId,
    dateRequested: dayjs().format('YYYY-MM-DD'),
    withExam,
    prfPositions: requestedPositions,
  };
};
