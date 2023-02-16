import dayjs from 'dayjs';
import { useContext } from 'react';
import { HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';
import { PrfContext } from '../../../context/contexts';
import { SelectedPositionsTable } from './SelectedPositionsTable';

type PositionRemarksProps = {
  selectedPositions: any;
};

export const PrfModalSummary = ({ selectedPositions }: PositionRemarksProps): JSX.Element => {
  const { prfDetails } = useContext(PrfContext);
  if (selectedPositions.length === 0) return <>Empty!</>;

  return (
    <div className="rounded h-[35.3rem]">
      <div className="pt-5 mb-8">
        <div className="flex items-center gap-3 text-gray-600">
          <HiOutlineCalendar className="w-5 h-5" />
          <p className="mt-1 font-medium">Needed on {dayjs(prfDetails.dateNeeded).format('MMMM DD, YYYY')}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-gray-600">
          <HiOutlinePencil className="w-5 h-5" />
          {prfDetails.isExamRequired ? (
            <p className="font-medium text-indigo-500">Examination is required</p>
          ) : (
            <p className="font-medium text-orange-500">No examination required</p>
          )}
        </div>
      </div>

      <div className="h-[25rem] overflow-y-auto">
        <SelectedPositionsTable selectedPositions={selectedPositions} displayType="summary" />
      </div>
    </div>
  );
};
