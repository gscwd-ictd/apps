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

  const onSelect = (sequenceNo: number | undefined, drId: string) => {
    // initialize currently selected drc
    let tempSelectedDr: DutyResponsibility = {} as DutyResponsibility;

    // copy the current state of drcs
    const updatedDnrs: Array<DutyResponsibility> = [...availableDnrs];

    // temporary checked drcs
    const tempCheckedDnrs: Array<DutyResponsibility> = [];

    // loop through all core drs
    updatedDnrs.map((dr, drIndex: number) => {
      // get the current list of checked drcs based on state from available drcs
      if (dr.state === true)
        tempCheckedDnrs.push({ ...dr, sequenceNo: drIndex });

      // check if a particular drc's index is selected
      if (sequenceNo === drIndex) {
        // reverse the current value of the dr state
        // dr.state = !dr.state;

        //! 07/10/2023 instead of reversing state of the element, get the element and set the state to the reversed state value
        tempSelectedDr = { ...dr, state: !dr.state };
      }
    });

    // loop to push to temporary array where state is true
    updatedDnrs.map((dr, drIndex: number) => {
      // if (dr.state === true) tempCheckedDnrs.push(dr);
      // check if a particular drc's index is selected
      if (sequenceNo === drIndex) {
        // reverse the current value of the dr state
        dr.state = !dr.state;
      }
    });

    // set selected core drs state depending on type prop
    if (selectedDrcType === 'core') {
      //! previous code
      // setCheckedDnrs({ ...checkedDnrs, core: tempCheckedDnrs });

      // set a copy of checked core drcs
      const finalCheckedCoreDnrs = [...checkedDnrs.core];

      if (tempSelectedDr.state === true) {
        // push the element
        finalCheckedCoreDnrs.push({
          ...tempSelectedDr,
          sequenceNo:
            checkedDnrs.core.length === 0 ? 0 : checkedDnrs.core.length,
        });

        // set the final core array
        setCheckedDnrs({
          ...checkedDnrs,
          core: finalCheckedCoreDnrs,
        });
      } else if (tempSelectedDr.state === false) {
        // splice the element
        const removedFinalCheckedCoreDnrs = finalCheckedCoreDnrs.filter(
          (e) => e.drId !== drId
        );

        // set the final core array
        setCheckedDnrs({
          ...checkedDnrs,
          core: removedFinalCheckedCoreDnrs,
        });
      }
    } else if (selectedDrcType === 'support') {
      //! previous code
      // setCheckedDnrs({ ...checkedDnrs, support: tempCheckedDnrs });

      // set a copy of checked support drcs
      const finalCheckedSupportDnrs = [...checkedDnrs.support];

      // // push the element
      // finalCheckedSupportDnrs.push({
      //   ...tempSelectedDr,
      //   sequenceNo:
      //     checkedDnrs.support.length === 0 ? 0 : checkedDnrs.support.length - 1,
      // });

      // // set the final support array
      // setCheckedDnrs({ ...checkedDnrs, support: finalCheckedSupportDnrs });
      if (tempSelectedDr.state === true) {
        // push the element
        finalCheckedSupportDnrs.push({
          ...tempSelectedDr,
          sequenceNo:
            checkedDnrs.support.length === 0 ? 0 : checkedDnrs.support.length,
        });

        // set the final support array
        setCheckedDnrs({
          ...checkedDnrs,
          support: finalCheckedSupportDnrs,
        });
      } else if (tempSelectedDr.state === false) {
        // splice the element
        const removedFinalCheckedSupportDnrs = finalCheckedSupportDnrs.filter(
          (e) => e.drId !== drId
        );

        // set the final core array
        setCheckedDnrs({
          ...checkedDnrs,
          support: removedFinalCheckedSupportDnrs,
        });
      }
    }

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
                onClick={() => onSelect(dr.sequenceNo, dr.drId)}
                // className="flex cursor-pointer items-center justify-start lg:justify-between border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
                className="flex grid-cols-2 items-center w-full cursor-pointer border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div className="flex justify-start w-[90%]">
                  <p className="w-full font-normal text-gray-600 truncate text-md">
                    {dr.description}
                  </p>
                </div>
                <div className="flex justify-end w-[10%]">
                  <input
                    checked={dr.state ? true : false}
                    onChange={() => (dr: DutyResponsibility) =>
                      onSelect(dr.sequenceNo, dr.drId)}
                    className="p-2 mr-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
                    type="checkbox"
                  />
                </div>
                {/* <div className="block lg:hidden">
                  <p className="w-full font-normal text-gray-600 truncate text-md">
                    {dr.description}
                  </p>
                </div> */}
              </li>
            );
          })}
      </ul>
    </>
  );
};
