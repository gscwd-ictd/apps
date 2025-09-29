/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF';
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/Eligibility';
import { useApplicantStore } from '../../../../store/applicant.store';
import { Eligibility } from 'apps/job-portal/utils/types/data/eligibility.type';
import dayjs from 'dayjs';

export const CSEligibility = (): JSX.Element => {
  // initialize useref and assign it to examDateToRef
  const examDateToRef = useRef<any>(null);
  // set eligiblity array, employee object state
  const { eligibility, setEligibility } = usePdsStore((state) => ({
    eligibility: state.eligibility,
    setEligibility: state.setEligibility,
  }));
  const applicant = useApplicantStore((state) => state.applicant);
  const [addEligIsOpen, setAddEligIsOpen] = useState<boolean>(false); // set add modal state
  const [removeEligIsOpen, setRemoveEligIsOpen] = useState<boolean>(false); // set remove action modal state
  const [eligToRemove, setEligToRemove] = useState<number>(-1); // set eligibility to remove state (number)
  const [removedElig, setRemovedElig] = useState<Eligibility>({} as Eligibility);
  const deletedEligibilities = usePdsStore((state) => state.deletedEligibilities);
  const setDeletedEligibilities = usePdsStore((state) => state.setDeletedEligibilities);

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
      isOneDayOfExam: false,
      name: '',
      rating: '',
      examDate: { from: '', to: null },
      examDateFrom: '',
      examDateTo: null,
      examPlace: '',
      licenseNumber: '',
      validity: null,
    },
  });

  const getIsOneDayOfExam = getValues('isOneDayOfExam'); // assign getvalues is one day of exam
  const watchIsOneDayOfExam = watch('isOneDayOfExam'); // assign watch is one day of exam

  // fire submit button
  const onSubmit = handleSubmit((elig: Eligibility, e: any) => {
    e.preventDefault();
    // chekcs if inclusive dates are valid
    // if (elig.examDateTo === '') elig.examDateTo = elig.examDateFrom
    setValue('examDate.from', getValues('examDateFrom')!);
    setValue('examDate.to', getValues('examDateTo')!);

    elig.examDate.from = elig.examDateFrom!;
    elig.examDate.to = elig.examDateTo!;

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
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddEligIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddEligIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (elig: Eligibility, eligIdx: number) => {
    setRemoveEligIsOpen(true);
    setEligToRemove(eligIdx);
    setRemovedElig(elig);
  };

  // remove course action
  const handleRemoveElig = (eligIdx: number) => {
    const updatedElig = [...eligibility];
    const deleted = [...deletedEligibilities];
    deleted.push(removedElig);
    setDeletedEligibilities(deleted);
    updatedElig.splice(eligIdx, 1);
    setEligibility(updatedElig);
    setRemoveEligIsOpen(false);
  };

  // set exam date to null if one day of exam is ticked
  useEffect(() => {
    if (getIsOneDayOfExam === true) {
      setValue('examDateTo', null);
      clearErrors('examDateTo');
    }
  }, [watchIsOneDayOfExam]);

  return (
    <>
      <Card
        title="Eligibility"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Eligibility"
            type="button"
            shadow
            variant="theme"
            onClick={openModal}
            className="xs:w-full sm:w-full lg:w-72"
          />
        }
      >
        <>
          <Modal
            title="Eligibility"
            subtitle={
              <>
                CES/ CSEE/ CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER SPECIAL LAWS/ CATEGORY II/IV ELIGIBILITY &
                ELIGIBILITIES FOR UNIFORMED PERSONNEL <br></br> Please fill-out all required fields ({' '}
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
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
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
                      placeholder={getIsOneDayOfExam === true ? 'Same Day' : ''}
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
                    label="Date of Validity"
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
          </Modal>
          <ModalAction
            isOpen={removeEligIsOpen}
            setIsOpen={setRemoveEligIsOpen}
            action={() => handleRemoveElig(eligToRemove)}
          />
          {eligibility.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Eligibility Name" headerWidth="w-[25%]" className="pl-4" />
                    <TableHeader label="Rating" headerWidth="w-[5%]" />
                    <TableHeader label="Date of Exam/Conferment" headerWidth="w-[15%]" />
                    <TableHeader label="Place of Examination" headerWidth="w-[20%]" />
                    <TableHeader label="License Number" headerWidth="w-[10%]" />
                    <TableHeader label="Date of Validity" headerWidth="w-[10%]" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                  </>
                }
                tableBody={
                  <tbody>
                    {eligibility.map((elig: Eligibility, eligIdx: number) => {
                      return (
                        <tr
                          key={eligIdx}
                          className="odd:bg-gray-100/80 even:bg-gray-200/70 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                        >
                          <TableDimension isText={true} label={elig.name} className="px-4" />
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
                          <TableDimension isText={true} className="px-1" label={elig.examPlace} />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={elig.licenseNumber ? elig.licenseNumber : 'N/A'}
                          />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={elig.validity ? dayjs(elig.validity).format('YYYY-MM-DD') : 'N/A'}
                          />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                <DeleteButton action={() => openRemoveActionModal(elig, eligIdx)} />
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
