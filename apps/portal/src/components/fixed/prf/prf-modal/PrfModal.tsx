import { FunctionComponent, useEffect } from 'react';
import useSWR from 'swr';
// import { orgPos } from '../mock/data';
import { usePrfStore } from '../../../../store/prf.store';
import { getWithToken } from '../../../../utils/helpers/http-request';
import { PositionsList } from './PositionsList';
import { RequestSummary } from './RequestSummary';
import { SelectedPositions } from './SelectedPositions';
import { useEmployeeStore } from '../../../../../src/store/employee.store';

// base url for HRIS service
const url = `${process.env.NEXT_PUBLIC_HRIS_URL}`;

export const PrfModal: FunctionComponent = () => {
  // access employee details
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // const profile = useEmployeeStore((state) => state.employeeDetails.profile);

  // access modal page from store
  const modalPage = usePrfStore((state) => state.modalPage);

  // access function to set positions in the store
  const setPositions = usePrfStore((state) => state.setPositions);

  // access function to set filtered positions in the store
  const setFilteredPositions = usePrfStore(
    (state) => state.setFilteredPositions
  );

  // query positions data from hrms api
  //route is for fetching positions for request to the manager
  const { data } = useSWR(
    `${url}/organizational-positions/${employee.employmentDetails.assignment.id}/${employee.user._id}`,
    getWithToken
  );

  //const data = orgPos;

  // set initial value for positions
  useEffect(() => {
    if (data) {
      // set initial values for positions
      setPositions(data.positions);

      // set initial values for filtered positions
      setFilteredPositions(data.positions);
    }
  }, [data]);

  return (
    <>
      {modalPage === 1 && (
        <div className="flex-col lg:flex-row flex h-full">
          <section className="w-full py-2 lg:py-0 lg:w-[70%]">
            <PositionsList />
          </section>

          <section className="w-full ">
            <SelectedPositions />
          </section>
        </div>
      )}

      {modalPage == 2 && <RequestSummary />}
    </>
  );
};
