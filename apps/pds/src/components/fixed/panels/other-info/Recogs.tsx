import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import schema from '../../../../schema/Recognitions';
import { Recognition } from '../../../../types/data/other-info.type';
import { RecognitionsAlert } from './RecogsAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { isEmpty } from 'lodash';
import { EditButton } from 'components/fixed/buttons/Edit';

export const OIRecogs = (): JSX.Element => {
  // set recognition array, employee object state from pds context
  const recognitions = usePdsStore((state) => state.recognitions);
  const recognitionsOnEdit = usePdsStore((state) => state.recognitionsOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setRecognitions = usePdsStore((state) => state.setRecognitions);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addRecogIsOpen, setAddRecogIsOpen] = useState<boolean>(false); // add modal state
  const [removeRecogIsOpen, setRemoveRecogIsOpen] = useState<boolean>(false); // remove recognition modal state
  const [recogToRemove, setRecogToRemove] = useState<number>(-1); // recognition to remove state
  const [removedRecognition, setRemovedRecognition] = useState<Recognition>({} as Recognition);
  const setDeletedRecognitions = useUpdatePdsStore((state) => state.setDeletedRecognitions);
  const deletedRecognitions = useUpdatePdsStore((state) => state.deletedRecognitions);
  const [recogForEdit, setRecogForEdit] = useState<Recognition>({} as Recognition);
  const [action, setAction] = useState<string>('');
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const allowAddRecog = useUpdatePdsStore((state) => state.allowAddRecog);
  const allowEditRecog = useUpdatePdsStore((state) => state.allowEditRecog);
  const allowDeleteRecog = useUpdatePdsStore((state) => state.allowDeleteRecog);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Recognition>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', employeeId: employee.employmentDetails.userId, recognition: '', isEdited: false },
  });

  // set initial values
  const setInitialValues = () => {
    setRecognitions(initialPdsState.recognitions);
  };

  // fire submit button
  const onSubmit = handleSubmit((recog: Recognition, e: any) => {
    e.preventDefault();

    // create action
    if (action === 'create') {
      const createdRecogs = [...recognitions];
      createdRecogs.push(recog);
      setRecognitions(createdRecogs);
      reset();
      setAddRecogIsOpen(false);
      setAction('');
    }
    // update action
    else if (action === 'update') {
      const updatedRecogs: Array<Recognition> = [...recognitions];
      const newUpdatedRecogs = updatedRecogs.map((previousRecog: Recognition, recogIdx: number) => {
        if (recogIdx === indexForEdit) {
          return { ...previousRecog, _id: recog._id, employeeId: recog.employeeId, recognition: recog.recognition, isEdited: true };
        }
        return previousRecog;
      });

      setRecognitions(newUpdatedRecogs);
      setRecogForEdit({} as Recognition);
      setIndexForEdit(-1);
      reset();
      setAddRecogIsOpen(false);
      setAction('');
    }
  });

  // open add modal
  const openModal = () => {
    reset();
    setAction('create');
    clearErrors();
    setAddRecogIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setRecogForEdit({} as Recognition);
    reset();
    clearErrors();
    setAddRecogIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (recog: Recognition, index: number) => {
    setAction('update');
    setRecogForEdit(recog);
    loadNewDefaultValues(recog); //!
    setAddRecogIsOpen(true);
    setIndexForEdit(index);
  };

  // load state
  const loadNewDefaultValues = (recog: Recognition) => {
    setValue('_id', recog._id);
    setValue('employeeId', recog.employeeId);
    setValue('recognition', recog.recognition);
    setValue('isEdited', recog.isEdited);
  };

  // remove action modal
  const openRemoveActionModal = (recogIdx: number, recognition: Recognition) => {
    setRemoveRecogIsOpen(true);
    setRecogToRemove(recogIdx);
    setRemovedRecognition(recognition);
  };

  // remove action
  const handleRemoveTitle = (recogIdx: number) => {
    const updatedRecogs = [...recognitions];
    updatedRecogs.splice(recogIdx, 1);
    if (!isEmpty(removedRecognition._id)) deletedRecognitions.push(removedRecognition);
    setRecognitions(updatedRecogs);
    setRemoveRecogIsOpen(false);
  };

  return (
    <>
      <Card title="Non-academic Distinctions & Recognitions" subtitle="">
        <>
          <div className="flex flex-col items-end justify-end w-full pb-4 -mt-10">
            {allowAddRecog || allowEditRecog || allowDeleteRecog ? <RecognitionsAlert setInitialValues={setInitialValues} /> : null}
          </div>

          <div
            className={`flex flex-col items-end justify-end pt-6 ${
              recognitionsOnEdit ? 'visible  mt-6' : !hasPds ? 'visible -mt-6 pb-6 pr-6' : 'hidden'
            }`}
          >
            {allowAddRecog ? (
              <Button
                btnLabel="Add Distinction or Recognition"
                variant="theme"
                type="button"
                shadow
                className="sm:w-full md:w-72 lg:w-72"
                onClick={openModal}
              />
            ) : null}
          </div>

          <Modal
            title="Non-academic Distinction & Recognition"
            subtitle={
              <>
                Please fill-out all required fields ( <span className="text-red-700">*</span> )
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
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            modalChildren={
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
                      controller={{ ...register('recognition', { required: true }) }}
                      withLabel={true}
                      isError={errors.recognition && errors.recognition.message ? true : false}
                      errorMessage={errors.recognition?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeRecogIsOpen} setOpen={setRemoveRecogIsOpen}>
            <Alert.Description>
              <div className="flex gap-2">
                <div className="w-[25%] text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-20 h-20">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <p className="w-[75%] px-4">Are you sure you want to remove this? This action cannot be undone. </p>
              </div>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                {' '}
                <Button variant="light" onClick={() => setRemoveRecogIsOpen(false)} className="hover:bg-gray-200 active:bg-gray-200">
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveTitle(recogToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {recognitions.length === 0 ? (
            <>
              <NoDataVisual />
            </>
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Title" headerWidth="w-[85%]" className="px-28" textSize="sm" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" textSize="sm" alignment="center" />
                  </>
                }
                tableBody={
                  <>
                    <tbody>
                      {recognitions.map((recog: Recognition, recogIdx: number) => {
                        return (
                          <tr
                            key={recogIdx}
                            className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                          >
                            <TableDimension isText={true} label={recog.recognition} className="px-28" textSize="lg" />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  {!isEmpty(recog._id) ? (
                                    <div className="flex justify-center gap-4">
                                      {allowEditRecog ? (
                                        <div className="w-8">
                                          <EditButton
                                            disabled={hasPds && recognitionsOnEdit ? false : hasPds && !recognitionsOnEdit ? true : !hasPds && false}
                                            action={() => onEdit(recog, recogIdx)}
                                          />
                                        </div>
                                      ) : null}
                                      {allowDeleteRecog ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            muted={hasPds && recognitionsOnEdit ? false : hasPds && !recognitionsOnEdit ? true : !hasPds && false}
                                            action={() => openRemoveActionModal(recogIdx, recog)}
                                          />
                                        </div>
                                      ) : null}
                                      {!allowEditRecog && !allowDeleteRecog ? <div className="flex justify-center w-full">-</div> : null}
                                    </div>
                                  ) : isEmpty(recog._id) ? (
                                    <div className="flex justify-center gap-4">
                                      <div className="w-8">
                                        <EditButton
                                          disabled={hasPds && recognitionsOnEdit ? false : hasPds && !recognitionsOnEdit ? true : !hasPds && false}
                                          action={() => onEdit(recog, recogIdx)}
                                        />
                                      </div>
                                      <div className="w-8">
                                        <DeleteButton
                                          muted={hasPds && recognitionsOnEdit ? false : hasPds && !recognitionsOnEdit ? true : !hasPds && false}
                                          action={() => openRemoveActionModal(recogIdx, recog)}
                                        />
                                      </div>
                                    </div>
                                  ) : null}
                                </>
                              }
                            />
                          </tr>
                        );
                      })}
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
