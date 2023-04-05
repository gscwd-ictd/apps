import { type } from 'os';
import { EmployeeAsOption } from './employee.type';

export type TravelOrder = {
  id: string;
  employee: EmployeeAsOption;
  travelOrderNo: string;
  purposeOfTravel: string;
  dateRequested: string;
  itineraryOfTravel: Array<Itinerary>;
};

export type Itinerary = {
  id?: string;
  scheduledDate: string;
  scheduledPlace: string;
};

export type TravelOrderForm = Omit<TravelOrder, 'employee'> & {
  employeeId: string;
};

export type TravelOrderId = Pick<TravelOrder, 'id'>;
