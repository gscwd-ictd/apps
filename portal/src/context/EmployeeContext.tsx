import { ReactNode, useState } from 'react';
import { Employee } from '../utils/types/data';
import { EmployeeContext } from './contexts';

type EmployeeProviderProps = {
  children: ReactNode;
  employeeData: Employee;
};

// define employee provider
export const EmployeeProvider = ({ children, employeeData }: EmployeeProviderProps): JSX.Element => {
  // employee state
  const [employee, setEmployee] = useState(employeeData);

  return (
    <>
      <EmployeeContext.Provider value={{ employee, setEmployee }}>{children}</EmployeeContext.Provider>
    </>
  );
};
