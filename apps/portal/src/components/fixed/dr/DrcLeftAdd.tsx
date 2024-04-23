/* eslint-disable @nx/enforce-module-boundaries */

import { Button } from '@gscwd-apps/oneui';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';
import { UpdatedDutyResponsibility } from 'apps/portal/src/types/dr.type';
import { useState } from 'react';

export const DrcLeftAdd = (): JSX.Element => {
  // const {
  //   availableDnrs,
  //   checkedDnrs,
  //   filteredAvailableDnrs,
  //   selectedDrcType,
  //   setFilteredAvailableDnrs,
  //   setAvailableDnrs,
  //   setCheckedDnrs,
  //   setFilteredDnrValue,
  // } = useDnrStore((state) => ({
  //   availableDnrs: state.availableDnrs,
  //   filteredAvailableDnrs: state.filteredAvailableDnrs,
  //   checkedDnrs: state.checkedDnrs,
  //   selectedDrcType: state.selectedDrcType,
  //   setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
  //   setAvailableDnrs: state.setAvailableDnrs,
  //   setCheckedDnrs: state.setCheckedDnrs,
  //   setFilteredDnrValue: state.setFilteredDnrValue,
  // }));

  const [text, setText] = useState<string>('');

  const { tempAddedDrcs, selectedDrcType, setTempAddedDrcs } = useUpdatedDrcStore((state) => ({
    tempAddedDrcs: state.tempAddedDrcs,
    selectedDrcType: state.selectedDrcType,
    setTempAddedDrcs: state.setTempAddedDrcs,
  }));

  // const onSelect = (sequenceNo: number | undefined, drId: string) => {
  //   // initialize currently selected drc
  //   let tempSelectedDr: UpdatedDutyResponsibility = {} as UpdatedDutyResponsibility;

  //   // copy the current state of drcs
  //   const updatedDnrs: Array<UpdatedDutyResponsibility> = [...availableDnrs];

  //   // temporary checked drcs
  //   const tempCheckedDnrs: Array<UpdatedDutyResponsibility> = [];

  //   // loop through all core drs
  //   updatedDnrs.map((dr, drIndex: number) => {
  //     // get the current list of checked drcs based on state from available drcs
  //     if (dr.state === true)
  //       tempCheckedDnrs.push({ ...dr, sequenceNo: drIndex });

  //     // check if a particular drc's index is selected
  //     if (sequenceNo === drIndex) {
  //       // reverse the current value of the dr state
  //       // dr.state = !dr.state;

  //       //! 07/10/2023 instead of reversing state of the element, get the element and set the state to the reversed state value
  //       tempSelectedDr = { ...dr, state: !dr.state };
  //     }
  //   });

  //   // loop to push to temporary array where state is true
  //   updatedDnrs.map((dr, drIndex: number) => {
  //     // if (dr.state === true) tempCheckedDnrs.push(dr);
  //     // check if a particular drc's index is selected
  //     if (sequenceNo === drIndex) {
  //       // reverse the current value of the dr state
  //       dr.state = !dr.state;
  //     }
  //   });

  //   // set selected core drs state depending on type prop
  //   if (selectedDrcType === 'core') {
  //     //! previous code
  //     // setCheckedDnrs({ ...checkedDnrs, core: tempCheckedDnrs });

  //     // set a copy of checked core drcs
  //     const finalCheckedCoreDnrs = [...checkedDnrs.core];

  //     if (tempSelectedDr.state === true) {
  //       // push the element
  //       finalCheckedCoreDnrs.push({
  //         ...tempSelectedDr,
  //         sequenceNo:
  //           checkedDnrs.core.length === 0 ? 0 : checkedDnrs.core.length,
  //       });

  //       // set the final core array
  //       setCheckedDnrs({
  //         ...checkedDnrs,
  //         core: finalCheckedCoreDnrs,
  //       });
  //     } else if (tempSelectedDr.state === false) {
  //       // splice the element
  //       const removedFinalCheckedCoreDnrs = finalCheckedCoreDnrs.filter(
  //         (e) => e.drId !== drId
  //       );

  //       // set the final core array
  //       setCheckedDnrs({
  //         ...checkedDnrs,
  //         core: removedFinalCheckedCoreDnrs,
  //       });
  //     }
  //   } else if (selectedDrcType === 'support') {
  //     //! previous code
  //     // setCheckedDnrs({ ...checkedDnrs, support: tempCheckedDnrs });

  //     // set a copy of checked support drcs
  //     const finalCheckedSupportDnrs = [...checkedDnrs.support];

  //     // // push the element
  //     // finalCheckedSupportDnrs.push({
  //     //   ...tempSelectedDr,
  //     //   sequenceNo:
  //     //     checkedDnrs.support.length === 0 ? 0 : checkedDnrs.support.length - 1,
  //     // });

  //     // // set the final support array
  //     // setCheckedDnrs({ ...checkedDnrs, support: finalCheckedSupportDnrs });
  //     if (tempSelectedDr.state === true) {
  //       // push the element
  //       finalCheckedSupportDnrs.push({
  //         ...tempSelectedDr,
  //         sequenceNo:
  //           checkedDnrs.support.length === 0 ? 0 : checkedDnrs.support.length,
  //       });

  //       // set the final support array
  //       setCheckedDnrs({
  //         ...checkedDnrs,
  //         support: finalCheckedSupportDnrs,
  //       });
  //     } else if (tempSelectedDr.state === false) {
  //       // splice the element
  //       const removedFinalCheckedSupportDnrs = finalCheckedSupportDnrs.filter(
  //         (e) => e.drId !== drId
  //       );

  //       // set the final core array
  //       setCheckedDnrs({
  //         ...checkedDnrs,
  //         support: removedFinalCheckedSupportDnrs,
  //       });
  //     }
  //   }

  //   // set drs state
  //   //! Removed recently
  //   setAvailableDnrs(updatedDnrs);

  //   setFilteredAvailableDnrs(updatedDnrs);

  //   setFilteredDnrValue('');
  // };

  const onAdd = () => {
    //
    if (selectedDrcType === 'core') {
      const finalTempAddedCoreDrcs = [...tempAddedDrcs.core];

      finalTempAddedCoreDrcs.push({ duty: text, sequenceNo: tempAddedDrcs.core.length });

      setTempAddedDrcs({ ...tempAddedDrcs, core: finalTempAddedCoreDrcs });
    } else if (selectedDrcType === 'support') {
      const finalTempAddedSupportDrcs = [...tempAddedDrcs.support];

      finalTempAddedSupportDrcs.push({ duty: text, sequenceNo: tempAddedDrcs.support.length });
    }

    setText('');
  };

  return (
    <>
      <textarea
        className="w-full border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-0  rounded min-h-[10rem] placeholder:text-center  placeholder:text-gray-300"
        placeholder="Type duties and responsibilities here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button type="button" onClick={onAdd}>
          Add
        </Button>
      </div>
    </>
  );
};
