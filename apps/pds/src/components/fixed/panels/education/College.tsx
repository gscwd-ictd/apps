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
import schema from '../../../../schema/College';
import { EducationInfo } from '../../../../types/data/education.type';
import { CollegeAlert } from './CollegeAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';

export const College = (): JSX.Element => {
  // set college array, employee object state from pds store
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const college = usePdsStore((state) => state.college);
  const [action, setAction] = useState<string>('');
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const collegeOnEdit = usePdsStore((state) => state.collegeOnEdit);
  const [removedCourse, setRemovedCourse] = useState<EducationInfo>(
    {} as EducationInfo
  );
  const [courseForEdit, setCourseForEdit] = useState<EducationInfo>(
    {} as EducationInfo
  );
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const [courseToRemove, setCourseToRemove] = useState<number>(-1); // set course to remove (number)
  const allowEditCollege = useUpdatePdsStore((state) => state.allowEditCollege);
  const [addCourseIsOpen, setAddCourseIsOpen] = useState(false); // set add modal state
  const allowDeleteCollege = useUpdatePdsStore(
    (state) => state.allowDeleteCollege
  );
  const deletedCollegeEducs = useUpdatePdsStore(
    (state) => state.deletedCollegeEducs
  );
  const [courseIndexForEdit, setCourseIndexForEdit] = useState<number>(-1);
  const [removeCourseIsOpen, setRemoveCourseIsOpen] = useState(false); // set remove course modal
  const setCollege = usePdsStore((state) => state.setCollege);

  // initialize react hook form
  const {
    setValue,
    handleSubmit,
    getValues,
    register,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<EducationInfo>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      isGraduated: false,
      isOngoing: false,
      employeeId: employee.employmentDetails.userId,
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
    setCollege(initialPdsState.college);
  };

  // fire submit button
  const onSubmit = handleSubmit((course: EducationInfo, e: any) => {
    // create action
    if (action === 'create') {
      e.preventDefault();
      const updatedCollege = [...college];
      updatedCollege.push(course);
      const sortedUpdatedCollegeOnCreate = [...updatedCollege].sort(
        (firstItem, secondItem) =>
          firstItem.from! > secondItem.from!
            ? -1
            : secondItem.from! > firstItem.from!
            ? 1
            : 0
      );
      setCollege(sortedUpdatedCollegeOnCreate);
      reset();
      setAddCourseIsOpen(false);
    }
    // update action
    else if (action === 'update') {
      e.preventDefault();
      const updatedCourses: Array<EducationInfo> = [...college];
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
      setCollege(sortedUpdatedCourses);
      setCourseForEdit({} as EducationInfo);
      setCourseIndexForEdit(-1);
      reset();
      setAddCourseIsOpen(false);
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
    setValue('isEdited', true);
    setIsLoaded(true);
  };

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors;
    setAddCourseIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setCourseForEdit({} as EducationInfo);
    reset();
    clearErrors();
    setAddCourseIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (course: EducationInfo, index: number) => {
    setAction('update');
    setCourseForEdit(course);
    loadNewDefaultValues(course); //!
    setAddCourseIsOpen(true);
    setCourseIndexForEdit(index);
  };

  // open remove action modal
  const openRemoveActionModal = (courseIdx: number, course: EducationInfo) => {
    setRemoveCourseIsOpen(true);
    setCourseToRemove(courseIdx);
    setRemovedCourse(course);
  };

  // remove course action
  const handleRemoveCourse = (courseIdx: number) => {
    const updatedCollege = [...college];
    updatedCollege.splice(courseIdx, 1);
    if (!isEmpty(removedCourse._id)) deletedCollegeEducs.push(removedCourse);
    setCollege(updatedCollege);
    setRemoveCourseIsOpen(false);
  };

  // set the year ended to NULL if `Currently Attending checkbox` is ticked
  useEffect(() => {
    if (getIsOnGoing === true) {
      setValue('to', null);
      clearErrors('to');
    }
  }, [watchIsOnGoing]);

  // set the year graduated to NULL if `Graduated checkbox` is ticked
  useEffect(() => {
    if (getValues('isGraduated') === true) {
      setValue('yearGraduated', getValues('to'));
      clearErrors('yearGraduated');
    } else {
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
        title="College"
        subtitle={
          college.length === 0
            ? ''
            : "Courses are sorted by 'Year Started' in descending order."
        }
        remarks={
          <div className="flex flex-col items-end justify-end w-full">
            <CollegeAlert setInitialValues={setInitialValues} />
          </div>
        }
      >
        <div
          className={`flex flex-col items-end justify-end ${
            collegeOnEdit
              ? 'visible'
              : !hasPds
              ? 'visible lg:-mt-6 lg:pb-6'
              : 'hidden'
          }`}
        >
          <Button
            btnLabel="Add College Course"
            type="button"
            variant="theme"
            onClick={openModal}
            className="sm:w-full md:w-full lg:w-56"
          />
        </div>

        <>
          <Modal
            title="College Education"
            subtitle={
              <>
                Indicate in FULL all courses taken in college.
                <br />
                Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="college"
            isOpen={addCourseIsOpen}
            setIsOpen={setAddCourseIsOpen}
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
                      id="colschoolname"
                      name="colschoolname"
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
                      id="coldegree"
                      name="coldegree"
                      label="Basic Education or Degree or Course"
                      placeholder="Write in Full."
                      type="text"
                      labelIsRequired
                      controller={{ ...register('degree') }}
                      withLabel={true}
                      isError={
                        errors.degree && errors.degree?.message ? true : false
                      }
                      errorMessage={errors.degree?.message}
                    />
                  </div>

                  <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                    <div className="w-full col-span-1 sm:block">
                      <InputReactForm
                        id="colyearstarted"
                        name="colyearstarted"
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
                          id="colisongoing"
                          name="colisongoing"
                          label="Currently Attending?"
                          controller={{ ...register('isOngoing') }}
                          muted={getIsGraduated}
                        />
                      </div>

                      <InputReactForm
                        id="colyearended"
                        name="colyearended"
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
                    <div className="w-full col-span-1 sm:block ">
                      <InputReactForm
                        id="colunits"
                        name="colunits"
                        label="Highest Level or Units Earned"
                        placeholder="Leave blank if not applicable"
                        type="text"
                        controller={{ ...register('units') }}
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
                          id="colisgraduated"
                          name="colisgraduated"
                          label="Graduated?"
                          controller={{ ...register('isGraduated') }}
                          muted={getIsOnGoing}
                        />
                      </div>
                      <div>
                        <InputReactForm
                          id="colyeargrad"
                          name="colyeargrad"
                          label="Year Graduated"
                          withHelpButton
                          labelIsRequired={getIsGraduated ? true : false}
                          helpContent="Year graduated should be same with year ended"
                          placeholder={
                            getIsOnGoing === true
                              ? 'Not Applicable'
                              : getIsGraduated === true
                              ? 'No input value from "Year Ended"'
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
                      id="colawards"
                      name="colawards"
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
                {' '}
                <Button
                  variant="light"
                  onClick={() => setRemoveCourseIsOpen(false)}
                  className="hover:bg-gray-200 active:bg-gray-200"
                >
                  No
                </Button>
                <Button
                  variant="theme"
                  onClick={() => handleRemoveCourse(courseToRemove)}
                >
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>
          {college.length === 0 ? (
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
                    {college.map((course: EducationInfo, courseIdx: number) => {
                      return (
                        <tr
                          key={courseIdx}
                          className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
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
                                  <div className="flex justify-center gap-4 ">
                                    {allowEditCollege ? (
                                      <div className="w-8">
                                        <EditButton
                                          action={() =>
                                            onEdit(course, courseIdx)
                                          }
                                          type="button"
                                          disabled={
                                            collegeOnEdit ? false : true
                                          }
                                        />
                                      </div>
                                    ) : null}
                                    {allowDeleteCollege ? (
                                      <div className="w-8">
                                        <DeleteButton
                                          muted={
                                            hasPds && collegeOnEdit
                                              ? false
                                              : hasPds && !collegeOnEdit
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
                                    {!allowEditCollege &&
                                    !allowDeleteCollege ? (
                                      <div className="flex justify-center w-full">
                                        -
                                      </div>
                                    ) : null}
                                  </div>
                                ) : isEmpty(course._id) ? (
                                  <div className="flex justify-center gap-4">
                                    <div className="w-8">
                                      <EditButton
                                        action={() => onEdit(course, courseIdx)}
                                        type="button"
                                        disabled={collegeOnEdit ? false : true}
                                      />
                                    </div>

                                    <div className="w-8">
                                      <DeleteButton
                                        muted={
                                          hasPds && collegeOnEdit
                                            ? false
                                            : hasPds && !collegeOnEdit
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
