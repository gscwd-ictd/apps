import axios from 'axios';
import { PassSlip } from '../../types/passslip.type';

const url = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL;

export const applyPassSlip = async (data: PassSlip) => {
  try {
    // const { data } = await axios.post(`${url}/v1/pass-slip`, {
    const response = await axios.post(
      `http://192.168.99.124:4104/api/v1/pass-slip`,
      data
    );
    return response;
  } catch (error) {
    return { error };
  }
};

export const getEmployeePassSlips = async (employeeId: string) => {
  try {
    // const { data } = await axios.post(`${url}/v1/pass-slip`, {
    const { data } = await axios.get(
      `http://192.168.99.124:4104/api/v1/pass-slip/${employeeId}`
    );
    return data;
  } catch (error) {
    return { error };
  }
};
