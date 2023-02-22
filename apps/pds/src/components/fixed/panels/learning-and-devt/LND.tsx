import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { SelectListRF } from '../../../modular/select/SelectListRF';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteButton } from '../../buttons/Delete';
import schema from '../../../../schema/LND';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { LearningDevelopment } from '../../../../types/data/lnd.type';
import { lndType } from '../../../../../utils/constants/constants';
import { LearningDevelopmentAlert } from './LNDAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { EditButton } from 'components/fixed/buttons/Edit';
import { isEmpty } from 'lodash';

export const LearningNDevt = (): JSX.Element => {
  // set learning and development array, employee object state from pds store
  const learningDevelopment = usePdsStore((state) => state.learningDevelopment);
  const learningDevelopmentOnEdit = usePdsStore((state) => state.learningDevelopmentOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setLearningDevelopment = usePdsStore((state) => state.setLearningDevelopment);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const deletedLearningDevelopment = useUpdatePdsStore((state) => state.deletedLearningDevelopment);
  const [addLndIsOpen, setAddLndIsOpen] = useState<boolean>(false); // open add modal state
  const [removeLndIsOpen, setRemoveLndIsOpen] = useState<boolean>(false); // open remove modal state
  const [lndToRemove, setLndToRemove] = useState<number>(-1); // learning and development to remove state
  const [removedLnd, setRemovedLnd] = useState<LearningDevelopment>({} as LearningDevelopment);
  const [lndForEdit, setLndForEdit] = useState<LearningDevelopment>({} as LearningDevelopment);
  const [action, setAction] = useState<string>('');
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const allowDeleteLnd = useUpdatePdsStore((state) => state.allowDeleteLnd);
  const allowEditLnd = useUpdatePdsStore((state) => state.allowEditLnd);
  const allowAddLnd = useUpdatePdsStore((state) => state.allowAddLnd);
  const setAllowDeleteLnd = useUpdatePdsStore((state) => state.setAllowDeleteLnd);

  // initialize react hook form and set default values, mode is set to on change
  const {
    handleSubmit,
    register,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LearningDevelopment>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      title: '',
      conductedBy: '',
      type: '',
      from: '',
      to: '',
      numberOfHours: null,
      employeeId: employee.employmentDetails.userId,
      isEdited: false,
    },
  });

  // set initial values
  const setInitialValues = () => {
    setLearningDevelopment(initialPdsState.learningDevelopment);
  };

  // fire submit button
  const onSubmit = handleSubmit((training: LearningDevelopment, e: any) => {
    if (action === 'create') {
      e.preventDefault();
      // check if inclusive date is valid
      const updatedLnd = [...learningDevelopment];
      updatedLnd.push(training);
      const sortedUpdatedTraining = [...updatedLnd].sort((firstItem, secondItem) =>
        firstItem.to! > secondItem.to! ? -1 : secondItem.to! > firstItem.to! ? 1 : 0
      );
      setLearningDevelopment(sortedUpdatedTraining);
      reset();
      setAddLndIsOpen(false);
    } else if (action === 'update') {
      e.preventDefault();
      const updatedLnd = [...learningDevelopment];
      const newUpdatedLnd = updatedLnd.map((previousLnd: LearningDevelopment, lndIdx: number) => {
        if (lndIdx === indexForEdit) {
          return {
            ...previousLnd,
            _id: training._id,
            conductedBy: training.conductedBy,
            employeeId: training.employeeId,
            from: training.from,
            numberOfHours: training.numberOfHours,
            title: training.title,
            to: training.to,
            type: training.type,
          };
        }

        return previousLnd;
      });
      const sortedUpdatedTraining = [...newUpdatedLnd].sort((firstItem, secondItem) =>
        firstItem.to! > secondItem.to! ? -1 : secondItem.to! > firstItem.to! ? 1 : 0
      );
      setLearningDevelopment(sortedUpdatedTraining);
      setLndForEdit({} as LearningDevelopment);
      setIndexForEdit(-1);
      reset();
      setAddLndIsOpen(false);
      setAction('');
    }
  });

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddLndIsOpen(true);
  };

  // when edit button is clicked
  const onEdit = (lnd: LearningDevelopment, index: number) => {
    setAction('update');
    setLndForEdit(lnd);
    loadNewDefaultValues(lnd);
    setAddLndIsOpen(true);
    setIndexForEdit(index);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setLndForEdit({} as LearningDevelopment);
    reset();
    clearErrors();
    setAddLndIsOpen(false);
  };

  // load default values for update
  const loadNewDefaultValues = (lnd: LearningDevelopment) => {
    setValue('_id', lnd._id);
    setValue('conductedBy', lnd.conductedBy);
    setValue('employeeId', lnd.employeeId);
    setValue('from', lnd.from);
    setValue('numberOfHours', lnd.numberOfHours);
    setValue('title', lnd.title);
    setValue('to', lnd.to);
    setValue('type', lnd.type);
    setValue('isEdited', lnd.isEdited);
  };

  // open remove action modal
  const openRemoveActionModal = (lndIdx: number, lnd: LearningDevelopment) => {
    setRemoveLndIsOpen(true);
    setLndToRemove(lndIdx);
    setRemovedLnd(lnd);
  };

  // remove lnd action
  const handleRemoveTraining = (trainingIdx: number) => {
    const updatedLND = [...learningDevelopment];
    updatedLND.splice(trainingIdx, 1);
    deletedLearningDevelopment.push(removedLnd);
    setLearningDevelopment(updatedLND);
    setRemoveLndIsOpen(false);
  };

  return (
    <>
      <Card title="Learning & Development" subtitle="">
        <>
          <div className="flex flex-col items-end justify-end w-full pb-4 -mt-10">
            {allowEditLnd || allowDeleteLnd || allowAddLnd ? <LearningDevelopmentAlert setInitialValues={setInitialValues} /> : null}
          </div>

          <div
            className={`flex flex-col items-end justify-end pt-6 ${
              learningDevelopmentOnEdit ? 'visible  mt-6' : !hasPds ? 'visible -mt-6 pb-6 pr-6' : 'hidden'
            }`}
          >
            {allowAddLnd ? (
              <Button btnLabel="Add Learning & Development" type="button" variant="theme" shadow onClick={openModal} className="xs:w-full lg:w-72" />
            ) : null}
          </div>

          <Modal
            title="Learning & Development"
            subtitle={
              <>
                Start from the most recent L&D/training program and include only the relevant L&D/training taken for the last five (5) years for
                Division Chief/Executive/Managerial positions <br></br> Please fill-out all required fields ( <span className="text-red-700">*</span>{' '}
                )
              </>
            }
            formId="lnd"
            isOpen={addLndIsOpen}
            setIsOpen={setAddLndIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxxxl"
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            modalChildren={
              <>
                <div className="gap-4 p-5 mb-5">
                  <div className="w-full mb-5">
                    <InputReactForm
                      id="lndtitle"
                      name="lndtitle"
                      label="Title"
                      placeholder="Write in Full. Do not abbreviate."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('title') }}
                      withLabel={true}
                      isError={errors.title ? true : false}
                      errorMessage={errors.title?.message}
                    />
                  </div>

                  <div className="w-full mt-10">
                    <InputReactForm
                      id="lndconductedby"
                      name="lndconductedby"
                      label="Conducted By"
                      placeholder="Write in Full."
                      withHelpButton
                      helpContent="Indicate the FULL name of institution/agency that conducted or sponsored the program. Do not use abbreviation (e.g. CSC should be Civil Service Commission)."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('conductedBy') }}
                      withLabel={true}
                      isError={errors.conductedBy ? true : false}
                      errorMessage={errors.conductedBy?.message}
                    />
                  </div>

                  <div className="w-full mt-10">
                    <SelectListRF
                      id="lndtype"
                      selectList={lndType}
                      defaultOption=""
                      withLabel
                      variant="simple"
                      labelIsRequired
                      label="Type of Learning & Development"
                      controller={{ ...register('type') }}
                      appearance={'modal'}
                      isError={errors.type ? true : false}
                      errorMessage={errors.type?.message}
                    />
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:block lg:flex">
                    <div className="w-full col-span-1 mb-10">
                      <InputReactForm
                        id="lndfrom"
                        name="lndfrom"
                        label="From"
                        placeholder=""
                        type="date"
                        labelIsRequired
                        controller={{ ...register('from') }}
                        withLabel={true}
                        isError={errors.from ? true : false}
                        errorMessage={errors.from?.message}
                      />
                    </div>

                    <div className="w-full col-span-1 mb-10">
                      <InputReactForm
                        id="lndto"
                        name="lndto"
                        label="To"
                        placeholder=""
                        labelIsRequired
                        type="date"
                        controller={{ ...register('to') }}
                        withLabel={true}
                        isError={errors.to ? true : false}
                        errorMessage={errors.to?.message}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-10">
                    <InputReactForm
                      id="lndhours"
                      name="lndhours"
                      label="Number of Hours"
                      withHelpButton
                      helpContent="Indicate the number of hours attended for the program."
                      placeholder="Total number of hours"
                      type="number"
                      labelIsRequired
                      controller={{ ...register('numberOfHours') }}
                      withLabel={true}
                      isError={errors.numberOfHours ? true : false}
                      errorMessage={errors.numberOfHours?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeLndIsOpen} setOpen={setRemoveLndIsOpen}>
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
                <Button variant="light" onClick={() => setRemoveLndIsOpen(false)} className="hover:bg-gray-200 active:bg-gray-200">
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveTraining(lndToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {learningDevelopment.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Title" headerWidth="w-[25%]" className="pl-4" />
                    <TableHeader label="Conducted By" headerWidth="w-[25%]" />
                    <TableHeader label="Type" headerWidth="w-[10%]" />
                    <TableHeader label="Date Start" headerWidth="w-[10%]" />
                    <TableHeader label="Date End" headerWidth="w-[10%]" />
                    <TableHeader label="Number of Hours" headerWidth="w-[10%]" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                  </>
                }
                tableBody={
                  <tbody>
                    {learningDevelopment.map((training: LearningDevelopment, trainingIdx: number) => {
                      return (
                        <tr
                          key={trainingIdx}
                          className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                        >
                          <TableDimension isText={true} label={training.title} className="px-4" />
                          <TableDimension isText={true} label={training.conductedBy} className="px-1 select-none" />
                          <TableDimension isText={true} className="px-1" label={training.type} />
                          <TableDimension isText={true} className="px-1" label={training.from} />
                          <TableDimension isText={true} className="px-1" label={training.to} />
                          <TableDimension isText={true} className="px-1" label={training.numberOfHours} />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                {!isEmpty(training._id) ? (
                                  <div className="flex justify-center gap-4">
                                    {allowEditLnd ? (
                                      <div className="w-8">
                                        <EditButton
                                          action={() => onEdit(training, trainingIdx)}
                                          disabled={learningDevelopmentOnEdit ? false : true}
                                        />
                                      </div>
                                    ) : null}
                                    {allowDeleteLnd ? (
                                      <div className="w-8 ">
                                        <DeleteButton
                                          muted={
                                            hasPds && learningDevelopmentOnEdit
                                              ? false
                                              : hasPds && !learningDevelopmentOnEdit
                                              ? true
                                              : !hasPds && false
                                          }
                                          action={() => openRemoveActionModal(trainingIdx, training)}
                                        />
                                      </div>
                                    ) : null}
                                    {!allowEditLnd && !allowDeleteLnd ? <div className="flex justify-center w-full">-</div> : null}
                                  </div>
                                ) : isEmpty(training._id) ? (
                                  <div className="flex justify-center gap-4">
                                    <div className="w-8">
                                      <EditButton action={() => onEdit(training, trainingIdx)} disabled={learningDevelopmentOnEdit ? false : true} />
                                    </div>
                                    <div className="w-8 ">
                                      <DeleteButton
                                        muted={
                                          hasPds && learningDevelopmentOnEdit ? false : hasPds && !learningDevelopmentOnEdit ? true : !hasPds && false
                                        }
                                        action={() => openRemoveActionModal(trainingIdx, training)}
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
                }
              />
            </>
          )}
        </>
      </Card>
    </>
  );
};
