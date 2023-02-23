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
import schema from '../../../../schema/Vocational';
import { EducationInfo } from '../../../../types/data/education.type';
import { VocationalAlert } from './VocationalAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { AlertDesc } from '../../alerts/AlertDesc';
import { EditButton } from '../../buttons/Edit';

export const Vocational = (): JSX.Element => {
  // set vocational array, employee object from pds store

  const hasPds = useEmployeeStore((state) => state.hasPds);
  const [action, setAction] = useState<string>('');
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const vocational = usePdsStore((state) => state.vocational);
  const allowDeleteVocational = useUpdatePdsStore(
    (state) => state.allowDeleteVocational
  );
  const [courseForEdit, setCourseForEdit] = useState<EducationInfo>(
    {} as EducationInfo
  );
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const [courseToRemove, setCourseToRemove] = useState<number>(-1); // set course to remove state (number)
  const vocationalOnEdit = usePdsStore((state) => state.vocationalOnEdit);
  const [addCourseIsOpen, setAddVocationalIsOpen] = useState(false); // set add modal state
  const [removedVocational, setRemovedVocational] = useState<EducationInfo>(
    {} as EducationInfo
  );
  const [removeCourseIsOpen, setRemoveCourseIsOpen] = useState(false); // set remove course modal state
  const deletedVocationalEducs = useUpdatePdsStore(
    (state) => state.deletedVocationalEducs
  );
  const [courseIndexForEdit, setCourseIndexForEdit] = useState<number>(-1);
  const allowEditVocational = useUpdatePdsStore(
    (state) => state.allowEditVocational
  );
  const setVocational = usePdsStore((state) => state.setVocational);

  // initialize react hook forms and set default values, mode is onchange
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = useForm<EducationInfo>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      employeeId: employee.employmentDetails.userId,
      isOngoing: false,
      isGraduated: false,
      schoolName: '',
      degree: '',
      from: null,
      to: null,
      units: '',
      awards: '',
      yearGraduated: null,
      isEdited: false,
    },
  });

  const watchIsOnGoing = watch('isOngoing'); // assign the watch isongoing to watchIsOnGoing
  const getIsOnGoing = getValues('isOngoing'); // assign the getvalues isongoing to getIsOnGoing
  const watchIsGraduated = watch('isGraduated'); // assign the watch isgraduated to watchIsGraduated
  const getIsGraduated = getValues('isGraduated'); // assign the getvalues isongraduated to getIsGraduated

  const setInitialValues = () => {
    setVocational(initialPdsState.vocational);
  };

  // fire submit button
  const onSubmit = handleSubmit((course: EducationInfo, e: any) => {
    if (action === 'create') {
      e.preventDefault();
      const updatedVocationalOnCreate = [...vocational];
      updatedVocationalOnCreate.push(course);
      const sortedUpdatedVocationalOnCreate = [
        ...updatedVocationalOnCreate,
      ].sort((firstItem, secondItem) =>
        firstItem.from! > secondItem.from!
          ? -1
          : secondItem.from! > firstItem.from!
          ? 1
          : 0
      );
      setVocational(sortedUpdatedVocationalOnCreate);
      setCourseForEdit({} as EducationInfo);
      reset();
      setAddVocationalIsOpen(false);
      setAction('');
    } else if (action === 'update') {
      e.preventDefault();
      const updatedCourses: Array<EducationInfo> = [...vocational];
      const newUpdatedCourses = updatedCourses.map(
        (previousCourse: EducationInfo, orgIdx: number) => {
          if (orgIdx === courseIndexForEdit) {
            return {
              ...previousCourse,
              _id: course._id,
              awards: course.awards,
              degree: course.degree,
              employeeId: course.employeeId,
              from: course.from,
              to: course.to,
              schoolName: course.schoolName,
              units: course.units,
              yearGraduated: course.yearGraduated,
              isGraduated: course.isGraduated,
              isOngoing: course.isOngoing,
              isEdited: true,
            };
          }

          return previousCourse;
        }
      );

      const sortedUpdatedCourses = [...newUpdatedCourses].sort(
        (firstItem, secondItem) =>
          firstItem.from! > secondItem.from!
            ? -1
            : secondItem.from! > firstItem.from!
            ? 1
            : 0
      );
      setVocational(sortedUpdatedCourses);
      setCourseForEdit({} as EducationInfo);
      setCourseIndexForEdit(-1);
      reset();
      setAddVocationalIsOpen(false);
      setAction('');
    }
  });

  // load data on edit
  const loadNewDefaultValues = (course: EducationInfo) => {
    setValue('_id', course._id);
    setValue('awards', course.awards);
    setValue('degree', course.degree);
    setValue('employeeId', course.employeeId);
    setValue('from', course.from);
    setValue('to', course.to);
    setValue('units', course.units);
    setValue('yearGraduated', course.yearGraduated);
    setValue('schoolName', course.schoolName);
    setValue('isEdited', course.isEdited);
    setIsLoaded(true);
  };

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors;
    setAddVocationalIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setCourseForEdit({} as EducationInfo);
    reset();
    clearErrors();
    setAddVocationalIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (course: EducationInfo, index: number) => {
    setAction('update');
    setCourseForEdit(course);
    loadNewDefaultValues(course); //!
    setAddVocationalIsOpen(true);
    setCourseIndexForEdit(index);
  };

  // opens the remove action modal
  const openRemoveActionModal = (courseIdx: number, course: EducationInfo) => {
    setRemoveCourseIsOpen(true);
    setCourseToRemove(courseIdx);
    setRemovedVocational(course);
  };

  // remove course action
  const handleRemoveCourse = (courseIdx: number) => {
    const updatedVocational = [...vocational];
    updatedVocational.splice(courseIdx, 1);
    if (!isEmpty(removedVocational._id))
      deletedVocationalEducs.push(removedVocational);
    setVocational(updatedVocational);
    setRemoveCourseIsOpen(false);
  };

  // set the year ended to NULL if Currently Attending checkbox is ticked
  useEffect(() => {
    if (getValues('isOngoing') === true) {
      setValue('to', null);
      clearErrors('to');
    }
  }, [watchIsOnGoing]);

  // set the year graduated to NULL if Graduated checkbox is ticked
  useEffect(() => {
    if (getValues('isGraduated') === true) {
      setValue('yearGraduated', getValues('to'));
      clearErrors('yearGraduated');
    } else if (getValues('isGraduated') === false) {
      setValue('yearGraduated', null);
      clearErrors('yearGraduated');
    }
  }, [watchIsGraduated, watch('to')]);

  // added this use effect to delay the setting of check boxes
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        // sets the currently attending checkbox
        if (courseForEdit.yearGraduated === null && courseForEdit.to === null) {
          setValue('isOngoing', true);
        }

        // sets the graduated checkbox
        else if (
          courseForEdit.to !== null &&
          courseForEdit.yearGraduated !== null
        ) {
          setValue('isGraduated', true);
        }
        setIsLoaded(false);
      }, 100);
    }
  }, [isLoaded]);

  return (
    <>
      <Card
        title="Vocational"
        subtitle={
          vocational.length === 0
            ? ''
            : "Courses are sorted by 'Year Started' in descending order."
        }
        remarks={
          <div className="flex flex-col items-end justify-end w-full">
            <VocationalAlert setInitialValues={setInitialValues} />
          </div>
        }
      >
        <div
          className={`flex flex-col items-end justify-end ${
            hasPds && vocationalOnEdit
              ? 'visible'
              : !hasPds
              ? 'visible lg:-mt-6 lg:pb-6'
              : 'hidden'
          }`}
        >
          <Button
            btnLabel="Add Vocational Course"
            type="button"
            variant="theme"
            onClick={openModal}
            className="sm:w-full lg:w-56"
          />
        </div>
        <>
          <Modal
            title="Vocational Education"
            subtitle={
              <>
                Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="vocational"
            isOpen={addCourseIsOpen}
            setIsOpen={setAddVocationalIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
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
                      id="vocshoolname"
                      name="vocschoolname"
                      label="School"
                      placeholder="Write in Full. Do not abbreviate."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('schoolName') }}
                      withLabel={true}
                      isError={
                        errors.schoolName && errors.schoolName.message
                          ? true
                          : false
                      }
                      errorMessage={errors.schoolName?.message}
                    />
                  </div>

                  <div className="w-full mt-5">
                    <InputReactForm
                      id="vocdegree"
                      name="vocdegree"
                      label="Basic Education or Degree or Course"
                      placeholder="Write in Full."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('degree') }}
                      withLabel={true}
                      isError={
                        errors.degree && errors.degree.message ? true : false
                      }
                      errorMessage={errors.degree?.message}
                    />
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1 sm:block">
                      <InputReactForm
                        id="vocyearstarted"
                        name="vocyearstarted"
                        label="From"
                        placeholder="Year Started"
                        type="number"
                        labelIsRequired
                        controller={{
                          ...register('from'),
                        }}
                        withLabel={true}
                        withHelpButton
                        helpContent="Indicate beginning school year"
                        isError={
                          errors.from && errors.from.message ? true : false
                        }
                        errorMessage={errors.from?.message}
                      />
                    </div>

                    <div className="w-full col-span-1 sm:block">
                      <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                        <CheckboxRF
                          id="colisgoing"
                          name="colisongoing"
                          label="Currently Attending?"
                          controller={{ ...register('isOngoing') }}
                          muted={watchIsGraduated}
                        />
                      </div>

                      <InputReactForm
                        id="vocyearended"
                        name="vocyearended"
                        label="To"
                        placeholder={
                          getIsOnGoing === true ? 'Present' : 'Year Ended'
                        }
                        labelIsRequired={getIsOnGoing === true ? false : true}
                        type="number"
                        controller={{ ...register('to') }}
                        withLabel={true}
                        muted={getIsOnGoing}
                        withHelpButton
                        helpContent="Indicate ending school year or the last year you attended"
                        isError={errors.to && errors.to.message ? true : false}
                        errorMessage={errors.to?.message}
                      />
                    </div>
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1 sm:block">
                      <InputReactForm
                        id="vocunits"
                        name="vocunits"
                        label="Highest Level or Units Earned"
                        placeholder="Leave blank if not applicable"
                        type="text"
                        controller={{
                          ...register('units', { required: false }),
                        }}
                        withHelpButton
                        helpContent="Indicated the highest level or units earned only if not graduated"
                        withLabel={true}
                        isError={
                          errors.units && errors.units.message ? true : false
                        }
                        errorMessage={errors.units?.message}
                      />
                    </div>
                    <div className="w-full col-span-1 sm:block">
                      <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                        <CheckboxRF
                          id="vocisgraduated"
                          name="vocisGraduated"
                          label="Graduated?"
                          controller={{ ...register('isGraduated') }}
                          muted={getIsOnGoing}
                        />
                        {/* <Toggle label="Graduated?" /> */}
                      </div>
                      <div>
                        <InputReactForm
                          id="vocyeargrad"
                          name="vocyeargrad"
                          label="Year Graduated"
                          withHelpButton
                          labelIsRequired={getIsGraduated ? true : false}
                          helpContent="Year graduated should be same with year ended"
                          placeholder={
                            getIsOnGoing === true
                              ? 'Not Applicable'
                              : getIsGraduated === true
                              ? "No input value from 'Year Ended'"
                              : 'Not Applicable'
                          }
                          type="number"
                          controller={{ ...register('yearGraduated') }}
                          withLabel={true}
                          muted={true}
                          isError={
                            errors.yearGraduated && errors.yearGraduated.message
                              ? true
                              : false
                          }
                          errorMessage={errors.yearGraduated?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full my-10">
                    <InputReactForm
                      id="vocawards"
                      name="vocawards"
                      label="Scholarship or Academic Honors Received"
                      placeholder="Leave blank if not applicable"
                      type="text"
                      controller={{ ...register('awards') }}
                      withLabel={true}
                      isError={
                        errors.awards && errors.awards.message ? true : false
                      }
                      errorMessage={errors.awards?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeCourseIsOpen} setOpen={setRemoveCourseIsOpen}>
            <Alert.Description>
              <AlertDesc>Are you sure you want to delete this?</AlertDesc>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                <div className="w-full border border-gray-300 rounded">
                  <Button
                    variant="light"
                    onClick={() => setRemoveCourseIsOpen(false)}
                    className="hover:bg-gray-300"
                  >
                    No
                  </Button>
                </div>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveCourse(courseToRemove)}
                >
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {vocational.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Name of School"
                      headerWidth="w-[20%]"
                      className="pl-4"
                    />
                    <TableHeader label="Course" headerWidth="w-[25%]" />
                    <TableHeader label="Period" headerWidth="w-[10%]" />
                    <TableHeader label="Year Graduated" headerWidth="w-[10%]" />
                    <TableHeader
                      label="Level/Units Earned"
                      headerWidth="w-[10%]"
                    />
                    <TableHeader
                      label="Honors Received"
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
                    {vocational.map(
                      (course: EducationInfo, courseIdx: number) => {
                        return (
                          <tr
                            key={courseIdx}
                            className={`odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default  hover:bg-indigo-200 hover:transition-all`}
                          >
                            <TableDimension
                              isText={true}
                              label={course.schoolName}
                              className="px-4"
                            />
                            <TableDimension
                              isText={true}
                              label={course.degree}
                              className="px-1 select-none"
                            />
                            <TableDimension
                              isText={true}
                              isPeriod={true}
                              periodLabel1={course.from}
                              periodLabel2={course.to ? course.to : 'Present'}
                              label=""
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={
                                course.yearGraduated
                                  ? course.yearGraduated
                                  : 'N/A'
                              }
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={course.units ? course.units : 'N/A'}
                            />
                            <TableDimension
                              isText={true}
                              className="px-1"
                              label={course.awards ? course.awards : 'N/A'}
                            />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  {!isEmpty(course._id) ? (
                                    <div className="flex justify-center gap-4">
                                      {allowEditVocational ? (
                                        <div className="w-8">
                                          <EditButton
                                            action={() =>
                                              onEdit(course, courseIdx)
                                            }
                                            type="button"
                                            disabled={
                                              vocationalOnEdit ? false : true
                                            }
                                          />
                                        </div>
                                      ) : null}
                                      {allowDeleteVocational ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            muted={
                                              hasPds && vocationalOnEdit
                                                ? false
                                                : hasPds && !vocationalOnEdit
                                                ? true
                                                : !hasPds && false
                                            }
                                            action={() =>
                                              openRemoveActionModal(
                                                courseIdx,
                                                course
                                              )
                                            }
                                          />
                                        </div>
                                      ) : null}

                                      {allowEditVocational === false &&
                                      allowDeleteVocational === false ? (
                                        <div className="flex justify-center w-full">
                                          -
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : isEmpty(course._id) ? (
                                    <div className="flex justify-center gap-4">
                                      <div className="w-8">
                                        <EditButton
                                          action={() =>
                                            onEdit(course, courseIdx)
                                          }
                                          type="button"
                                          disabled={
                                            vocationalOnEdit ? false : true
                                          }
                                        />
                                      </div>

                                      <div className="w-8">
                                        <DeleteButton
                                          muted={
                                            hasPds && vocationalOnEdit
                                              ? false
                                              : hasPds && !vocationalOnEdit
                                              ? true
                                              : !hasPds && false
                                          }
                                          action={() =>
                                            openRemoveActionModal(
                                              courseIdx,
                                              course
                                            )
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
