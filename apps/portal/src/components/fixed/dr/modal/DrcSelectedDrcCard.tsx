/* eslint-disable @nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { Competency, DutyResponsibility } from 'apps/portal/src/types/dr.type';
import { FormEvent } from 'react';
import { HiClipboardList, HiOutlineX } from 'react-icons/hi';
import { CompetencyDropdown } from './CompetencyDropdown';

export const DrcSelectedDrcCard = (): JSX.Element => {
  const {
    checkedDnrs,
    selectedDrcType,
    availableDnrs,
    setAvailableDnrs,
    setCheckedDnrs,
  } = useDnrStore((state) => ({
    selectedDrcType: state.selectedDrcType,
    availableDnrs: state.availableDnrs,
    setAvailableDnrs: state.setAvailableDnrs,
    checkedDnrs: state.checkedDnrs,
    setCheckedDnrs: state.setCheckedDnrs,
  }));

  // remove
  const handleRemove = (drId: string) => {
    if (selectedDrcType === 'core') {
      //create a copy of selected core drs
      const updatedCheckedCoreDRs = [...checkedDnrs.core];

      // loop through the copy of selected core drs
      updatedCheckedCoreDRs.map((dr: DutyResponsibility) => {
        //! changed
        if (dr.drId === drId) {
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

      //! remove the selected core dr
      // updatedCheckedCoreDRs.splice(positionIndexToRemove, 1);

      const updatedRemovedCheckedCoreDnrs = updatedCheckedCoreDRs.filter(
        (drc) => drc.drId !== drId
      );

      // map and re-assign the sequence no
      updatedRemovedCheckedCoreDnrs.map((drc, index: number) => {
        drc.sequenceNo = index;
      });

      // set the new value of selected core drs
      setCheckedDnrs({ ...checkedDnrs, core: updatedRemovedCheckedCoreDnrs });
    } else if (selectedDrcType === 'support') {
      //create a copy of selected support drs
      const updatedCheckedSupportDRs = [...checkedDnrs.support];

      // loop through the copy of selected support drs
      updatedCheckedSupportDRs.map((dr: DutyResponsibility) => {
        if (dr.drId === drId) {
          // set the state of the selected support dr to remove into false
          dr.state = false;

          // set the percentage to 0
          dr.percentage = undefined;

          // set the competency to none
          dr.competency = {} as Competency;

          // set pcplId
          dr.pcplId = dr.competency.pcplId;
        }
      });

      //! remove the selected support dr
      // updatedCheckedSupportDRs.splice(positionIndexToRemove, 1);

      const updatedRemovedCheckedSupportDnrs = updatedCheckedSupportDRs.filter(
        (drc) => drc.drId !== drId
      );

      // map and re-assign the sequence no
      updatedRemovedCheckedSupportDnrs.map((drc, index: number) => {
        drc.sequenceNo = index;
      });

      // set the new value of selected support drs
      setCheckedDnrs({
        ...checkedDnrs,
        support: updatedRemovedCheckedSupportDnrs,
      });
    }

    // map the available dnrs, set the state of the dr to false
    availableDnrs.map((drc) => {
      if (drc.drId === drId) {
        // set the available dnr state to false
        drc.state = false;
      }
    });
  };

  // percentage on change
  const handlePercentage = (
    event: FormEvent<HTMLInputElement>,
    drId: string
  ) => {
    if (selectedDrcType === 'core') {
      // create a copy of selected core drs
      const updatedCoreDRs = [...checkedDnrs.core];

      // loop through the copy of selected core drs
      updatedCoreDRs.map((dr: DutyResponsibility) => {
        // check if core dr percentage index is the current index
        if (dr.drId === drId) {
          if (event.currentTarget.valueAsNumber >= 0)
            dr.percentage = event.currentTarget.valueAsNumber;
          else dr.percentage = 0;
        }
      });

      // set the new value of selected drs
      setCheckedDnrs({ ...checkedDnrs, core: updatedCoreDRs });
    }
    if (selectedDrcType === 'support') {
      // create a copy of selected core drs
      const updatedSupportDRs = [...checkedDnrs.support];

      // loop through the copy of selected core drs
      updatedSupportDRs.map((dr: DutyResponsibility, index: number) => {
        // check if core dr percentage index is the current index
        if (dr.drId === drId) {
          if (event.currentTarget.valueAsNumber >= 0)
            dr.percentage = event.currentTarget.valueAsNumber;
          else dr.percentage = 0;
        }
      });

      // set the new value of selected drs
      setCheckedDnrs({ ...checkedDnrs, support: updatedSupportDRs });
    }
  };

  return (
    <>
      {checkedDnrs && selectedDrcType === 'core' ? (
        <>
          {checkedDnrs.core.map((dr: DutyResponsibility, index: number) => {
            return (
              <div
                className="p-5 mb-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100 "
                key={index}
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                    <HiClipboardList className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <h5 className="font-light text-md">{dr.description}</h5>
                    </div>
                    <div
                      onClick={() => handleRemove(dr.drId)}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors ease-in-out rounded-full cursor-pointer hover:bg-gray-100"
                    >
                      <HiOutlineX />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 mb-2">
                  {/* handle competency on selection */}
                  <CompetencyDropdown index={index} />
                  <label
                    className={`w-full p-2 truncate rounded-r outline-none work ${
                      dr.competency.pcplId
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200/80 text-red-700'
                    }`}
                  >
                    {dr.competency.pcplId
                      ? `${dr.competency.code} | ${dr.competency.name} | ${dr.competency.level}`
                      : 'No competency selected...'}
                  </label>
                </div>

                <div className="flex items-center mt-5 mb-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(event) => handlePercentage(event, dr.drId)}
                    className="w-full py-2 border border-gray-200 rounded "
                    value={dr.percentage ? dr.percentage : ''}
                    placeholder="Input percentage..."
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : checkedDnrs && selectedDrcType === 'support' ? (
        <>
          {checkedDnrs.support.map((dr: DutyResponsibility, index: number) => {
            return (
              <div
                className="p-5 mb-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100"
                key={index}
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                    <HiClipboardList className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <h5 className="font-light text-md">{dr.description}</h5>
                    </div>
                    <div
                      onClick={() => handleRemove(dr.drId)}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors ease-in-out rounded-full cursor-pointer hover:bg-gray-100"
                    >
                      <HiOutlineX />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 mb-2">
                  {/* handle competency on selection */}
                  <CompetencyDropdown index={index} />
                  <label
                    className={`w-full p-2 truncate rounded-r outline-none work ${
                      dr.competency.pcplId
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200/80 text-red-700'
                    }`}
                  >
                    {dr.competency.pcplId
                      ? `${dr.competency.code} | ${dr.competency.name} | ${dr.competency.level}`
                      : 'No competency selected...'}
                  </label>
                </div>

                <div className="flex items-center mt-5 mb-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    onChange={(event) => handlePercentage(event, dr.drId)}
                    className="w-full py-2 border border-gray-200 rounded "
                    value={dr.percentage ? dr.percentage : ''}
                    placeholder="Add percentage"
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
};
