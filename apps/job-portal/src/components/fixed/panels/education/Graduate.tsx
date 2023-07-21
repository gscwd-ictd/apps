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
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/Graduate';

import { useApplicantStore } from '../../../../store/applicant.store';
import { EducationInfo } from 'apps/job-portal/utils/types/data/education.type';

export const Graduate = (): JSX.Element => {
  // set graduate array, employee object state from pds store
  const graduate = usePdsStore((state) => state.graduate);
  const setGraduate = usePdsStore((state) => state.setGraduate);
  const applicant = useApplicantStore((state) => state.applicant);
  const [addCourseIsOpen, setAddCourseIsOpen] = useState(false); // set add modal state
  const [removeCourseIsOpen, setRemoveCourseIsOpen] = useState(false); // set remove course modal state
  const [courseToRemove, setCourseToRemove] = useState<number>(-1); // set course to remove state (number)
  const [removedCourse, setRemovedCourse] = useState<EducationInfo>(
    {} as EducationInfo
  );
  const deletedGraduates = usePdsStore((state) => state.deletedGraduates);
  const setDeletedGraduates = usePdsStore((state) => state.setDeletedGraduates);

  // initialize react hook form and set default values, mode is on change
  const {
    setValue,
    handleSubmit,
    getValues,
    watch,
    clearErrors,
    reset,
    register,
    formState: { errors },
  } = useForm<EducationInfo>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      schoolName: '',
      degree: '',
      from: null,
      to: null,
      units: '',
      awards: '',
      yearGraduated: null,
    },
  });

  const watchIsOnGoing = watch('isOngoing'); // assign the watch isongoing to watchIsOnGoing
  const getIsOnGoing = getValues('isOngoing'); // assign the getvalues isongoing to getIsOnGoing
  const watchIsGraduated = watch('isGraduated'); // assign the watch isgraduated to watchIsGraduated
  const getIsGraduated = getValues('isGraduated'); // assign the getvalues isongraduated to getIsGraduated

  // fire submit button
  const onSubmit = handleSubmit((course: EducationInfo, e: any) => {
    e.preventDefault();

    const updatedGraduate = [...graduate];
    updatedGraduate.push(course);
    const sortedUpdatedGraduate = [...updatedGraduate].sort(
      (firstItem, secondItem) =>
        firstItem.from! > secondItem.from!
          ? -1
          : secondItem.from! > firstItem.from!
          ? 1
          : 0
    );
    setGraduate(sortedUpdatedGraduate);
    reset();
    setAddCourseIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddCourseIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddCourseIsOpen(false);
  };

  // open remove modal
  const openRemoveActionModal = (course: EducationInfo, courseIdx: number) => {
    setRemoveCourseIsOpen(true);
    setCourseToRemove(courseIdx);
    setRemovedCourse(course);
  };
  // remove course action
  const handleRemoveCourse = (courseIdx: number) => {
    const updatedGraduate = [...graduate];
    const deleted = [...deletedGraduates];
    deleted.push(removedCourse);
    setDeletedGraduates(deleted);
    updatedGraduate.splice(courseIdx, 1);
    setGraduate(updatedGraduate);
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

  return (
    <>
      <Card
        title="Graduate Studies"
        remarks={
          <Button
            btnLabel="Add Graduate Studies"
            type="button"
            variant="theme"
            onClick={openModal}
            shadow
            className="sm:w-full lg:w-56"
          />
        }
        subtitle={
          graduate.length === 0
            ? ''
            : 'Courses are sorted by `Year Started` in descending order.'
        }
      >
        <>
          <Modal
            title="Graduate Studies"
            subtitle={
              <>
                Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="graduate"
            isOpen={addCourseIsOpen}
            setIsOpen={setAddCourseIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxxxxl"
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
            <>
              <div className="gap-4 p-5 mb-5">
                <div className="w-full mb-5">
                  <InputReactForm
                    id="gradshoolname"
                    name="gradshoolname"
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
                    id="graddegree"
                    name="graddegree"
                    label="Basic Education or Degree or Course"
                    placeholder="Write in Full."
                    type="text"
                    labelIsRequired
                    controller={{ ...register('degree') }}
                    withLabel={true}
                    isError={errors.degree ? true : false}
                  />
                </div>

                <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                  <div className="w-full col-span-1 sm:block">
                    <InputReactForm
                      id="gradyearstarted"
                      name="gradyearstarted"
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
                        id="gradisongoing"
                        name="gradisongoing"
                        label="Currently Attending?"
                        controller={{ ...register('isOngoing') }}
                        muted={getIsGraduated}
                      />
                    </div>

                    <InputReactForm
                      id="gradyearended"
                      name="gradyearended"
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
                      id="gradunits"
                      name="gradunits"
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
                        helpContent="Year graduated should be same with year ended"
                        placeholder={
                          getIsOnGoing === true
                            ? 'Not Applicable'
                            : getIsGraduated === true
                            ? 'No input from "Year Ended"'
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
          </Modal>
          <ModalAction
            isOpen={removeCourseIsOpen}
            setIsOpen={setRemoveCourseIsOpen}
            action={() => handleRemoveCourse(courseToRemove)}
          />
          {graduate.length === 0 ? (
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
                    {graduate.map(
                      (course: EducationInfo, courseIdx: number) => {
                        return (
                          <tr
                            key={courseIdx}
                            className="odd:bg-gray-100/80 even:bg-gray-200/70 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
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
                                  <DeleteButton
                                    action={() =>
                                      openRemoveActionModal(course, courseIdx)
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
                }
              />
            </>
          )}
        </>
      </Card>
    </>
  );
};
