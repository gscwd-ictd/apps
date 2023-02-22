import { Dispatch, SetStateAction } from 'react';
import { Employee } from './data';

export type EmployeeState = {
  employee: Employee;
  setEmployee: Dispatch<SetStateAction<Employee>>;
};





