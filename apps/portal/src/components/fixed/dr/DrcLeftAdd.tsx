/* eslint-disable @nx/enforce-module-boundaries */

import { Button } from '@gscwd-apps/oneui';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';
import { isEmpty } from 'lodash';

export const DrcLeftAdd = (): JSX.Element => {
  const {
    tempAddedDrcs,
    selectedDrcType,
    dutyText,
    indexToUpdate,
    tempPositionDuties,
    setDutyText,
    setTempAddedDrcs,
    setIndexToUpdate,
    setTempPositionDuties,
  } = useUpdatedDrcStore((state) => ({
    tempPositionDuties: state.tempPositionDuties,
    tempAddedDrcs: state.tempAddedDrcs,
    selectedDrcType: state.selectedDrcType,
    dutyText: state.dutyText,
    indexToUpdate: state.indexToUpdate,
    setTempAddedDrcs: state.setTempAddedDrcs,
    setDutyText: state.setDutyText,
    setIndexToUpdate: state.setIndexToUpdate,
    setTempPositionDuties: state.setTempPositionDuties,
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

      finalTempAddedCoreDrcs.push({ duty: dutyText.trim(), sequenceNo: tempAddedDrcs.core.length, onEdit: false });

      setTempAddedDrcs({ ...tempAddedDrcs, core: finalTempAddedCoreDrcs });
    } else if (selectedDrcType === 'support') {
      const finalTempAddedSupportDrcs = [...tempAddedDrcs.support];

      finalTempAddedSupportDrcs.push({
        duty: dutyText.trim(),
        sequenceNo: tempAddedDrcs.support.length,
        onEdit: false,
      });
      setTempAddedDrcs({ ...tempAddedDrcs, support: finalTempAddedSupportDrcs });
    }

    setDutyText('');
  };

  const onUpdate = () => {
    if (selectedDrcType === 'core') {
      const tempAddedDrcsCoreCopy = [...tempAddedDrcs.core];

      const core = tempAddedDrcsCoreCopy.map((drc) => {
        if (drc.sequenceNo === indexToUpdate) {
          drc.duty = dutyText;
          drc.onEdit = false;
          if (!isEmpty(drc.pdId)) {
            setTempPositionDuties([...tempPositionDuties, { pdId: drc.pdId }]);
          }
          setIndexToUpdate(null);
          setDutyText('');
        }
        return drc;
      });

      // set temp added drcs core
      setTempAddedDrcs({ ...tempAddedDrcs, core: core });
    } else if (selectedDrcType === 'support') {
      const tempAddedDrcsSupportCopy = [...tempAddedDrcs.support];
      const support = tempAddedDrcsSupportCopy.map((drc) => {
        if (drc.sequenceNo === indexToUpdate) {
          drc.duty = dutyText;
          drc.onEdit = false;
          setIndexToUpdate(null);
          setDutyText('');
        }
        return drc;
      });

      // set temp added drcs support

      setTempAddedDrcs({ ...tempAddedDrcs, support: support });
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-2">
        <textarea
          className="w-full h-[50%] border border-slate-300 rounded focus:border-teal-500 focus:outline-none focus:ring-0 placeholder:text-center placeholder:text-gray-300"
          placeholder="Type duties and responsibilities here"
          value={dutyText}
          onChange={(e) => setDutyText(e.target.value)}
        />

        <div className="flex w-full h-[4rem]">
          {indexToUpdate === null ? (
            <button
              type="button"
              onClick={onAdd}
              disabled={
                dutyText === ''
                  ? true
                  : dutyText !== '' && tempAddedDrcs.core.length >= 4
                  ? true
                  : dutyText !== '' && tempAddedDrcs.support.length >= 4
                  ? true
                  : false
              }
              className="w-full h-full text-white bg-teal-500 rounded-md hover:bg-teal-600 active:bg-teal-700 disabled:cursor-not-allowed"
            >
              Add
            </button>
          ) : (
            <button
              type="button"
              onClick={onUpdate}
              disabled={
                dutyText === ''
                  ? true
                  : dutyText !== '' && tempAddedDrcs.core.length > 4
                  ? true
                  : dutyText !== '' && tempAddedDrcs.support.length > 4
                  ? true
                  : false
              }
              className="w-full h-full text-white bg-teal-500 rounded-md hover:bg-teal-600 active:bg-teal-700 disabled:cursor-not-allowed"
            >
              Update Duty
            </button>
          )}
        </div>
      </div>
    </>
  );
};
