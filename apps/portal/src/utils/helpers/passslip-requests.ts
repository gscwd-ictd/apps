import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSidePropsContext } from 'next';
import { CreatedPrf, Position, RequestedPosition } from '../../types/prf.types';
import { post } from './http-request';

const url = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL;

export const applyPassSlip = async (
  employeeId: string,
  dateOfApplication: string,
  natureOfBusiness: string,
  estimateHours: number,
  purposeDestination: string,
  obTransportation: string
) => {
  try {
    // const { data } = await axios.post(`${url}/v1/pass-slip`, {
    const { data } = await axios.post(
      `http://192.168.99.124:4104/api/v1/pass-slip`,
      {
        employeeId,
        dateOfApplication,
        natureOfBusiness,
        estimateHours,
        purposeDestination,
        isCancelled: false,
        obTransportation,
      }
    );
    return data;
  } catch (error) {
    return { error };
  }
};

export const getForApprovalPrfs = async (employeeId: string) => {
  const { data } = await axios.get(`${url}/prf-trail/employee/${employeeId}`);

  return data;
};

export const getPrfById = async (
  prfId: string,
  context: GetServerSidePropsContext
) => {
  const { data } = await axios.get(`${url}/prf/details/${prfId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  return data;
};

export const getPrfTrailByPrfId = async (
  prfId: string,
  context: GetServerSidePropsContext
) => {
  const { data } = await axios.get(`${url}/prf-trail/${prfId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  return data;
};

export const approvePrf = async (
  prfId: string,
  status: string,
  employeeId: string,
  remarks: string
) => {
  const { data } = await axios.patch(`${url}/prf-trail/${prfId}`, {
    status,
    employeeId,
    remarks,
  });

  return data;
};

export const savePrf = async (prfData: CreatedPrf) =>
  await post(`${url}/prf`, prfData);

export const createPrf = (
  selectedPositions: Array<Position>,
  withExam: boolean,
  employeeId: string
) => {
  // create an empty array that will hold all requested positions
  const requestedPositions: Array<RequestedPosition> = [];

  // loop through all selected positions
  selectedPositions.forEach((position: Position) => {
    // remove unnecesary fields from selected positions
    const trimmedData = (({
      designation,
      sequenceNo,
      itemNumber,
      positionTitle,
      isSelected,
      ...rest
    }) => rest)(position);

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
