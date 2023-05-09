/* eslint-disable @nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { DutyResponsibility } from 'apps/portal/src/types/dr.type';

export const DrcAllDrcsList = (): JSX.Element => {
  const {
    availableDnrs,
    checkedDnrs,
    filteredAvailableDnrs,
    selectedDrcType,
    setFilteredAvailableDnrs,
    setAvailableDnrs,
    setCheckedDnrs,
    setFilteredDnrValue,
  } = useDnrStore((state) => ({
    availableDnrs: state.availableDnrs,
    filteredAvailableDnrs: state.filteredAvailableDnrs,
    checkedDnrs: state.checkedDnrs,
    selectedDrcType: state.selectedDrcType,
    setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
    setAvailableDnrs: state.setAvailableDnrs,
    setCheckedDnrs: state.setCheckedDnrs,
    setFilteredDnrValue: state.setFilteredDnrValue,
  }));

  const onSelect = (sequenceNo: number | undefined) => {
    // copy the current state of drs
    const updatedDnrs: Array<DutyResponsibility> = [...availableDnrs];

    // loop through all core drs
    updatedDnrs.map((dr, drIndex: number) => {
      // check if a particular dr's index is selected
      if (sequenceNo === drIndex) {
        // reverse the current value of the dr state
        dr.state = !dr.state;
      }
    });

    const tempCheckedDnrs: Array<DutyResponsibility> = [];

    // loop to push to temporary array where state is true
    updatedDnrs.map((dr) => {
      if (dr.state === true) tempCheckedDnrs.push(dr);
    });

    // set selected core drs state depending on type prop
    if (selectedDrcType === 'core')
      setCheckedDnrs({ ...checkedDnrs, core: tempCheckedDnrs });
    else if (selectedDrcType === 'support')
      setCheckedDnrs({ ...checkedDnrs, support: tempCheckedDnrs });

    // set drs state
    //! Removed recently
    setAvailableDnrs(updatedDnrs);

    setFilteredAvailableDnrs(updatedDnrs);

    setFilteredDnrValue('');
  };

  return (
    <>
      <ul className="">
        {filteredAvailableDnrs.length > 0 &&
          filteredAvailableDnrs.map((dr: DutyResponsibility, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(dr.sequenceNo)}
                className="flex cursor-pointer items-center justify-between border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <p className="font-normal text-md text-gray-600 truncate w-[24rem]">
                    {dr.description}
                  </p>
                </div>
                <input
                  checked={dr.state ? true : false}
                  onChange={() => (dr: DutyResponsibility) =>
                    onSelect(dr.sequenceNo)}
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
