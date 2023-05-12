import { EmployeeAsOption } from './employee.type';

export type TravelOrder = {
  id: string;
  employee: EmployeeAsOption;
  // employeeId: string;
  travelOrderNo: string;
  purposeOfTravel: string;
  dateFrom: string;
  dateTo: string;
  itinerary: Array<Itinerary>;
  dateRequested: string;
  isPtrRequired: boolean;
};

export type Itinerary = {
  id?: string;
  scheduleDate: string;
  schedulePlace: string;
};

export type TravelOrderForm = Omit<TravelOrder, 'employee'> & {
  employeeId: string;
  deleted?: Array<string>;
};

export type TravelOrderId = Pick<TravelOrder, 'id'>;
