import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiXCircle } from 'react-icons/hi';
import { TiPlus } from 'react-icons/ti';
import { Accomplishment, useWorkExpSheetStore } from '../../../../store/work-experience-sheet.store';
import { createColumnHelper } from '@tanstack/react-table';
import LoadingIndicator from '../../loader/LoadingIndicator';
import { Button, DataTable, Modal, useDataTable } from '@gscwd-apps/oneui';

type ColumnLabel = {
  _id: string;
  accomplishment: string;
};

const columnHelper = createColumnHelper<ColumnLabel>();

export const Accomplishments = () => {
  const [accModalIsOpen, setAccModalIsOpen] = useState<boolean>(false);
  const [accIsRemoved, setAccIsRemoved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, reset, handleSubmit } = useForm<Accomplishment>({
    defaultValues: { accomplishment: '' },
  });
  const selectedWorkExperience = useWorkExpSheetStore((state) => state.selectedWorkExperience);
  const setSelectedWorkExperience = useWorkExpSheetStore((state) => state.setSelectedWorkExperience);
  const accomplishments = useWorkExpSheetStore((state) => state.accomplishments);
  const setAccomplishments = useWorkExpSheetStore((state) => state.setAccomplishments);

  const renderRowActions = (index: number) => {
    return (
      <button onClick={() => handleRemove(index)} className="items-center w-full" type="button">
        <HiXCircle size={25} className="text-red-500" />
      </button>
    );
  };

  const columns = [
    columnHelper.accessor('accomplishment', {
      cell: (info) => info.getValue(),
      header: 'Accomplishment title',
    }),
    columnHelper.display({
      header: 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.index),
    }),
  ];

  const handleRemove = (accIdx: number) => {
    const updatedAccomplishments = [...accomplishments];
    updatedAccomplishments.splice(accIdx, 1);
    setAccomplishments(updatedAccomplishments);
    setAccIsRemoved(true);
    setIsLoading(true);
  };

  // open accomplishments modal
  const openAccModal = () => {
    setAccModalIsOpen(true);
  };

  // accomplishments on submit
  const accOnSubmit = (accomplishment: Accomplishment, e: any) => {
    e.preventDefault();

    const newAccomplishments = [...accomplishments];
    newAccomplishments.push(accomplishment);
    setAccomplishments(newAccomplishments);

    setSelectedWorkExperience({
      ...selectedWorkExperience,
      accomplishments: newAccomplishments,
    });
    reset();
    setAccModalIsOpen(false);
    setIsLoading(true);
  };

  const { table } = useDataTable({
    data: selectedWorkExperience.accomplishments,
    columns: columns,
  });

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading]);

  // when an accomplishment is removed, this use effect is triggered
  useEffect(() => {
    if (accIsRemoved) {
      setSelectedWorkExperience({ ...selectedWorkExperience, accomplishments });
      setAccIsRemoved(false);
    }
  }, [accIsRemoved]);

  return (
    <>
      <Modal open={accModalIsOpen} setOpen={setAccModalIsOpen} size="sm">
        <Modal.Header>
          <p className="flex justify-center w-full text-2xl font-medium text-slate-700">
            Write accomplishment or contribution
          </p>
        </Modal.Header>
        <Modal.Body>
          <form id="accomplishments" className="">
            <textarea
              className="h-[10rem] w-full rounded  bg-slate-100 text-left"
              {...register('accomplishment', { required: true })}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="accomplishments" onClick={handleSubmit(accOnSubmit)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="w-full">
        <div className="flex w-full gap-2">
          <div className="font-medium text-gray-700">List of Accomplishments and Contributions (If any) </div>
          {selectedWorkExperience.isSelected ? null : (
            <TiPlus size={22} className="text-white bg-green-500 rounded hover:cursor-pointer" onClick={openAccModal} />
          )}
        </div>
        <div className="mt-2 h-[16rem] w-full overflow-y-auto bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <LoadingIndicator />
            </div>
          ) : (
            selectedWorkExperience.accomplishments &&
            selectedWorkExperience.accomplishments.length > 0 && (
              <div>
                <DataTable model={table} showGlobalFilter={false} showColumnFilter={false} paginate={false} />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
