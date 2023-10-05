import { EmployeeAsOption } from './employee.type';

export type TravelOrder = {
  id: string;
  employee: EmployeeAsOption;
  employeeId: string;
  travelOrderNo: string;
  purposeOfTravel: string;
  dateFrom: string;
  dateTo: string;
  itinerary: Array<Itinerary>;
  dateRequested: string;
};

export type Itinerary = {
  id?: string;
  scheduleDate: string;
  schedulePlace: string;
};

// export type TravelOrderForm = TravelOrder & {
//   deleted?: Array<string>;
// };

export type TravelOrderId = Pick<TravelOrder, 'id'>;
