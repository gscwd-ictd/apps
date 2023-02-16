import { createContext, useContext, useEffect } from 'react';
import { PrfModalSelectPositions } from './PrfModalSelectPositions';
import { PrfModalSummary } from './PrfModalSummary';
import { fetchWithToken } from '../../../../utils/hoc/fetcher';
import { PrfModalLoading } from './PrfModalLoading';
import useSWR from 'swr';
import { EmployeeContext, PrfContext } from '../../../context/contexts';
import { useRouter } from 'next/router';
import { employee } from '../../../../utils/constants/data';
import { Position } from '../../../types/position.type';
import { PositionRequest } from '../../../types/prf.type';

type PrfModalControllerProps = {
  page: number;
  action: 'create' | 'update';
};

export const ModalInitialLoadState = createContext(false);

export const PrfModalController = ({ page, action }: PrfModalControllerProps): JSX.Element => {
  // get employee data from employee context
  // const { employee } = useContext(EmployeeContext);

  const { employee } = useContext(EmployeeContext);

  // get position data from prf context
  const { selectedPositions, setAllPositions, setFilteredPositions, allPositions } = useContext<PositionRequest>(PrfContext);

  // url for querying position details from HRIS
  const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/organizational-positions/${employee.employmentDetails.assignment.id}`;

  // mock url
  const mockUrl = 'http://192.168.1.84:2000/positions';

  // query positions data from HRIS using access token
  const { data } = useSWR(`${prodUrl}`, fetchWithToken);

  // handle component mount
  useEffect(() => {
    if (data) {
      console.log(`PRF:`, data);
      // copy positions from query result
      var newPositions = [...data.positions.sort((a: Position, b: Position) => a.positionTitle!.localeCompare(b.positionTitle!))];

      // loop through all positions
      newPositions.map((position: Position, index: number) => {
        if (action === 'create') {
          // set default value for selected state into false -> this is the basis for the checkbox
          position.state = false;

          // set default value for position remarks to empty string
          position.remarks = '';

          // set the sequence number of this position to the current index
          position.sequenceNo = index;
        }
      });

      // set all positions state -> sort alphabetically by position title
      setAllPositions(newPositions);

      setFilteredPositions(newPositions);
    }
  }, [data]);

  // check if positions data is available
  if (!data) return <PrfModalLoading />;

  return (
    <div>
      <>
        {/* {page === 1 && <PrfType />} */}
        {page === 1 && <PrfModalSelectPositions allPositions={allPositions} />}
        {page === 2 && <PrfModalSummary selectedPositions={selectedPositions} />}
      </>
    </div>
  );
};
