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
import { DeleteButton } from '../../buttons/Delete';
import { isEmpty } from 'lodash';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { WorkExperience } from '../../../../types/data/work.type';
import schema from '../../../../schema/WorkExp';
import { apptStatus, govtApptStatus, govtService } from '../../../../../utils/constants/constants';
import { WorkExperienceAlert } from './WorkExperienceAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';

export const WorkExp = (): JSX.Element => {
  // set work experience array, employee object state from pds context
  const workExperience = usePdsStore((state) => state.workExperience);
  const workExperienceOnEdit = usePdsStore((state) => state.workExperienceOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addWorkExpIsOpen, setAddWorkExpIsOpen] = useState<boolean>(false); // open add modal state
  const [removeWorkExpIsOpen, setRemoveWorkExpIsOpen] = useState<boolean>(false); // remove work modal state
  const [workExpToRemove, setWorkExpToRemove] = useState<number>(-1); // work experience to remove state (number)
  const deletedWorkExperiences = useUpdatePdsStore((state) => state.deletedWorkExperiences);
  const [removedWorkExp, setRemovedWorkExp] = useState<WorkExperience>({} as WorkExperience);
  const [workForEdit, setWorkForEdit] = useState<WorkExperience>({} as WorkExperience);
  const [isPresentWorkMuted, setIsPresentWorkMuted] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workIndexForEdit, setWorkIndexForEdit] = useState<number>(-1);
  const allowAddWorkExperience = useUpdatePdsStore((state) => state.allowAddWorkExperience);
  const allowEditWorkExperience = useUpdatePdsStore((state) => state.allowEditWorkExperience);
  const allowDeleteWorkExperience = useUpdatePdsStore((state) => state.allowDeleteWorkExperience);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const setAllowEditWorkExperience = useUpdatePdsStore((state) => state.setAllowEditWorkExperience);
  const setWorkExperience = usePdsStore((state) => state.setWorkExperience);
  const setWorkExperienceOnEdit = usePdsStore((state) => state.setWorkExperienceOnEdit);

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
      _id: '',
      isPresentWork: false,
      employeeId: employee.employmentDetails.userId,
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

  // set initial values
  const setInitialValues = () => {
    setWorkExperience(initialPdsState.workExperience);
  };

  // fire submit button
  const onSubmit: SubmitHandler<any> = handleSubmit((workExp: WorkExperience, e: any) => {
    if (action === 'create') {
      e.preventDefault();
      const updatedWorkExp = [...workExperience];
      updatedWorkExp.push(workExp);
      const sortedUpdatedWorkExp = [...updatedWorkExp].sort((firstItem, secondItem) =>
        firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0
      );

      setWorkExperience(sortedUpdatedWorkExp);
      reset();
      setAddWorkExpIsOpen(false);
      setAction('');
    } else if (action === 'update') {
      e.preventDefault();
      const updatedWorkExp = [...workExperience];

      const newUpdatedWorkExp = updatedWorkExp.map((previousWorkExp: WorkExperience, prevWorkIdx: number) => {
        if (prevWorkIdx === workIndexForEdit) {
          return {
            ...previousWorkExp,
            _id: workExp._id,
            appointmentStatus: workExp.appointmentStatus,
            companyName: workExp.companyName,
            from: workExp.from,
            to: workExp.to,
            monthlySalary: workExp.monthlySalary,
            positionTitle: workExp.positionTitle,
            salaryGrade: workExp.salaryGrade,
            employeeId: workExp.employeeId,
            isGovernmentService: workExp.isGovernmentService,
            isPresentWork: workExp.isGovernmentService,
            isEdited: true,
          };
        }

        return previousWorkExp;
      });
      const sortedUpdatedWorkExp = [...newUpdatedWorkExp].sort((firstItem, secondItem) =>
        firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0
      );
      setWorkExperience(sortedUpdatedWorkExp);
      setWorkForEdit({} as WorkExperience);
      setWorkIndexForEdit(-1);
      reset();
      setWorkForEdit({} as WorkExperience);
      setAddWorkExpIsOpen(false);
      setAction('');
    }
  });

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
    reset();
    clearErrors();
    setAddWorkExpIsOpen(false);
  };

  // open remove modal state
  const openRemoveActionModal = (workExpIdx: number, work: WorkExperience) => {
    setRemoveWorkExpIsOpen(true);
    setWorkExpToRemove(workExpIdx);
    setRemovedWorkExp(work);
  };

  // when edit button is clicked
  const onEdit = (work: WorkExperience, index: number) => {
    setAction('update');
    setWorkForEdit(work);
    loadNewDefaultValues(work);
    setAddWorkExpIsOpen(true);
    setWorkIndexForEdit(index);
  };

  // remove work action state
  const handleRemoveWork = (workIdx: number) => {
    const updatedWorkExp = [...workExperience];
    updatedWorkExp.splice(workIdx, 1);
    if (!isEmpty(removedWorkExp._id)) deletedWorkExperiences.push(removedWorkExp);
    setWorkExperience(updatedWorkExp);
    setRemoveWorkExpIsOpen(false);
  };

  // load default values for update
  const loadNewDefaultValues = (work: WorkExperience) => {
    setValue('_id', work._id);
    setValue('positionTitle', work.positionTitle);
    setValue('companyName', work.companyName);
    setValue('from', work.from);
    setValue('to', work.to);
    setValue('monthlySalary', work.monthlySalary);
    setValue('isGovernmentService', work.isGovernmentService ? true : false);
    if (isEmpty(work.to)) setValue('isPresentWork', true);
    if (!isEmpty(work.to)) {
      setValue('to', work.to);
      setIsPresentWorkMuted(true);
    }

    setValue('salaryGrade', work.salaryGrade);
    setIsLoaded(true);
    // setValue('appointmentStatus', work.appointmentStatus);
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

    setValue('appointmentStatus', '');
  }, [watchIsGovtService]);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setValue('appointmentStatus', workForEdit.appointmentStatus);
      }, 100);
      setIsLoaded(false);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!allowDeleteWorkExperience && !allowDeleteWorkExperience) setAllowEditWorkExperience(false);
    else setAllowEditWorkExperience(true);
  }, []);

  return (
    <>
      <Card
        title="Work Experience"
        subtitle=""
        remarks={
          <div className="">
            {allowEditWorkExperience ? <WorkExperienceAlert setInitialValues={setInitialValues} /> : null}
          </div>
        }
      >
        <div
          className={`flex flex-col items-end justify-end ${
            workExperienceOnEdit ? 'visible' : !hasPds ? 'visible' : 'hidden'
          }`}
        >
          {allowAddWorkExperience ? (
            <Button
              btnLabel="Add Work Experience"
              type="button"
              variant="theme"
              shadow
              onClick={openModal}
              className="xs:w-full sm:w-full lg:w-72"
            />
          ) : null}
        </div>
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
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            modalChildren={
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
                      />
                    </div>

                    <div className="w-full col-span-1 sm:block">
                      <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                        <CheckboxRF
                          id="ispresentwork"
                          name="ispresentwork"
                          label="Present Work?"
                          controller={{ ...register('isPresentWork') }}
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
                  {/* 
                  <div className="w-full mt-10">
                    <InputReactForm
                      id="workexpsalary"
                      name="workexpsalary"
                      label="Monthly Salary"
                      placeholder="Monthly Salary in Php"
                      type="number"
                      labelIsRequired={false}
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
                      />
                    </div>

                    {/* <div className="w-full col-span-1 mb-10">
                      <InputReactForm
                        id="workexpsalarygrade"
                        name="workexpsalarygrade"
                        label="Salary/Job/Pay Grade"
                        placeholder={
                          getIsGovtService.toString() === 'true' ? 'Format 00-0' : 'Leave blank if not applicable'
                        }
                        type="text"
                        className="placeholder:text-sm"
                        // muted={!watch('isGovernmentService')}
                        // labelIsRequired={getIsGovtService.toString() === 'true' ? true : false}
                        labelIsRequired={false}
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
                      />
                    </div>
                  </div>
                </div>
              </>
            }
          />

          <Alert open={removeWorkExpIsOpen} setOpen={setRemoveWorkExpIsOpen}>
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
                <p className="w-[75%] px-4">Are you sure you want to remove this? This action cannot be undone. </p>
              </div>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                <Button
                  variant="light"
                  onClick={() => setRemoveWorkExpIsOpen(false)}
                  className="hover:bg-gray-200 active:bg-gray-200"
                >
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveWork(workExpToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

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
                            label={work.from}
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
                            label={
                              work.isGovernmentService.toString() === 'true' ||
                              Boolean(work.isGovernmentService) === true
                                ? 'YES'
                                : 'NO'
                            }
                          />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                <div className="flex justify-center gap-4">
                                  {
                                    // include this in logic if you want to target "is working currently"
                                    /*       isEmpty(initialPdsState.workExperience.find((initWork) => work._id === initWork._id)?.to)*/
                                  }
                                  {!isEmpty(work._id) ? (
                                    <>
                                      {allowEditWorkExperience ? (
                                        <div className="w-8">
                                          <EditButton
                                            action={() => onEdit(work, workIdx)}
                                            disabled={workExperienceOnEdit ? false : true}
                                          />{' '}
                                        </div>
                                      ) : null}

                                      {allowDeleteWorkExperience ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            action={() => openRemoveActionModal(workIdx, work)}
                                            muted={workExperienceOnEdit ? false : true}
                                          />
                                        </div>
                                      ) : null}

                                      {!allowEditWorkExperience && !allowDeleteWorkExperience ? (
                                        <div className="flex justify-center w-full">-</div>
                                      ) : null}
                                    </>
                                  ) : isEmpty(work._id) ? (
                                    <>
                                      <div className="w-8">
                                        <EditButton action={() => onEdit(work, workIdx)} />
                                      </div>
                                      <div className="w-8">
                                        <DeleteButton action={() => openRemoveActionModal(workIdx, work)} />
                                      </div>
                                    </>
                                  ) : null}
                                </div>
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
