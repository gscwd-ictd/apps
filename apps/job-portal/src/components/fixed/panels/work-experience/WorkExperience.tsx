import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { SelectListRF } from '../../../modular/select/SelectListRF';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF';
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { isEmpty } from 'lodash';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/WorkExp';
import { apptStatus, govtApptStatus, govtService } from '../../../../../utils/constants/constants';
import { useApplicantStore } from '../../../../store/applicant.store';
import { EditButton } from '../../buttons/Edit';
import { WorkExperience } from 'apps/job-portal/utils/types/data/work.type';

export const WorkExp = (): JSX.Element => {
  // set work experience array, employee object state from pds context
  const workExperience = usePdsStore((state) => state.workExperience);
  const setWorkExperience = usePdsStore((state) => state.setWorkExperience);
  const applicant = useApplicantStore((state) => state.applicant);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const [addWorkExpIsOpen, setAddWorkExpIsOpen] = useState<boolean>(false); // open add modal state
  const [removeWorkExpIsOpen, setRemoveWorkExpIsOpen] = useState<boolean>(false); // remove work modal state
  const [workExpToRemove, setWorkExpToRemove] = useState<number>(-1); // work experience to remove state (number)
  const isExistingApplicant = useApplicantStore((state) => state.isExistingApplicant);
  const [editIsClicked, setEditIsClicked] = useState<boolean>(false);
  const [workForEdit, setWorkForEdit] = useState<WorkExperience>({} as WorkExperience);
  const [isPresentWorkMuted, setIsPresentWorkMuted] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');

  // initialize react hook form and set default values, mode is on change
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    clearErrors,
    register,
    watch,
    formState: { errors },
  } = useForm<WorkExperience>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isPresentWork: false,
      _id: '',
      positionTitle: '',
      companyName: '',
      monthlySalary: null,
      appointmentStatus: '',
      isGovernmentService: false,
      salaryGrade: null,
      from: '',
      to: null,
    },
  });
  const getIsPresentWork = getValues('isPresentWork'); // assign getvalues is present work
  const getIsGovtService = getValues('isGovernmentService'); // assign getvalues is government service
  const watchIsPresentWork = watch('isPresentWork'); // assign watch is present work
  const watchIsGovtService = watch('isGovernmentService'); // assign watch is govt service

  // fire submit button
  const onSubmit: SubmitHandler<any> = handleSubmit((workExp: WorkExperience, e: any) => {
    e.preventDefault();
    if (action === 'create') {
      const updatedWorkExp = [...workExperience];
      updatedWorkExp.push(workExp);
      const sortedUpdatedWorkExp = [...updatedWorkExp].sort((firstItem, secondItem) =>
        firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0
      );

      setWorkExperience(sortedUpdatedWorkExp);
      reset();
      setAddWorkExpIsOpen(false);
    } else if (action === 'update') {
      const updatedWorkExp = [...workExperience];

      updatedWorkExp.map((previousWorkExp: WorkExperience) => {
        if (previousWorkExp._id === workExp._id) {
          previousWorkExp.appointmentStatus = workExp.appointmentStatus;
          previousWorkExp.companyName = workExp.companyName;
          previousWorkExp.from = workExp.from;
          previousWorkExp.to = workExp.to;
          previousWorkExp.monthlySalary = workExp.monthlySalary;
          previousWorkExp.positionTitle = workExp.positionTitle;
          previousWorkExp.salaryGrade = workExp.salaryGrade;
          previousWorkExp.isGovernmentService = workExp.isGovernmentService;
        }
      });
      const sortedUpdatedWorkExp = [...updatedWorkExp].sort((firstItem, secondItem) =>
        firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0
      );
      setWorkExperience(sortedUpdatedWorkExp);
      reset();
      setAddWorkExpIsOpen(false);
      setAction('');
    }
  });

  // when edit button is clicked
  const onEdit = (work: WorkExperience) => {
    setAction('update');
    setWorkForEdit(work);
    setEditIsClicked(true);
    setAddWorkExpIsOpen(true);
  };

  // open add modal state
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddWorkExpIsOpen(true);
  };

  // close add modal state
  const closeModal = () => {
    setAction('');
    setIsPresentWorkMuted(false);
    setEditIsClicked(false);
    reset();
    clearErrors();
    setAddWorkExpIsOpen(false);
  };

  // open remove modal state
  const openRemoveActionModal = (workExpIdx: number) => {
    setRemoveWorkExpIsOpen(true);
    setWorkExpToRemove(workExpIdx);
  };

  // remove work action state
  const handleRemoveWork = (workIdx: number) => {
    const updatedWorkExp = [...workExperience];
    updatedWorkExp.splice(workIdx, 1);
    setWorkExperience(updatedWorkExp);
    setRemoveWorkExpIsOpen(false);
  };

  // set the date-to to default if Present work is ticked
  useEffect(() => {
    if (getIsPresentWork === true) {
      setValue('to', null);
      clearErrors('to');
    }
  }, [watchIsPresentWork]);

  // set the error state of SG to false if Government service is set to No or FALSE
  useEffect(() => {
    if (getIsGovtService === false) {
      setValue('salaryGrade', '');
      clearErrors('salaryGrade');
    }
    if (!editIsClicked) setValue('appointmentStatus', '');
  }, [watchIsGovtService, editIsClicked]);

  const loadNewDefaultValues = (work: WorkExperience) => {
    setValue('_id', work._id);
    setValue('positionTitle', work.positionTitle);
    setValue('companyName', work.companyName);
    setValue('from', work.from);
    setValue('to', work.to);
    setValue('monthlySalary', work.monthlySalary);
    setValue('isGovernmentService', work.isGovernmentService);
    if (isEmpty(work.to)) setValue('isPresentWork', true);
    if (!isEmpty(work.to)) {
      setValue('to', work.to);
      setIsPresentWorkMuted(true);
    }

    setValue('salaryGrade', work.salaryGrade);
    setValue('appointmentStatus', work.appointmentStatus);
  };

  useEffect(() => {
    if (editIsClicked) {
      loadNewDefaultValues(workForEdit);
    }
  }, [editIsClicked, workForEdit]);

  return (
    <>
      <Card
        title="Work Experience"
        subtitle=""
        remarks={
          <>
            <Button
              btnLabel="Add Work Experience"
              type="button"
              variant="theme"
              shadow
              onClick={openModal}
              className="xs:w-full sm:w-full lg:w-72"
            />
          </>
        }
      >
        <>
          <Modal
            title="Work Experience"
            subtitle={
              <>
                Include private employment. Start from your recent work. Description of duties should be indicated in
                the attached Work Experience sheet. Indicate FULL position titles and COMPLETE NAME of department /
                agency / office / company. <br></br> Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="workexp"
            isOpen={addWorkExpIsOpen}
            setIsOpen={setAddWorkExpIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxxxl"
            actionLabel={isExistingApplicant && editIsClicked ? 'Update' : 'Submit'}
            cancelLabel="Cancel"
          >
            <>
              <div className="gap-4 p-5 mb-5">
                <div className="w-full mb-5">
                  <InputReactForm
                    id="workexppostitle"
                    name="workexppostitle"
                    label="Position Title"
                    placeholder="Write in Full. Do not abbreviate."
                    type="text"
                    labelIsRequired
                    controller={{
                      ...register('positionTitle', { required: true }),
                    }}
                    withLabel={true}
                    isError={errors.positionTitle ? true : false}
                    errorMessage={errors.positionTitle?.message}
                    // muted={editIsClicked ? true : false}
                  />
                </div>

                <div className="w-full mt-5">
                  <InputReactForm
                    id="workexpcompname"
                    name="workexpcompname"
                    label="Company Name"
                    placeholder="Write in Full."
                    type="text"
                    labelIsRequired
                    controller={{ ...register('companyName') }}
                    withLabel={true}
                    isError={errors.companyName ? true : false}
                    errorMessage={errors.companyName?.message}
                    // muted={editIsClicked ? true : false}
                  />
                </div>

                <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                  <div className="w-full col-span-1 sm:block">
                    <InputReactForm
                      id="workexpfrom"
                      name="workexpfrom"
                      label="From"
                      placeholder=""
                      className="hover:cursor-pointer"
                      type="date"
                      labelIsRequired
                      controller={{ ...register('from', { required: true }) }}
                      withLabel={true}
                      isError={errors.from ? true : false}
                      errorMessage={errors.from?.message}
                      muted={editIsClicked ? true : false}
                    />
                  </div>

                  <div className="w-full col-span-1 sm:block">
                    <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                      <CheckboxRF
                        id="ispresentwork"
                        name="ispresentwork"
                        label="Present Work?"
                        controller={{ ...register('isPresentWork') }}
                        muted={isExistingApplicant && isPresentWorkMuted ? true : false}
                      />
                    </div>

                    <div>
                      <InputReactForm
                        id="workexpto"
                        name="workexpto"
                        label="To"
                        placeholder=""
                        className="hover:cursor-pointer"
                        labelIsRequired={!getIsPresentWork}
                        type="date"
                        controller={{ ...register('to') }}
                        withLabel={true}
                        muted={getIsPresentWork}
                        isError={errors.to ? true : false}
                        errorMessage={errors.to?.message}
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="w-full mt-10">
                  <InputReactForm
                    id="workexpsalary"
                    name="workexpsalary"
                    label="Monthly Salary"
                    placeholder="Monthly Salary in Php"
                    type="number"
                    labelIsRequired
                    controller={{ ...register('monthlySalary') }}
                    withLabel={true}
                    isError={errors.monthlySalary ? true : false}
                    errorMessage={errors.monthlySalary?.message}
                  />
                </div> */}

                <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                  <div className="w-full col-span-1 mb-10">
                    <SelectListRF
                      id="workexpgovtserv"
                      selectList={govtService}
                      defaultOption=""
                      withLabel
                      variant="simple"
                      labelIsRequired
                      label="Government Service?"
                      controller={{ ...register('isGovernmentService') }}
                      appearance="modal"
                      isError={errors.isGovernmentService ? true : false}
                      errorMessage={errors.isGovernmentService?.message}
                      muted={editIsClicked ? true : false}
                    />
                  </div>
                  {/* 
                  <div className="w-full col-span-1 mb-10">
                    <InputReactForm
                      id="workexpsalarygrade"
                      name="workexpsalarygrade"
                      label="Salary/Job/Pay Grade"
                      placeholder={
                        getIsGovtService.toString() === 'true' ? 'Format 00-0' : 'Leave blank if not applicable'
                      }
                      type="text"
                      className="mt-1 placeholder:text-sm"
                      // muted={!watch('isGovernmentService')}
                      labelIsRequired={getIsGovtService.toString() === 'true' ? true : false}
                      withHelpButton
                      helpContent="Salary grade and step increment is stated in the format “00-0” (e.g. 24-2 for salary grade 24, step increment 2). e.g. 09-4"
                      controller={{ ...register('salaryGrade') }}
                      withLabel={true}
                      isError={errors.salaryGrade ? true : false}
                      errorMessage={errors.salaryGrade?.message}
                    />
                  </div> */}
                  <div className="w-full col-span-1 mb-10">
                    <SelectListRF
                      id="workexpapptstat"
                      selectList={getIsGovtService.toString() === 'true' ? govtApptStatus : apptStatus}
                      defaultOption=""
                      withLabel
                      variant="simple"
                      labelIsRequired
                      label="Appointment Status"
                      controller={{ ...register('appointmentStatus') }}
                      appearance="modal"
                      isError={errors.appointmentStatus ? true : false}
                      errorMessage={errors.appointmentStatus?.message}
                      muted={editIsClicked ? true : false}
                    />
                  </div>
                </div>
              </div>
            </>
          </Modal>
          <ModalAction
            isOpen={removeWorkExpIsOpen}
            setIsOpen={setRemoveWorkExpIsOpen}
            action={() => handleRemoveWork(workExpToRemove)}
          />
          {workExperience.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Position Title" headerWidth="w-[15%]" className="pl-4" />
                    <TableHeader label="Company Name" headerWidth="w-[25%]" />
                    <TableHeader label="Inclusive Date" headerWidth="w-[10%]" />
                    <TableHeader label="Monthly Salary" headerWidth="w-[5%]" />
                    <TableHeader label="Salary Grade" headerWidth="w-[10%]" />
                    <TableHeader label="Appointment Status" headerWidth="w-[10%]" />
                    <TableHeader label="Gov't Service?" headerWidth="w-[10%]" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                  </>
                }
                tableBody={
                  <tbody>
                    {workExperience.map((work: WorkExperience, workIdx: number) => {
                      return (
                        <tr
                          key={workIdx}
                          className="odd:bg-gray-100/80 even:bg-gray-200/70 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                        >
                          <TableDimension isText={true} label={work.positionTitle} className="px-4" />
                          <TableDimension isText={true} label={work.companyName} className="px-1 select-none" />
                          <TableDimension
                            isText={true}
                            isPeriod={true}
                            periodLabel1={work.from}
                            periodLabel2={work.to}
                            className="break-words"
                          />
                          <TableDimension isText={true} className="px-1" label={work.monthlySalary} />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={work.salaryGrade ? work.salaryGrade : 'N/A'}
                          />
                          <TableDimension isText={true} className="px-1" label={work.appointmentStatus} />
                          <TableDimension
                            isText={true}
                            className="px-1"
                            label={work.isGovernmentService.toString() === 'true' ? 'YES' : 'NO'}
                          />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                {!isEmpty(work._id) &&
                                isEmpty(
                                  initialPdsState.workExperience.find((initWork) => work._id === initWork._id)?.to
                                ) ? (
                                  <>
                                    <EditButton action={() => onEdit(work)} />
                                  </>
                                ) : !isEmpty(work._id) && !isEmpty(work.to) ? (
                                  <></>
                                ) : !isExistingApplicant ? (
                                  <>
                                    <DeleteButton action={() => openRemoveActionModal(workIdx)} />
                                  </>
                                ) : isExistingApplicant && isEmpty(work._id) ? (
                                  <DeleteButton action={() => openRemoveActionModal(workIdx)} />
                                ) : (
                                  <></>
                                )}
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
