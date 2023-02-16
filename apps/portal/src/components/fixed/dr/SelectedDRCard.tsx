import { FormEvent, useContext, useEffect, useState } from 'react';
import { HiClipboardList, HiOutlineX } from 'react-icons/hi';
import { DRContext } from '../../../context/contexts';
import { useDrStore } from '../../../store/dr.store';
import { Competency, DutyResponsibility } from '../../../types/dr.type';
import { CompetencyDropdown } from './CompetencyDropdown';

export const SelectedDRCard = (): JSX.Element => {
  const checkedDRCs = useDrStore((state) => state.checkedDRCs);

  const setCheckedDRCs = useDrStore((state) => state.setCheckedDRCs);

  const selectedDRCType = useDrStore((state) => state.selectedDRCType);

  const handleRemove = (positionIndexToRemove: number) => {
    if (selectedDRCType === 'core') {
      //create a copy of selected core drs
      const updatedCheckedCoreDRs = [...checkedDRCs.core];

      // loop through the copy of selected core drs
      updatedCheckedCoreDRs.map((dr: DutyResponsibility, index: number) => {
        if (index === positionIndexToRemove) {
          // set the state of the selected core dr to remove into false
          dr.state = false;

          // set the percentage to 0
          dr.percentage = undefined;

          // set the competency to none
          dr.competency = {} as Competency;

          // set pcplId
          dr.pcplId = dr.competency.pcplId;
        }
      });

      // remove the selected core dr
      updatedCheckedCoreDRs.splice(positionIndexToRemove, 1);

      // set the new value of selected core drs
      setCheckedDRCs({ ...checkedDRCs, core: updatedCheckedCoreDRs });
    } else if (selectedDRCType === 'support') {
      //create a copy of selected support drs
      const updatedCheckedSupportDRs = [...checkedDRCs.support];

      // loop through the copy of selected support drs
      updatedCheckedSupportDRs.map((dr: DutyResponsibility, index: number) => {
        // set the state of the selected support dr to remove into false
        dr.state = false;
      });

      // remove the selected support dr
      updatedCheckedSupportDRs.splice(positionIndexToRemove, 1);

      // set the new value of selected support drs
      setCheckedDRCs({ ...checkedDRCs, support: updatedCheckedSupportDRs });
    }
  };

  const handlePercentage = (event: FormEvent<HTMLInputElement>, drPercentageIndex: number) => {
    if (selectedDRCType === 'core') {
      // create a copy of selected core drs
      let updatedCoreDRs = [...checkedDRCs.core];

      // loop through the copy of selected core drs
      updatedCoreDRs.map((dr: DutyResponsibility, index: number) => {
        // check if core dr percentage index is the current index
        if (index === drPercentageIndex) {
          if (event.currentTarget.valueAsNumber >= 0) dr.percentage = event.currentTarget.valueAsNumber;
          else dr.percentage = 0;
        }
        //! Recently added
        dr.sequenceNo = index;
      });

      // set the new value of selected drs
      setCheckedDRCs({ ...checkedDRCs, core: updatedCoreDRs });
    }
    if (selectedDRCType === 'support') {
      // create a copy of selected core drs
      let updatedSupportDRs = [...checkedDRCs.support];

      // loop through the copy of selected core drs
      updatedSupportDRs.map((dr: DutyResponsibility, index: number) => {
        // check if core dr percentage index is the current index
        if (index === drPercentageIndex) {
          if (event.currentTarget.valueAsNumber >= 0) dr.percentage = event.currentTarget.valueAsNumber;
          else dr.percentage = 0;
        }
        //! Recently added
        dr.sequenceNo = index;
      });

      // set the new value of selected drs
      setCheckedDRCs({ ...checkedDRCs, support: updatedSupportDRs });
    }
  };

  return (
    <>
      {checkedDRCs && selectedDRCType === 'core' ? (
        <>
          {checkedDRCs.core.map((dr: DutyResponsibility, index: number) => {
            return (
              <div className="p-5 mb-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100" key={index}>
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                    <HiClipboardList className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <h5 className="text-lg">{dr.description}</h5>
                    </div>
                    <div
                      onClick={() => handleRemove(index)}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors ease-in-out rounded-full cursor-pointer hover:bg-gray-100"
                    >
                      <HiOutlineX />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 mb-2">
                  <CompetencyDropdown index={index} />
                  <label className="w-full p-2 border-2 border-gray-200 outline-none">
                    {dr.competency.pcplId ? `${dr.competency.code} | ${dr.competency.name} | ${dr.competency.level}` : 'No competency selected...'}
                  </label>
                </div>

                <div className="flex items-center mt-5 mb-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(event) => handlePercentage(event, index)}
                    className="w-full py-2 border-2 border-gray-200"
                    value={dr.percentage ? dr.percentage : ''}
                    placeholder="Input percentage..."
                  />
                </div>


              </div>
            );
          })}
        </>
      ) : checkedDRCs && selectedDRCType === 'support' ? (
        <>
          {checkedDRCs.support.map((dr: DutyResponsibility, index: number) => {
            return (
              <div className="p-5 mb-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100" key={index}>
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                    <HiClipboardList className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <h5 className="text-lg">{dr.description}</h5>
                    </div>
                    <div
                      onClick={() => handleRemove(index)}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors ease-in-out rounded-full cursor-pointer hover:bg-gray-100"
                    >
                      <HiOutlineX />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-5 mb-2">
                  <input
                    type="number"
                    minLength={0}
                    maxLength={100}
                    onChange={(event) => handlePercentage(event, index)}
                    className="w-full py-2 border-2 border-gray-200"
                    value={dr.percentage ? dr.percentage : ''}
                    placeholder="Add percentage"
                  />
                </div>

                <div className="flex flex-row items-center mt-5 mb-2">
                  <CompetencyDropdown index={index} />
                  <label className="w-full p-2 border-2 border-gray-200 outline-none">
                    {dr.competency.pcplId ? dr.competency.code : 'Add Competency...'}
                  </label>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
};
