import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import {
  Table,
  TableDimension,
  TableHeader,
} from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/Recognitions';
import { useApplicantStore } from '../../../../store/applicant.store';
import { Recognition } from 'apps/job-portal/utils/types/data/other-info.type';

export const OIRecogs = (): JSX.Element => {
  // set recognition array, employee object state from pds context
  const recognitions = usePdsStore((state) => state.recognitions);
  const applicant = useApplicantStore((state) => state.applicant);
  const [addRecogIsOpen, setAddRecogIsOpen] = useState<boolean>(false); // add modal state
  const [removeRecogIsOpen, setRemoveRecogIsOpen] = useState<boolean>(false); // remove recognition modal state
  const [recogToRemove, setRecogToRemove] = useState<number>(-1); // recognition to remove state
  const [removedRecog, setRemovedRecog] = useState<Recognition>(
    {} as Recognition
  );
  const deletedRecognitions = usePdsStore((state) => state.deletedRecognitions);
  const setDeletedRecognitions = usePdsStore(
    (state) => state.setDeletedRecognitions
  );
  const setRecognitions = usePdsStore((state) => state.setRecognitions);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<Recognition>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', recognition: '' },
  });

  // fire submit button
  const onSubmit = handleSubmit((recog: Recognition, e: any) => {
    e.preventDefault();
    const updatedRecogs = [...recognitions];
    updatedRecogs.push(recog);
    setRecognitions(updatedRecogs);
    reset();
    setAddRecogIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddRecogIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddRecogIsOpen(false);
  };

  // remove action modal
  const openRemoveActionModal = (recog: Recognition, recogIdx: number) => {
    setRemoveRecogIsOpen(true);
    setRecogToRemove(recogIdx);
    setRemovedRecog(recog);
  };

  // remove action
  const handleRemoveTitle = (recogIdx: number) => {
    const updatedRecogs = [...recognitions];
    const deleted = [...deletedRecognitions];
    deleted.push(removedRecog);
    setDeletedRecognitions(deleted);
    updatedRecogs.splice(recogIdx, 1);
    setRecognitions(updatedRecogs);
    setRemoveRecogIsOpen(false);
  };

  return (
    <>
      <Card
        title="Non-academic Distinctions & Recognitions"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Distinction or Recognition"
            variant="theme"
            type="button"
            shadow
            className="sm:w-full md:w-72 lg:w-72"
            onClick={openModal}
          />
        }
      >
        <>
          <Modal
            title="Non-academic Distinction & Recognition"
            subtitle={
              <>
                Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="recogs"
            isOpen={addRecogIsOpen}
            setIsOpen={setAddRecogIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="lg"
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
            <>
              <div className="gap-4 p-5">
                <div className="w-full mb-6">
                  <InputReactForm
                    id="recogtitle"
                    name="recogtitle"
                    label="Title"
                    labelIsRequired
                    placeholder="Write in Full"
                    type="text"
                    controller={{
                      ...register('recognition', { required: true }),
                    }}
                    withLabel={true}
                    isError={
                      errors.recognition && errors.recognition.message
                        ? true
                        : false
                    }
                    errorMessage={errors.recognition?.message}
                  />
                </div>
              </div>
            </>
          </Modal>
          <ModalAction
            isOpen={removeRecogIsOpen}
            setIsOpen={setRemoveRecogIsOpen}
            action={() => handleRemoveTitle(recogToRemove)}
          />
          {recognitions.length === 0 ? (
            <>
              <NoDataVisual />
            </>
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Title"
                      headerWidth="w-[85%]"
                      className="px-28"
                      textSize="sm"
                    />
                    <TableHeader
                      label="Actions"
                      headerWidth="w-[15%]"
                      textSize="sm"
                      alignment="center"
                    />
                  </>
                }
                tableBody={
                  <>
                    <tbody>
                      {recognitions.map(
                        (recog: Recognition, recogIdx: number) => {
                          return (
                            <tr
                              key={recogIdx}
                              className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                            >
                              <TableDimension
                                isText={true}
                                label={recog.recognition}
                                className="px-28"
                                textSize="lg"
                              />
                              <TableDimension
                                isText={false}
                                className="px-2 text-center select-none"
                                tableDimension={
                                  <>
                                    <DeleteButton
                                      action={() =>
                                        openRemoveActionModal(recog, recogIdx)
                                      }
                                    />
                                  </>
                                }
                              />
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </>
                }
              />
            </>
          )}
        </>
      </Card>
    </>
  );
};
