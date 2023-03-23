import { useDrStore } from '../../../store/dr.store';
import { DutyResponsibility } from '../../../types/dr.type';

type AllDRsListProps = {
  type: string;
};

export const AllDRsList = ({ type }: AllDRsListProps): JSX.Element => {
  // get all related state from dr context
  const allDRCPool = useDrStore((state) => state.allDRCPool);

  const checkedDRCs = useDrStore((state) => state.checkedDRCs);

  const filteredDRCs = useDrStore((state) => state.filteredDRCs);

  const setFilteredDRCs = useDrStore((state) => state.setFilteredDRCs);

  const setAllDRCPool = useDrStore((state) => state.setAllDRCPool);

  const setSelectedDRCs = useDrStore((state) => state.setSelectedDRCs);

  const setCheckedDRCs = useDrStore((state) => state.setCheckedDRCs);

  const setError = useDrStore((state) => state.setError);

  const onSelect = (sequenceNo: number | undefined) => {
    // copy the current state of drs
    const updatedDRs: Array<DutyResponsibility> = [...allDRCPool];

    // loop through all core drs
    updatedDRs.map((dr, drIndex: number) => {
      // check if a particular dr's index is selected
      if (sequenceNo === drIndex) {
        // reverse the current value of the dr state
        dr.state = !dr.state;
      }
    });

    const tempCheckedDRs: Array<DutyResponsibility> = [];

    // loop to push to temporary array where state is true
    updatedDRs.map((dr) => {
      if (dr.state === true) tempCheckedDRs.push(dr);
    });

    // set selected core drs state depending on type prop
    if (type === 'core')
      setCheckedDRCs({ ...checkedDRCs, core: tempCheckedDRs });
    else if (type === 'support')
      setCheckedDRCs({ ...checkedDRCs, support: tempCheckedDRs });

    // set drs state
    //! Removed recently
    setAllDRCPool(updatedDRs);

    setFilteredDRCs(updatedDRs);

    // select this dr if it is checked
    // addToCheckedDRs();
  };

  return (
    <>
      <ul className="">
        {filteredDRCs.length > 0 &&
          filteredDRCs.map((dr: DutyResponsibility, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(dr.sequenceNo)}
                className="flex cursor-pointer items-center justify-between border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <p className="font-medium text-gray-600 truncate w-[24rem]">
                    {dr.description}
                  </p>
                </div>
                <input
                  checked={dr.state ? true : false}
                  onChange={() => (dr: DutyResponsibility) => {
                    // dr.state;

                    setError({ isError: false, errorMessage: '' });

                    onSelect(dr.sequenceNo);
                  }}
                  //! Changed from index to dr.sequenceNo
                  // onChange={() => onSelect(dr.sequenceNo, dr)}
                  className="p-2 mr-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
                  type="checkbox"
                />
              </li>
            );
          })}
      </ul>
    </>
  );
};
