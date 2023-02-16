import { useContext, useEffect } from 'react';
import { HiBadgeCheck, HiExclamationCircle, HiLockClosed, HiLockOpen, HiX } from 'react-icons/hi';
import { DRContext } from '../../../context/contexts';
import { useDrStore } from '../../../store/dr.store';
import { DutyResponsibility, Competency } from '../../../types/dr.type';
import { Table, TableHeader } from '../table/Table';

export const SelectedSupportDRs = (): JSX.Element => {
  // const { selectedDRCs, allDRCPool, setSelectedDRCs, originalPool, setFilteredDRCs, setallDRCPool, tempPercentageDRs, setTempPercentageDRs } =
  //   useContext(DRContext);

  const selectedDRCs = useDrStore((state) => state.selectedDRCs)

  const allDRCPool = useDrStore((state) => state.allDRCPool)

  const setSelectedDRCs = useDrStore((state) => state.setSelectedDRCs)

  const originalPool = useDrStore((state) => state.originalPool)

  const setFilteredDRCs = useDrStore((state) => state.setFilteredDRCs)

  const setallDRCPool = useDrStore((state) => state.setAllDRCPool)



  const handleRemove = (positionIndexToRemove: number, positionIdToRemove: string) => {
    // copy the selected drs from context to local constant variable
    const updatedSelectedSupportDRs = [...selectedDRCs.support];

    // copy the all dr pool from the context to a local constant varialbe
    const updatedAllDRPool = [...allDRCPool];

    // initialize the remove object
    let _removed: DutyResponsibility = {} as DutyResponsibility;

    // map the original pool from context
    originalPool.map((dr: DutyResponsibility) => {
      if (dr.odrId === positionIdToRemove) {
        // set the _remove if odrid is equal to positionId
        _removed = dr;
      }
    });

    // push the removed object to dr pool array
    updatedAllDRPool.push(_removed);

    // sort the array alphabetically
    let sortedNewPool = [
      ...updatedAllDRPool.sort((a: DutyResponsibility, b: DutyResponsibility) => a.description!.localeCompare(b.description!)),
    ];

    // map the sorted pool
    sortedNewPool.map((dr: DutyResponsibility, index: number) => {
      // re initializes the index from 0 to n
      dr.sequenceNo = index;

      // re initializes the percentage to 0
      dr.percentage = 0;

      // set the selected state to false
      dr.state = false;

      //! Just added this
      // set the selected on edit to false
      dr.onEdit = false

      // sets the competency to an empty object since it is deleted
      dr.competency = {} as Competency;
    });

    // set the all dr pool according to the sorted new pool
    setallDRCPool(sortedNewPool);

    // set the filtered dr pool according to the sorted new pool
    setFilteredDRCs(sortedNewPool);

    // remove the selected support dr
    updatedSelectedSupportDRs.splice(positionIndexToRemove, 1);
    updatedSelectedSupportDRs.map((dr: DutyResponsibility, index: number) => {
      dr.sequenceNo = index;
    });

    // set the new value of selected support drs
    setSelectedDRCs({ ...selectedDRCs, support: updatedSelectedSupportDRs });
    // setTempPercentageDRs(updatedSelectedSupportDRs);
  };

  const handleEditToggle = (odrId: string, onEdit: boolean) => {
    const tempSelectedDRs = [...selectedDRCs.support];
    let tempUpdatedSelectedDrs: Array<DutyResponsibility> = [];

    tempSelectedDRs.map((dr: DutyResponsibility, index: number) => {
      if (odrId === dr.odrId) dr.onEdit = !onEdit;
      dr.sequenceNo = index;
      tempUpdatedSelectedDrs.push(dr);
    });

    setSelectedDRCs({ ...selectedDRCs, support: tempUpdatedSelectedDrs });
  };

  const onChangePercentage = (e: any, odrId: string, sequenceNo: number) => {
    const tempSelectedDrs = [...selectedDRCs.support];
    let tempUpdatedSelectedDrs: Array<DutyResponsibility> = [];

    tempSelectedDrs.map((dr: DutyResponsibility, index: number) => {
      // if (dr.percentage === undefined || dr.percentage === NaN) dr.percentage = 0;
      if (dr.odrId === odrId) {
        if (e.currentTarget.valueAsNumber >= 0) dr.percentage = e.currentTarget.valueAsNumber;
        else dr.percentage = 0;
      }
      // dr.sequenceNo = index;
      tempUpdatedSelectedDrs.push(dr);
    });

    // setTempPercentageDRs(tempUpdatedSelectedDrs);
    setSelectedDRCs({ ...selectedDRCs, support: tempUpdatedSelectedDrs })
  };

  return (
    <>
      <Table
        tableHeader={
          <>
            <TableHeader header="" className="font-normal w-[5%] flex justify-start" />
            {/* <TableHeader header="" className="font-normal w-[3%] flex justify-start" /> */}
            <TableHeader header="Description" className="font-normal w-[55%] flex justify-start" />
            <TableHeader header="Code" className="font-normal w-[15%] flex justify-center" />
            <TableHeader header="Percentage" className="font-normal w-[15%] flex justify-center" />
            <TableHeader header="Actions" className="font-normal w-[10%] flex justify-center " />
          </>
        }
        tableBody={
          <>
            {/* <SelectedCoreDRs /> */}
            {selectedDRCs.support.map((dr: DutyResponsibility, index: number) => {
              return (
                <tr key={index} className="font-light text-gray-600 peer hover:bg-gray-400 hover:text-white ">
                  <td className="flex items-start justify-between py-1 text-sm">
                    <div className="flex w-[5%] justify-center">
                      {dr.percentage! > 0 && dr.onEdit === false && dr.percentage !== NaN && JSON.stringify(dr.competency) !== '{}' ? (
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
                      <p className="w-full overflow-hidden text-black text-ellipsis">{dr.description}</p>
                    </div>
                    <div className="w-[15%] flex gap-1 items-center justify-center ">{dr.competency.code}</div>
                    <div className="w-[15%] flex gap-1 items-center justify-center ">
                      <>
                        <input
                          type="number"
                          className={`w-[4rem] h-[1.5rem] rounded outline-none border-0  border-gray-100 text-center ${dr.onEdit ? 'bg-red-200' : 'bg-transparent'
                            }`}
                          value={dr.percentage ? dr.percentage : 0}
                          onChange={(e) => onChangePercentage(e, dr.odrId, dr.sequenceNo!)}
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
                            onClick={() => handleEditToggle(dr.odrId, dr.onEdit!)}
                          />
                        </>
                      ) : (
                        <>
                          <HiLockClosed
                            size={30}
                            className="bg-transparent rounded hover:cursor-pointer"
                            fill="#7b42f5"
                            onClick={() => handleEditToggle(dr.odrId, dr.onEdit!)}
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
            })}
          </>
        }
      />
    </>
  );
};
