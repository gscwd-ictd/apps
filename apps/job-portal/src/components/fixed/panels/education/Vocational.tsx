import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../modular/buttons/Button'
import { Card } from '../../../modular/cards/Card'
import { InputReactForm } from '../../../modular/inputs/InputReactForm'
import { Modal } from '../../../modular/modals/Modal'
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table'
import { NoDataVisual } from '../../visuals/NoDataVisual'
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF'
import { yupResolver } from '@hookform/resolvers/yup'
import { ModalAction } from '../../modals/Action'
import { DeleteButton } from '../../buttons/Delete'
import { usePdsStore } from '../../../../store/pds.store'
import { useEmployeeStore } from '../../../../store/employee.store'
import schema from '../../../../schema/Vocational'
import { EducationInfo } from '../../../../types/data/education.type'
import { useApplicantStore } from '../../../../store/applicant.store'

export const Vocational = (): JSX.Element => {
  // set vocational array, employee object from pds store

  const vocational = usePdsStore((state) => state.vocational)
  const setVocational = usePdsStore((state) => state.setVocational)
  const applicant = useApplicantStore((state) => state.applicant)
  const [addCourseIsOpen, setAddVocationalIsOpen] = useState(false) // set add modal state
  const [removeCourseIsOpen, setRemoveCourseIsOpen] = useState(false) // set remove course modal state
  const [courseToRemove, setCourseToRemove] = useState<number>(-1) // set course to remove state (number)
  const [removedCourse, setRemovedCourse] = useState<EducationInfo>({} as EducationInfo)
  const deletedVocationals = usePdsStore((state) => state.deletedVocationals)
  const setDeletedVocationals = usePdsStore((state) => state.setDeletedVocationals)

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
      isOngoing: false,
      isGraduated: false,
      schoolName: '',
      degree: '',
      from: null,
      to: null,
      units: '',
      awards: '',
      yearGraduated: null,
    },
  })

  const watchIsOnGoing = watch('isOngoing') // assign the watch isongoing to watchIsOnGoing
  const getIsOnGoing = getValues('isOngoing') // assign the getvalues isongoing to getIsOnGoing
  const watchIsGraduated = watch('isGraduated') // assign the watch isgraduated to watchIsGraduated
  const getIsGraduated = getValues('isGraduated') // assign the getvalues isongraduated to getIsGraduated

  // fire submit button
  const onSubmit = handleSubmit((course: EducationInfo, e: any) => {
    e.preventDefault()
    const updatedVocational = [...vocational]
    updatedVocational.push(course)
    const sortedUpdatedVocational = [...updatedVocational].sort((firstItem, secondItem) =>
      firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0
    )
    setVocational(sortedUpdatedVocational)
    reset()
    setAddVocationalIsOpen(false)
  })

  // open add modal
  const openModal = () => {
    reset()
    clearErrors
    setAddVocationalIsOpen(true)
  }

  // close add modal
  const closeModal = () => {
    reset()
    clearErrors()
    setAddVocationalIsOpen(false)
  }

  // opens the remove action modal
  const openRemoveActionModal = (course: EducationInfo, courseIdx: number) => {
    setRemoveCourseIsOpen(true)
    setCourseToRemove(courseIdx)
    setRemovedCourse(course)
  }

  // remove course action
  const handleRemoveCourse = (courseIdx: number) => {
    const updatedVocational = [...vocational]

    let deleted = [...deletedVocationals]

    deleted.push(removedCourse)

    // set the new value of deleted
    setDeletedVocationals(deleted)

    // remove the object by id
    updatedVocational.splice(courseIdx, 1)

    // set the new array
    setVocational(updatedVocational)
    setRemoveCourseIsOpen(false)
  }

  // set the year ended to NULL if `Currently Attending checkbox` is ticked
  useEffect(() => {
    if (getValues('isOngoing') === true) {
      setValue('to', null)
      clearErrors('to')
    }
  }, [watchIsOnGoing])

  // set the year graduated to NULL if `Graduated checkbox` is ticked
  useEffect(() => {
    if (getValues('isGraduated') === true) {
      setValue('yearGraduated', getValues('to'))
      clearErrors('yearGraduated')
    } else {
      setValue('yearGraduated', null)
      clearErrors('yearGraduated')
    }
  }, [watchIsGraduated, watch('to')])

  return (
    <>
      <Card
        title="Vocational"
        remarks={
          <Button btnLabel="Add Vocational Course" type="button" variant="theme" shadow onClick={openModal} className="sm:w-full lg:w-56" />
        }
        subtitle={vocational.length === 0 ? '' : 'Courses are sorted by the beginning year in descending order.'}
        children={
          <>
            <Modal
              title="Vocational Education"
              subtitle={
                <>
                  Please fill-out all required fields ( <span className="text-red-700">*</span> )
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
              actionLabel="Submit"
              cancelLabel="Cancel"
              children={
                <>
                  <div className="mb-5 gap-4 p-5">
                    <div className="mb-5 w-full">
                      <InputReactForm
                        id="vocshoolname"
                        name="vocschoolname"
                        label="School"
                        placeholder="Write in Full. Do not abbreviate."
                        type="text"
                        labelIsRequired
                        controller={{ ...register('schoolName') }}
                        withLabel={true}
                        isError={errors.schoolName && errors.schoolName.message ? true : false}
                        errorMessage={errors.schoolName?.message}
                      />
                    </div>

                    <div className="mt-5 w-full">
                      <InputReactForm
                        id="vocdegree"
                        name="vocdegree"
                        label="Basic Education or Degree or Course"
                        placeholder="Write in Full."
                        type="text"
                        labelIsRequired
                        controller={{ ...register('degree') }}
                        withLabel={true}
                        isError={errors.degree && errors.degree.message ? true : false}
                        errorMessage={errors.degree?.message}
                      />
                    </div>

                    <div className="mt-10 grid-cols-2 gap-8 sm:grid md:grid lg:flex">
                      <div className="col-span-1 w-full sm:block">
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
                          isError={errors.from && errors.from.message ? true : false}
                          errorMessage={errors.from?.message}
                        />
                      </div>

                      <div className="col-span-1 w-full sm:block">
                        <div className="xs:flex justify-end sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
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
                          placeholder={getIsOnGoing === true ? 'Present' : 'Year Ended'}
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

                    <div className="mt-10 grid-cols-2 gap-8 sm:grid md:grid lg:flex">
                      <div className="col-span-1 w-full sm:block">
                        <InputReactForm
                          id="vocunits"
                          name="vocunits"
                          label="Highest Level or Units Earned"
                          placeholder="Leave blank if not applicable"
                          type="text"
                          controller={{ ...register('units', { required: false }) }}
                          withHelpButton
                          helpContent="Indicated the highest level or units earned only if not graduated"
                          withLabel={true}
                          isError={errors.units && errors.units.message ? true : false}
                          errorMessage={errors.units?.message}
                        />
                      </div>
                      <div className="col-span-1 w-full sm:block">
                        <div className="xs:flex justify-end sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                          <CheckboxRF
                            id="vocisgraduated"
                            name="vocisGraduated"
                            label="Graduated?"
                            controller={{ ...register('isGraduated') }}
                            muted={getIsOnGoing}
                          />
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
                                ? 'No input from "Year Ended"'
                                : 'Not Applicable'
                            }
                            type="number"
                            controller={{ ...register('yearGraduated') }}
                            withLabel={true}
                            muted={true}
                            isError={errors.yearGraduated && errors.yearGraduated.message ? true : false}
                            errorMessage={errors.yearGraduated?.message}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="my-10 w-full">
                      <InputReactForm
                        id="vocawards"
                        name="vocawards"
                        label="Scholarship or Academic Honors Received"
                        placeholder="Leave blank if not applicable"
                        type="text"
                        controller={{ ...register('awards') }}
                        withLabel={true}
                        isError={errors.awards && errors.awards.message ? true : false}
                        errorMessage={errors.awards?.message}
                      />
                    </div>
                  </div>
                </>
              }
            />
            <ModalAction isOpen={removeCourseIsOpen} setIsOpen={setRemoveCourseIsOpen} action={() => handleRemoveCourse(courseToRemove)} />
            {vocational.length === 0 ? (
              <NoDataVisual />
            ) : (
              <>
                <Table
                  tableHeader={
                    <>
                      <TableHeader label="Name of School" headerWidth="w-[20%]" className="pl-4" />
                      <TableHeader label="Course" headerWidth="w-[25%]" />
                      <TableHeader label="Period" headerWidth="w-[10%]" />
                      <TableHeader label="Year Graduated" headerWidth="w-[10%]" />
                      <TableHeader label="Level/Units Earned" headerWidth="w-[10%]" />
                      <TableHeader label="Honors Received" headerWidth="w-[10%]" />
                      <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                    </>
                  }
                  tableBody={
                    <tbody>
                      {vocational.map((course: EducationInfo, courseIdx: number) => {
                        return (
                          <tr
                            key={courseIdx}
                            className={`odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default  hover:bg-indigo-200 hover:transition-all`}
                          >
                            <TableDimension isText={true} label={course.schoolName} className="px-4" />
                            <TableDimension isText={true} label={course.degree} className="select-none px-1" />
                            <TableDimension
                              isText={true}
                              isPeriod={true}
                              periodLabel1={course.from}
                              periodLabel2={course.to ? course.to : 'Present'}
                              label=""
                            />
                            <TableDimension isText={true} className="px-1" label={course.yearGraduated ? course.yearGraduated : 'N/A'} />
                            <TableDimension isText={true} className="px-1" label={course.units ? course.units : 'N/A'} />
                            <TableDimension isText={true} className="px-1" label={course.awards ? course.awards : 'N/A'} />
                            <TableDimension
                              isText={false}
                              className="select-none px-2 text-center"
                              tableDimension={
                                <>
                                  <DeleteButton action={() => openRemoveActionModal(course, courseIdx)} />
                                </>
                              }
                            />
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                />
              </>
            )}
          </>
        }
      />
    </>
  )
}
