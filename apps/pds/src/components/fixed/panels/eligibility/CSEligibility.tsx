import { useContext, useEffect, useRef, useState } from 'react';
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
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF';
import { DeleteButton } from '../../buttons/Delete';
import { Eligibility } from '../../../../types/data/eligibility.type';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import schema from '../../../../schema/Eligibility';
import { EligibilityAlert } from './EligibilityAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';

export const CSEligibility = (): JSX.Element => {
  // initialize useref and assign it to examDateToRef
  const examDateToRef = useRef<any>(null);
  // set eligiblity array, employee object state
  const eligibility = usePdsStore((state) => state.eligibility);

  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addEligIsOpen, setAddEligIsOpen] = useState<boolean>(false); // set add modal state
  const [removeEligIsOpen, setRemoveEligIsOpen] = useState<boolean>(false); // set remove action modal state
  const [eligToRemove, setEligToRemove] = useState<number>(-1); // set eligibility to remove state (number)
  const eligibilityOnEdit = usePdsStore((state) => state.eligibilityOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const deletedEligibilities = useUpdatePdsStore(
    (state) => state.deletedEligibilities
  );
  const [removedElig, setRemovedElig] = useState<Eligibility>(
    {} as Eligibility
  );
  const [action, setAction] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const [eligForEdit, setEligForEdit] = useState<Eligibility>(
    {} as Eligibility
  );
  const allowEditEligibility = useUpdatePdsStore(
    (state) => state.allowEditEligibility
  );
  const allowDeleteEligibility = useUpdatePdsStore(
    (state) => state.allowDeleteEligibility
  );
  const setEligibility = usePdsStore((state) => state.setEligibility);

  // initialize react hook form and set default values, mode is set to on change
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    watch,
    clearErrors,
    register,
    formState: { errors },
  } = useForm<Eligibility>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      employeeId: employee.employmentDetails.userId,
      isOneDayOfExam: false,
      name: '',
      rating: '',
      examDate: { from: '', to: null },
      examDateFrom: '',
      examDateTo: '',
      examPlace: '',
      licenseNumber: '',
      validity: null,
      isEdited: false,
    },
  });

  const getIsOneDayOfExam = getValues('isOneDayOfExam'); // assign getvalues is one day of exam
  const watchIsOneDayOfExam = watch('isOneDayOfExam'); // assign watch is one day of exam

  const setInitialValues = () => {
    setEligibility(initialPdsState.eligibility);
  };

  // fire submit button
  const onSubmit = handleSubmit((elig: Eligibility, e: any) => {
    e.preventDefault();
    setValue('examDate.from', getValues('examDateFrom')!);
    setValue('examDate.to', getValues('examDateTo')!);

    elig.examDate.from = elig.examDateFrom!;
    elig.examDate.to = elig.examDateTo!;
    // create action
    if (action === 'create') {
      const updatedElig = [...eligibility];
      updatedElig.push(elig);
      const sortedUpdatedElig = [...updatedElig].sort((firstItem, secondItem) =>
        firstItem.examDate.from! > secondItem.examDate.from!
          ? -1
          : secondItem.examDate.from! > firstItem.examDate.from!
          ? 1
          : 0
      );
      setEligibility(sortedUpdatedElig);
      reset();
      setAddEligIsOpen(false);
      setAction('');
    }
    // update action
    else if (action === 'update') {
      const updatedEligs: Array<Eligibility> = [...eligibility];
      const newUpdatedEligs = updatedEligs.map(
        (previousElig: Eligibility, eligIdx: number) => {
          if (eligIdx === indexForEdit) {
            return {
              ...previousElig,
              _id: elig._id,
              employeeId: elig.employeeId,
              examDate: { from: elig.examDateFrom!, to: elig.examDateTo! },
              examDateFrom: elig.examDateFrom,
              examDateTo: elig.examDateTo,
              examPlace: elig.examPlace,
              isOneDayOfExam: elig.isOneDayOfExam,
              licenseNumber: elig.licenseNumber,
              name: elig.name,
              rating: elig.rating,
              validity: elig.validity,
              isEdited: true,
            };
          }

          return previousElig;
        }
      );
      const sortedUpdatedElig = [...newUpdatedEligs].sort(
        (firstItem, secondItem) =>
          firstItem.examDate.from! > secondItem.examDate.from!
            ? -1
            : secondItem.examDate.from! > firstItem.examDate.from!
            ? 1
            : 0
      );
      setEligibility(sortedUpdatedElig);
      setEligForEdit({} as Eligibility);
      setIndexForEdit(-1);
      reset();
      setAddEligIsOpen(false);
      setAction('');
    }
  });

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddEligIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    reset();
    setEligForEdit({} as Eligibility);
    clearErrors();
    setAddEligIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (eligIdx: number, elig: Eligibility) => {
    setRemoveEligIsOpen(true);
    setEligToRemove(eligIdx);
    setRemovedElig(elig);
  };

  // remove course action
  const handleRemoveElig = (eligIdx: number) => {
    const updatedElig = [...eligibility];
    updatedElig.splice(eligIdx, 1);
    if (!isEmpty(removedElig._id)) deletedEligibilities.push(removedElig);
    setEligibility(updatedElig);
    setRemoveEligIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (elig: Eligibility, index: number) => {
    setAction('update');
    setEligForEdit(elig);
    loadNewDefaultValues(elig);
    setAddEligIsOpen(true);
    setIndexForEdit(index);
  };

  // load default values when edit button is clicked
  const loadNewDefaultValues = (elig: Eligibility) => {
    setValue('_id', elig._id);
    setValue('name', elig.name);
    setValue('rating', elig.rating);
    setValue('licenseNumber', elig.licenseNumber);
    setValue('employeeId', elig.employeeId);
    setValue('examDateFrom', elig.examDate.from);
    setValue('examDateTo', elig.examDate.to);
    // setValue('examDate', elig.examDate);
    setValue('examPlace', elig.examPlace);
    setValue('isEdited', elig.isEdited);
    setIsLoaded(true);
  };

  // set exam date to null if one day of exam is ticked
  useEffect(() => {
    if (getIsOneDayOfExam === true) {
      setValue('examDateTo', null);
      clearErrors('examDateTo');
    }
  }, [watchIsOneDayOfExam]);

  // to load checkboxes
  useEffect(() => {
    if (isLoaded === true) {
      setTimeout(() => {
        if (eligForEdit.examDate.to === null) setValue('isOneDayOfExam', true);
        setIsLoaded(false);
      }, 100);
    }
  }, [isLoaded]);

  return (
    <>
      <Card
        title="Eligibility"
        subtitle=""
        remarks={
          <div className="flex flex-col items-end justify-end w-full">
            <EligibilityAlert setInitialValues={setInitialValues} />
          </div>
        }
      >
        <div
          className={`flex flex-col items-end justify-end ${
            eligibilityOnEdit
              ? '  visible'
              : !hasPds
              ? 'visible lg:-mt-6 lg:pb-6'
              : 'hidden'
          }`}
        >
          <Button
            btnLabel="Add Eligibility"
            type="button"
            variant="theme"
            onClick={openModal}
            className="xs:w-full sm:w-full lg:w-72"
          />
        </div>
        <>
          <Modal
            title="Eligibility"
            subtitle={
              <>
                CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER SPECIAL LAWS/ CES/
                CSEE BARANGAY ELIGIBILITY / DRIVER'S LICENSE <br></br> Please
                fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="eligibility"
            isOpen={addEligIsOpen}
            setIsOpen={setAddEligIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={false}
            verticalCenter
            modalSize="xxxxxl"
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
                      id="eligname"
                      name="eligname"
                      label="Eligibility Name"
                      placeholder="Write in Full. Do not abbreviate."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('name') }}
                      withLabel={true}
                      isError={errors.name ? true : false}
                      errorMessage={errors.name?.message}
                    />
                  </div>

                  <div className="w-full mt-10">
                    <InputReactForm
                      id="eligrating"
                      name="eligrating"
                      label="Rating"
                      placeholder={'Leave blank if not applicable'}
                      step={0.01}
                      type="number"
                      labelIsRequired={false}
                      controller={{ ...register('rating') }}
                      withLabel={true}
                      isError={errors.rating ? true : false}
                      errorMessage={errors.rating?.message}
                    />
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1">
                      <InputReactForm
                        id="eligfrom"
                        name="eligfrom"
                        label="From"
                        className="cursor-pointer"
                        placeholder=""
                        type="date"
                        labelIsRequired
                        controller={{
                          ...register('examDateFrom', { required: true }),
                        }}
                        withLabel={true}
                        isError={errors.examDateFrom ? true : false}
                        errorMessage={errors.examDateFrom?.message}
                      />
                    </div>
                    <div className="w-full col-span-1">
                      <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                        <CheckboxRF
                          id="isonedayofexam"
                          name="isonedayofexam"
                          label="One(1) day of exam only"
                          controller={{ ...register('isOneDayOfExam') }}
                        />
                      </div>
                      <InputReactForm
                        id="eligto"
                        name="eligto"
                        label="To"
                        innerRef={examDateToRef}
                        className="cursor-pointer"
                        placeholder={
                          getIsOneDayOfExam === true ? 'Same Day' : ''
                        }
                        labelIsRequired={!getIsOneDayOfExam}
                        type="date"
                        controller={{ ...register('examDateTo') }}
                        withLabel={true}
                        muted={getIsOneDayOfExam}
                        isError={errors.examDateTo ? true : false}
                        errorMessage={errors.examDateTo?.message}
                      />
                    </div>
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1 mb-10 sm:block">
                      <InputReactForm
                        id="eligexamplace"
                        name="eligexamplace"
                        label="Place of Examination or Conferment"
                        placeholder="Write in Full. Do not leave blank"
                        type="text"
                        labelIsRequired
                        controller={{
                          ...register('examPlace', { required: true }),
                        }}
                        withLabel={true}
                        isError={errors.examPlace ? true : false}
                        errorMessage={errors.examPlace?.message}
                      />
                    </div>
                    <div className="w-full col-span-1 mb-10 sm:block">
                      <InputReactForm
                        id="eligLicensenumber"
                        name="eligLicensenumber"
                        label="License Number"
                        placeholder="Leave blank if not applicable."
                        type="text"
                        withHelpButton
                        helpContent="Specify the license number if eligibility is under R.A. 1080"
                        controller={{
                          ...register('licenseNumber', { required: false }),
                        }}
                        withLabel={true}
                        isError={errors.licenseNumber ? true : false}
                        errorMessage={errors.licenseNumber?.message}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-10 ">
                    <InputReactForm
                      id="eligvalidity"
                      name="eligvalidity"
                      withHelpButton
                      helpContent="Leave blank if not applicable"
                      label="Date of Validity (Leave blank if not applicable)"
                      placeholder="Leave blank if not applicable"
                      type="date"
                      controller={{
                        ...register('validity', { required: false }),
                      }}
                      withLabel={true}
                      isError={errors.validity ? true : false}
                      errorMessage={errors.validity?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeEligIsOpen} setOpen={setRemoveEligIsOpen}>
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
                  onClick={() => setRemoveEligIsOpen(false)}
                  className="hover:bg-gray-200 active:bg-gray-200"
                >
                  No
                </Button>
                <Button
                  variant="theme"
                  onClick={() => handleRemoveElig(eligToRemove)}
                >
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {eligibility.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Eligibility Name"
                      headerWidth="w-[25%]"
                      className="pl-4"
                    />
                    <TableHeader label="Rating" headerWidth="w-[10%]" />
                    <TableHeader label="Date of Exam" headerWidth="w-[10%]" />
                    <TableHeader
                      label="Place of Examination"
                      headerWidth="w-[20%]"
                    />
                    <TableHeader label="License Number" headerWidth="w-[10%]" />
                    <TableHeader
                      label="Date of Validity"
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
                    {eligibility.map((elig: Eligibility, eligIdx: number) => {
                      return (
                        <tr
                          key={eligIdx}
                          className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                        >
                          <TableDimension
                            isText={true}
                            label={elig.name}
                            className="px-4"
                          />
                          <TableDimension
                            isText={true}
                            label={elig.rating ? elig.rating : 'N/A'}
                            className="px-1 select-none"
                          />
                          <TableDimension
                            isText={true}
                            isPeriod={elig.examDate.to === null ? false : true}
                            label={elig.examDate.from}
                            periodLabel1={elig.examDate.from}
                            periodLabel2={elig.examDate.to}
                            showPeriodIfNull={false}
                            className="break-words"
                          />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={elig.examPlace}
                          />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={
                              elig.licenseNumber ? elig.licenseNumber : 'N/A'
                            }
                          />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={elig.validity ? elig.validity : 'N/A'}
                          />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                {!isEmpty(elig._id) ? (
                                  <div className="flex justify-center gap-4">
                                    {allowEditEligibility ? (
                                      <div className="w-8">
                                        <EditButton
                                          action={() => onEdit(elig, eligIdx)}
                                          type="button"
                                          disabled={
                                            eligibilityOnEdit ? false : true
                                          }
                                        />
                                      </div>
                                    ) : null}

                                    {allowDeleteEligibility ? (
                                      <div className="w-8">
                                        <DeleteButton
                                          muted={
                                            hasPds && eligibilityOnEdit
                                              ? false
                                              : hasPds && !eligibilityOnEdit
                                              ? true
                                              : !hasPds && false
                                          }
                                          action={() =>
                                            openRemoveActionModal(eligIdx, elig)
                                          }
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                ) : isEmpty(elig._id) ? (
                                  <div className="flex justify-center gap-4">
                                    <div className="w-8">
                                      <EditButton
                                        action={() => onEdit(elig, eligIdx)}
                                        type="button"
                                      />
                                    </div>
                                    <div className="w-8">
                                      <DeleteButton
                                        action={() =>
                                          openRemoveActionModal(eligIdx, elig)
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
