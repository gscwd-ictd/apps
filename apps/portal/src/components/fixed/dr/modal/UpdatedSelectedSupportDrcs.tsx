/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { Competency, DutyResponsibility, UpdatedDutyResponsibility } from 'apps/portal/src/types/dr.type';
import { HiBadgeCheck, HiExclamationCircle, HiLockClosed, HiLockOpen, HiX } from 'react-icons/hi';
import UseRenderBadgePill from '../../badge-pill/BadgePill';
import { Table, TableHeader } from '../../table/Table';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';

export const UpdatedSelectedSupportDrcs = (): JSX.Element => {
  const { addedDrcs, isLoading, setAddedDrcs } = useUpdatedDrcStore((state) => ({
    isLoading: state.loading.loadingExistingDrcs,
    addedDrcs: state.addedDrcs,
    setAddedDrcs: state.setAddedDrcs,
  }));

  const handleRemove = (positionIndexToRemove: number) => {
    // copy the selected drs from context to local constant variable
    const updatedSelectedSupportDnrs = [...addedDrcs.support];

    // // copy the all dr pool from the context to a local constant varialbe
    // const updatedAvailableDnrs = [...availableDnrs];

    // initialize the remove object
    let _removed: DutyResponsibility = {} as DutyResponsibility;

    // // map the original pool from context
    // originalPool.map((dr: DutyResponsibility) => {
    //   if (dr.odrId === positionIdToRemove) {
    //     // set the _remove if odrid is equal to positionId
    //     _removed = dr;
    //   }
    // });

    // // push the removed object to dr pool array
    // updatedAvailableDnrs.push(_removed);

    // // sort the array alphabetically
    // const sortedNewPool = [
    //   ...updatedAvailableDnrs.sort((a: DutyResponsibility, b: DutyResponsibility) =>
    //     a.description!.localeCompare(b.description!)
    //   ),
    // ];

    // // map the sorted pool
    // sortedNewPool.map((dr: DutyResponsibility, index: number) => {
    //   // re initializes the index from 0 to n
    //   dr.sequenceNo = index;

    //   // re initializes the percentage to 0
    //   dr.percentage = 0;

    //   // set the selected state to false
    //   dr.state = false;

    //   // set the selected on edit to false
    //   dr.onEdit = false;

    //   // sets the competency to an empty object since it is deleted
    //   dr.competency = {} as Competency;
    // });

    // // set the all dr pool according to the sorted new pool
    // setAvailableDnrs(sortedNewPool);

    // // set the filtered dr pool according to the sorted new pool
    // setFilteredAvailableDnrs(sortedNewPool);

    // remove the selected support dr
    updatedSelectedSupportDnrs.splice(positionIndexToRemove, 1);
    updatedSelectedSupportDnrs.map((dr: UpdatedDutyResponsibility, index: number) => {
      dr.sequenceNo = index;
    });

    // set the new value of selected support drs
    setAddedDrcs({ ...addedDrcs, support: updatedSelectedSupportDnrs });
  };

  const handleEditToggle = (sequenceNo: number, onEdit: boolean) => {
    const tempSelectedDnrs = JSON.parse(JSON.stringify(addedDrcs.support));
    const tempUpdatedSelectedDnrs: Array<UpdatedDutyResponsibility> = [];

    tempSelectedDnrs.map((dr: UpdatedDutyResponsibility, index: number) => {
      if (index === sequenceNo) dr.onEdit = !onEdit;
      dr.sequenceNo = index;
      tempUpdatedSelectedDnrs.push(dr);
    });

    setAddedDrcs({ ...addedDrcs, support: tempUpdatedSelectedDnrs });
  };

  const onChangePercentage = (e: any, sequenceNo: number) => {
    const tempSelectedDnrs = [...addedDrcs.support];
    const tempUpdatedSelectedDnrs: Array<UpdatedDutyResponsibility> = [];

    tempSelectedDnrs.map((dr: UpdatedDutyResponsibility, index: number) => {
      if (dr.sequenceNo === sequenceNo) {
        if (e.currentTarget.valueAsNumber >= 0) dr.percentage = e.currentTarget.valueAsNumber;
        else dr.percentage = 0;
      }
      tempUpdatedSelectedDnrs.push(dr);
    });

    setAddedDrcs({ ...addedDrcs, support: tempUpdatedSelectedDnrs });
  };

  return (
    <>
      <>
        <div className="min-w-[50rem] grid grid-cols-12 gap-1 pt-2 text-xs">
          <div className="col-span-1 "></div>
          <div className="col-span-6 gap-2 ">
            <label className="justify-start font-normal lex">Description</label>
          </div>
          <div className="col-span-1 ">
            <label className="flex justify-center font-normal">Code</label>
          </div>
          <div className="col-span-1 ">
            <label className="flex justify-center font-normal">Level</label>
          </div>
          <div className="col-span-1">
            <label className="flex justify-center font-normal">Percentage</label>
          </div>
          <div className="col-span-2">
            <label className="flex justify-center font-normal">Actions</label>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            addedDrcs &&
            addedDrcs.support.map((dr: UpdatedDutyResponsibility, index: number) => {
              return (
                <div key={index} className="grid grid-cols-12 col-span-12 gap-1 pt-3">
                  <div className="col-span-1 ">
                    <div className="flex justify-center h-full">
                      {dr.percentage! > 0 &&
                      dr.onEdit === false &&
                      !Number.isNaN(dr.percentage) &&
                      JSON.stringify(dr.competency) !== '{}' ? (
                        <>
                          <HiBadgeCheck size={20} fill="#7b42f5" />
                        </>
                      ) : (
                        <>
                          <HiExclamationCircle size={20} fill="#f54242" />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 ">
                    <div className="flex flex-row justify-start peer-hover:text-white">
                      <p className="w-full overflow-hidden text-sm font-normal text-justify text-gray-600 text-ellipsis ">
                        {dr.duty}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="flex justify-center font-light h-[1.5rem] text-gray-800 xs:text-xs sm:text-xs md:text-xs lg:text-sm">
                      {UseRenderBadgePill(dr.competency.code)}
                    </label>
                  </div>
                  <div className="col-span-1">
                    <label className="flex justify-center font-light text-gray-800 h-[1.5rem] xs:text-xs sm:text-xs md:text-xs lg:text-sm">
                      {UseRenderBadgePill(dr.competency.level)}
                    </label>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center justify-center gap-1 text-sm font-light ">
                      <input
                        type="number"
                        className={`w-[4rem] h-[1.5rem] text-gray-800 rounded outline-none border-0  border-gray-100 text-center ${
                          dr.onEdit ? 'bg-red-200' : 'bg-transparent'
                        }`}
                        max={100}
                        value={dr.percentage ? dr.percentage : 0}
                        onChange={(e) => onChangePercentage(e, dr.sequenceNo!)}
                        disabled={dr.onEdit ? false : true}
                      />

                      <span className="font-semibold">%</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      {dr.onEdit ? (
                        <>
                          <HiLockOpen
                            size={26}
                            className="bg-transparent rounded hover:cursor-pointer"
                            fill="#fc0303"
                            onClick={() => handleEditToggle(dr.sequenceNo, dr.onEdit!)}
                          />
                        </>
                      ) : (
                        <>
                          <HiLockClosed
                            size={26}
                            className="bg-transparent rounded hover:cursor-pointer"
                            fill="#7b42f5"
                            onClick={() => handleEditToggle(dr.sequenceNo, dr.onEdit!)}
                          />
                        </>
                      )}
                      <HiX
                        className="bg-red-500 rounded hover:cursor-pointer"
                        fill="white"
                        size={26}
                        onClick={() => handleRemove(index)}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </>

      {/* <Table
        tableHeader={
          <>
            <TableHeader
              header=""
              className="font-normal w-[5%] flex justify-start"
            />

            <TableHeader
              header="Description"
              className="font-normal w-[55%] flex justify-start"
            />
            <TableHeader
              header="Code"
              className="font-normal w-[15%] flex justify-center"
            />
            <TableHeader
              header="Percentage"
              className="font-normal w-[15%] flex justify-center"
            />
            <TableHeader
              header="Actions"
              className="font-normal w-[10%] flex justify-center "
            />
          </>
        }
        tableBody={
          <>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              selectedDnrs &&
              selectedDnrs.support.map(
                (dr: DutyResponsibility, index: number) => {
                  return (
                    <tr
                      key={index}
                      className="font-light text-gray-600 border-b border-dashed peer hover:bg-gray-400 hover:text-white"
                    >
                      <td className="flex items-start justify-between py-1 text-sm">
                        <div className="flex w-[5%] justify-center">
                          {dr.percentage! > 0 &&
                          dr.onEdit === false &&
                          !Number.isNaN(dr.percentage) &&
                          JSON.stringify(dr.competency) !== '{}' ? (
                            <>
                              <HiBadgeCheck size={20} fill="#7b42f5" />
                            </>
                          ) : (
                            <>
                              <HiExclamationCircle size={20} fill="#f54242" />
                            </>
                          )}
                        </div>
                        <div className="w-[55%] flex flex-row justify-start">
                          <p className="w-full overflow-hidden text-black text-ellipsis">
                            {dr.description}
                          </p>
                        </div>
                        <div className="w-[15%] flex gap-1 items-center justify-center ">
                          {dr.competency.code}
                        </div>
                        <div className="w-[15%] flex gap-1 items-center justify-center ">
                          <>
                            <input
                              type="number"
                              className={`w-[4rem] h-[1.5rem] rounded outline-none border-0  border-gray-100 text-center ${
                                dr.onEdit ? 'bg-red-200' : 'bg-transparent'
                              }`}
                              max={100}
                              value={dr.percentage ? dr.percentage : 0}
                              onChange={(e) =>
                                onChangePercentage(e, dr.odrId, dr.sequenceNo!)
                              }
                              disabled={dr.onEdit ? false : true}
                            />
                          </>
                          <span className="font-semibold">%</span>
                        </div>
                        <div className="w-[10%] flex items-center justify-center gap-2">
                          {dr.onEdit ? (
                            <>
                              <HiLockOpen
                                size={30}
                                className="bg-transparent rounded hover:cursor-pointer"
                                fill="#fc0303"
                                onClick={() =>
                                  handleEditToggle(dr.odrId, dr.onEdit!)
                                }
                              />
                            </>
                          ) : (
                            <>
                              <HiLockClosed
                                size={30}
                                className="bg-transparent rounded hover:cursor-pointer"
                                fill="#7b42f5"
                                onClick={() =>
                                  handleEditToggle(dr.odrId, dr.onEdit!)
                                }
                              />
                            </>
                          )}
                          <HiX
                            className="bg-red-500 rounded hover:cursor-pointer"
                            fill="white"
                            size={30}
                            onClick={() => handleRemove(index, dr.odrId)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </>
        }
      /> */}
    </>
  );
};
