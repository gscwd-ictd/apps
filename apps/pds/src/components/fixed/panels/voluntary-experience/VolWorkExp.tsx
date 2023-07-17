import { useEffect, useState } from 'react';
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
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import schema from '../../../../schema/VolWork';
import { VoluntaryWork } from '../../../../types/data/vol-work.type';
import { VoluntaryWorkAlert } from './VoluntaryWorkAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';

export const VolWorkExp = (): JSX.Element => {
  // set voluntary work array, employee object state from pds context
  const voluntaryWork = usePdsStore((state) => state.voluntaryWork);
  const voluntaryWorkOnEdit = usePdsStore((state) => state.voluntaryWorkOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setVoluntaryWork = usePdsStore((state) => state.setVoluntaryWork);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addVolWorkIsOpen, setAddVolWorkIsOpen] = useState<boolean>(false); // open add modal
  const [removeVolWorkIsOpen, setRemoveVolWorkIsOpen] =
    useState<boolean>(false); // remove voluntary work state
  const [volWorkToRemove, setVolWorkToRemove] = useState<number>(-1); // voluntary work to remove (number)
  const [removedVolWork, setRemovedVolWork] = useState<VoluntaryWork>(
    {} as VoluntaryWork
  );
  const deletedVolWork = useUpdatePdsStore((state) => state.deletedVolWork);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const [volForEdit, setVolForEdit] = useState<VoluntaryWork>(
    {} as VoluntaryWork
  );
  const [action, setAction] = useState<string>('');
  const allowEditVolWork = useUpdatePdsStore((state) => state.allowEditVolWork);
  const allowDeleteVolWork = useUpdatePdsStore(
    (state) => state.allowDeleteVolWork
  );

  // initialize react hook form and set default values, mode is set to on change
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    watch,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<VoluntaryWork>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      isCurrentlyVol: false,
      organizationName: '',
      position: '',
      from: '',
      to: '',
      numberOfHours: null,
      employeeId: employee.employmentDetails.userId,
      isEdited: false,
      // isHoursApplicable: true,
    },
  });

  const getIsCurrentlyVol = getValues('isCurrentlyVol'); // assign getvalues is currently volunteering
  const watchIsCurrentlyVol = watch('isCurrentlyVol'); // assign watch is currently volunteering

  // const getIsHoursApplicable = getValues('isHoursApplicable');
  // const watchIsHoursApplicable = watch('isHoursApplicable');
  // set initial values
  const setInitialValues = () => {
    setVoluntaryWork(initialPdsState.voluntaryWork);
  };

  // fire submit button
  const onSubmit = handleSubmit((work: VoluntaryWork, e: any) => {
    e.preventDefault();
    if (work.to === '') work.to = null;
    // create action
    if (action === 'create') {
      const createdVolWorks = [...voluntaryWork];
      createdVolWorks.push(work);
      const sortedUpdatedVolWorks = [...createdVolWorks].sort(
        (firstItem, secondItem) =>
          firstItem.from! > secondItem.from!
            ? -1
            : secondItem.from! > firstItem.from!
            ? 1
            : 0
      );
      setVoluntaryWork(sortedUpdatedVolWorks);
      reset();
      setAction('');
      setAddVolWorkIsOpen(false);
    }
    // update action
    else if (action === 'update') {
      const updatedVolWorks: Array<VoluntaryWork> = [...voluntaryWork];
      const newUpdatedVolWorks = updatedVolWorks.map(
        (previousVolWorks: VoluntaryWork, volWorkIdx: number) => {
          if (volWorkIdx === indexForEdit) {
            return {
              ...previousVolWorks,
              _id: work._id,
              employeeId: work.employeeId,
              from: work.from,
              isCurrentlyVol: work.isCurrentlyVol,
              numberOfHours: work.numberOfHours,
              organizationName: work.organizationName,
              position: work.position,
              to: work.to,
              isEdited: true,
            };
          }

          return previousVolWorks;
        }
      );

      const sortedUpdatedVolWorks = [...newUpdatedVolWorks].sort(
        (firstItem, secondItem) =>
          firstItem.from! > secondItem.from!
            ? -1
            : secondItem.from! > firstItem.from!
            ? 1
            : 0
      );
      setVoluntaryWork(sortedUpdatedVolWorks);
      setVolForEdit({} as VoluntaryWork);
      setIndexForEdit(-1);
      reset();
      setAddVolWorkIsOpen(false);
      setAction('');
    }
  });

  // when edit button is clicked
  const onEdit = (work: VoluntaryWork, index: number) => {
    setAction('update');
    setVolForEdit(work);
    loadNewDefaultValues(work);
    setAddVolWorkIsOpen(true);
    setIndexForEdit(index);
  };

  // load data on edit
  const loadNewDefaultValues = (work: VoluntaryWork) => {
    setValue('_id', work._id);
    setValue('employeeId', work.employeeId);
    setValue('from', work.from);
    setValue('to', work.to);
    // setValue('isCurrentlyVol', )
    setValue('numberOfHours', work.numberOfHours);
    setValue('organizationName', work.organizationName);
    setValue('position', work.position);
    setValue('isEdited', work.isEdited);
    setIsLoaded(true);
  };

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddVolWorkIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    reset();
    setVolForEdit({} as VoluntaryWork);
    clearErrors();
    setAddVolWorkIsOpen(false);
  };

  // remove action modal
  const openRemoveActionModal = (
    volWorkIdx: number,
    volWork: VoluntaryWork
  ) => {
    setRemoveVolWorkIsOpen(true);
    setVolWorkToRemove(volWorkIdx);
    setRemovedVolWork(volWork);
  };

  // remove work action
  const handleRemoveWork = (workIdx: number) => {
    const updatedVolWorks = [...voluntaryWork];
    updatedVolWorks.splice(workIdx, 1);
    if (!isEmpty(removedVolWork._id)) deletedVolWork.push(removedVolWork);
    setVoluntaryWork(updatedVolWorks);
    setRemoveVolWorkIsOpen(false);
  };

  // set the date-to to default if Currently Volunteering is ticked
  useEffect(() => {
    if (getIsCurrentlyVol === true) {
      setValue('to', null);
      setValue('numberOfHours', null);
      clearErrors('numberOfHours');
      clearErrors('to');
    }
  }, [watchIsCurrentlyVol]);

  // when loaded is set to true
  useEffect(() => {
    if (isLoaded === true) {
      setTimeout(() => {
        if (isEmpty(volForEdit.to) || volForEdit.to === null)
          setValue('isCurrentlyVol', true);
        setIsLoaded(false);
      }, 100);
    }
  }, [isLoaded]);

  return (
    <>
      <Card
        title="Voluntary Work Experience"
        subtitle=""
        remarks={<VoluntaryWorkAlert setInitialValues={setInitialValues} />}
      >
        <div
          className={`flex flex-col items-end justify-end ${
            voluntaryWorkOnEdit ? 'visible' : !hasPds ? 'visible' : 'hidden'
          }`}
        >
          <Button
            btnLabel="Add Voluntary Work"
            type="button"
            variant="theme"
            shadow
            onClick={openModal}
            className="xs:w-full sm:w-full lg:w-72"
          />
        </div>

        <>
          <Modal
            title="Voluntary Work Experience"
            subtitle={
              <>
                Involvment in Civic/Non-Government /People/Voluntary
                Organizations <br></br> Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="volwork"
            isOpen={addVolWorkIsOpen}
            setIsOpen={setAddVolWorkIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxxxl"
            actionLabel={
              action === 'create'
                ? 'Submit'
                : action === 'update'
                ? 'Update'
                : ''
            }
            cancelLabel="Cancel"
            modalChildren={
              <>
                <div className="gap-4 p-5 mb-5">
                  <div className="w-full mb-5">
                    <InputReactForm
                      id="volworkorgname"
                      name="volworkorgname"
                      label="Organization Name"
                      placeholder="Write in Full. Do not abbreviate."
                      type="text"
                      labelIsRequired
                      controller={{
                        ...register('organizationName'),
                      }}
                      withLabel={true}
                      isError={errors.organizationName ? true : false}
                      errorMessage={errors.organizationName?.message}
                    />
                  </div>

                  <div className="w-full mt-5 ">
                    <InputReactForm
                      id="volworkpos"
                      name="volworkpos"
                      label="Position Title"
                      placeholder="Write in Full."
                      type="text"
                      labelIsRequired
                      controller={{
                        ...register('position'),
                      }}
                      withLabel={true}
                      isError={errors.position ? true : false}
                      errorMessage={errors.position?.message}
                    />
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1 sm:block">
                      <InputReactForm
                        id="volworkfrom"
                        name="volworkfrom"
                        label="From"
                        placeholder=""
                        type="date"
                        className="cursor-pointer"
                        labelIsRequired
                        controller={{ ...register('from') }}
                        withLabel={true}
                        isError={errors.from ? true : false}
                        errorMessage={errors.from?.message}
                      />
                    </div>
                    <div className="w-full col-span-1 sm:block">
                      <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                        <CheckboxRF
                          id="isCurrentlyVol"
                          name="isCurrentlyVol"
                          label="Currently Volunteering?"
                          controller={{ ...register('isCurrentlyVol') }}
                        />
                      </div>
                      <InputReactForm
                        id="volworkto"
                        name="volworkto"
                        label="To"
                        placeholder=""
                        className="cursor-pointer"
                        labelIsRequired={!getIsCurrentlyVol}
                        type="date"
                        controller={{ ...register('to') }}
                        withLabel={true}
                        muted={getIsCurrentlyVol}
                        isError={errors.to ? true : false}
                        errorMessage={errors.to?.message}
                      />
                    </div>
                  </div>

                  <div className="w-full my-10">
                    <InputReactForm
                      id="volworkhours"
                      name="volworkhours"
                      label="Number of Hours"
                      placeholder={
                        getIsCurrentlyVol === false
                          ? 'Total number of hours / Leave blank if not applicable'
                          : 'Not Applicable'
                      }
                      withHelpButton
                      helpContent="Indicate the number of hours of voluntary work rendered."
                      type="number"
                      muted={getIsCurrentlyVol}
                      isError={errors.numberOfHours ? true : false}
                      errorMessage={errors.numberOfHours?.message}
                      withLabel
                      controller={{
                        ...register('numberOfHours'),
                      }}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeVolWorkIsOpen} setOpen={setRemoveVolWorkIsOpen}>
            <Alert.Description>
              <div className="flex gap-2">
                <div className="w-[25%] text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-20 h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <p className="w-[75%] px-4">
                  Are you sure you want to remove this? This action cannot be
                  undone.{' '}
                </p>
              </div>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                <Button
                  variant="light"
                  onClick={() => setRemoveVolWorkIsOpen(false)}
                  className="hover:bg-gray-200 active:bg-gray-200"
                >
                  No
                </Button>
                <Button
                  variant="theme"
                  onClick={() => handleRemoveWork(volWorkToRemove)}
                >
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {voluntaryWork.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Organization Name"
                      headerWidth="w-[25%]"
                      className="pl-4"
                    />
                    <TableHeader label="Position" headerWidth="w-[25%]" />
                    <TableHeader label="Date Start" headerWidth="w-[10%]" />
                    <TableHeader label="Date End" headerWidth="w-[10%]" />
                    <TableHeader
                      label="Number of Hours"
                      headerWidth="w-[10%]"
                    />
                    <TableHeader
                      label="Actions"
                      headerWidth="w-[15%]"
                      alignment="center"
                    />
                  </>
                }
                tableBody={
                  <tbody>
                    {voluntaryWork.map(
                      (work: VoluntaryWork, workIdx: number) => {
                        return (
                          <tr
                            key={workIdx}
                            className="odd:bg-slate-100 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all "
                          >
                            <TableDimension
                              isText={true}
                              label={work.organizationName}
                              className="px-4 "
                            />
                            <TableDimension
                              isText={true}
                              label={work.position}
                              className="px-1 select-none"
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={work.from}
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={work.to ? work.to : 'Ongoing'}
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={
                                work.numberOfHours ? work.numberOfHours : 'N/A'
                              }
                            />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  {!isEmpty(work._id) ? (
                                    <div className="flex justify-center gap-4">
                                      {/* EDIT VOL WORK */}
                                      {allowEditVolWork ? (
                                        <div className="w-8">
                                          <EditButton
                                            disabled={
                                              hasPds && voluntaryWorkOnEdit
                                                ? false
                                                : hasPds && !voluntaryWorkOnEdit
                                                ? true
                                                : !hasPds && false
                                            }
                                            action={() => onEdit(work, workIdx)}
                                          />
                                        </div>
                                      ) : null}
                                      {/* DELETE VOL WORK */}
                                      {allowDeleteVolWork ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            muted={
                                              hasPds && voluntaryWorkOnEdit
                                                ? false
                                                : hasPds && !voluntaryWorkOnEdit
                                                ? true
                                                : !hasPds && false
                                            }
                                            action={() =>
                                              openRemoveActionModal(
                                                workIdx,
                                                work
                                              )
                                            }
                                          />
                                        </div>
                                      ) : isEmpty(work._id) ? (
                                        <div className="flex justify-center gap-4">
                                          <div className="w-8">
                                            <EditButton
                                              action={() =>
                                                onEdit(work, workIdx)
                                              }
                                            />
                                          </div>
                                          <div className="w-8">
                                            <DeleteButton
                                              action={() =>
                                                openRemoveActionModal(
                                                  workIdx,
                                                  work
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : isEmpty(work._id) ? (
                                    <div className="flex gap-4 items-center justify-center">
                                      <div className="w-8">
                                        <EditButton
                                          action={() => onEdit(work, workIdx)}
                                        />
                                      </div>
                                      <div className="w-8">
                                        <DeleteButton
                                          action={() =>
                                            openRemoveActionModal(workIdx, work)
                                          }
                                        />
                                      </div>
                                    </div>
                                  ) : null}
                                </>
                              }
                            />
                          </tr>
                        );
                      }
                    )}
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
