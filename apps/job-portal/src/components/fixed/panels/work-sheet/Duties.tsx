import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiPlus, HiXCircle } from 'react-icons/hi';
import {
  Duty,
  useWorkExpSheetStore,
  WorkExperienceSheet,
} from '../../../../store/work-experience-sheet.store';
import * as yup from 'yup';
import { createColumnHelper } from '@tanstack/react-table';
import { SpinnerCircular } from 'spinners-react';
import LoadingIndicator from '../../loader/LoadingIndicator';
import { DeleteButton } from '../../buttons/Delete';
import { Button, DataTable, Modal, useDataTable } from '@gscwd-apps/oneui';

type ColumnLabel = {
  _id: string;
  duty: string;
};

const columnHelper = createColumnHelper<ColumnLabel>();

const schema = yup.object().shape({
  _id: yup.string().nullable(true).notRequired(),
  duty: yup.string().required('Empty').trim().label('This'),
});

const readOnlyColumns = [
  columnHelper.accessor('duty', {
    cell: (info) => info.getValue(),
    header: 'duty title',
  }),
];

export const Duties = () => {
  const selectedWorkExperience = useWorkExpSheetStore(
    (state) => state.selectedWorkExperience
  );
  const [dutyIsRemoved, setDutyIsRemoved] = useState<boolean>(false);
  const setSelectedWorkExperience = useWorkExpSheetStore(
    (state) => state.setSelectedWorkExperience
  );
  const { register, handleSubmit, reset } = useForm<Duty>({
    defaultValues: { duty: '' },
    resolver: yupResolver(schema),
  });
  const [dutiesModalIsOpen, setDutiesModalIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const duties = useWorkExpSheetStore((state) => state.duties);
  const setDuties = useWorkExpSheetStore((state) => state.setDuties);

  const columns = [
    columnHelper.accessor('duty', {
      cell: (info) => info.getValue(),
      header: 'duty title',
    }),
    columnHelper.display({
      header: 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.index),
    }),
  ];
  const handleRemove = (dutyIdx: number) => {
    const updatedDuties = [...duties];
    updatedDuties.splice(dutyIdx, 1);
    setDuties(updatedDuties);
    setDutyIsRemoved(true);
    setIsLoading(true);
  };

  const openDutiesModal = () => {
    setDutiesModalIsOpen(true);
  };

  const renderRowActions = (index: number) => {
    <button
      onClick={() => handleRemove(index)}
      className="items-center w-full"
      type="button"
    >
      <HiXCircle size={25} className="text-red-500" />
    </button>;
  };

  const dutiesOnSubmit = handleSubmit((duty: Duty, e: any) => {
    e.preventDefault();
    const newDuties = [...duties];
    newDuties.push(duty);
    setDuties(newDuties);

    setSelectedWorkExperience({ ...selectedWorkExperience, duties: newDuties });
    setDutiesModalIsOpen(false);
    reset();
    setIsLoading(true);
  });

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading]);

  // when a duty is removed, this use effect is triggered
  useEffect(() => {
    if (dutyIsRemoved) {
      setSelectedWorkExperience({ ...selectedWorkExperience, duties });
      setDutyIsRemoved(false);
    }
  }, [dutyIsRemoved]);

  // use data table
  const { table } = useDataTable({
    data: selectedWorkExperience.duties,
    columns: columns,
  });

  return (
    <>
      <Modal open={dutiesModalIsOpen} setOpen={setDutiesModalIsOpen} size="sm">
        <Modal.Header>
          <p className="flex justify-center w-full text-2xl font-medium text-slate-700">
            Write actual duty
          </p>
        </Modal.Header>
        <Modal.Body>
          <form id="duties" onSubmit={dutiesOnSubmit} className="">
            <textarea
              className="h-[10rem] w-full rounded  bg-slate-100 text-left"
              {...register('duty')}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="duties" onClick={dutiesOnSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="w-full">
        <div className="flex w-full gap-2">
          <div className="font-medium text-gray-700">
            Summary of Actual Duties
          </div>
          {selectedWorkExperience.isSelected ? null : (
            <HiPlus
              size={22}
              className="text-white bg-green-500 rounded hover:cursor-pointer"
              onClick={openDutiesModal}
            />
          )}
        </div>
        <div className="mt-2 h-[16rem] w-full overflow-y-auto bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <LoadingIndicator />
            </div>
          ) : (
            selectedWorkExperience.duties &&
            selectedWorkExperience.duties.length > 0 && (
              <div className="overflow-y-auto">
                <DataTable
                  model={table}
                  showGlobalFilter={false}
                  showColumnFilter={false}
                  paginate={false}
                />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
