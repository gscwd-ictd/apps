import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEmployeeStore } from '../../../../store/employee.store'
import { usePdsStore } from '../../../../store/pds.store'
import { SecEducation } from '../../../../types/data/education.type'
import { Card } from '../../../modular/cards/Card'
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF'
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL'
import { secondaryLevel, highestLevelHS, highestLevelJHS, highestLevelSHS } from '../../../../../utils/constants/constants'
import { useApplicantStore } from '../../../../store/applicant.store'
import { isEmpty } from 'lodash'

export const Secondary = (): JSX.Element => {
  // set secondary object, employee object from pds store
  const secondary = usePdsStore((state) => state.secondary)
  const setSecondary = usePdsStore((state) => state.setSecondary)
  const applicant = useApplicantStore((state) => state.applicant)
  const isExistingApplicant = useApplicantStore((state) => state.isExistingApplicant)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // initialize react hook use form context
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<SecEducation>()

  const watchSecUnits = watch('secUnits') // assign the watch secunits to watchSecUnits
  const getSecUnits = getValues('secUnits') // assign the getvalues secunits to getSecUnits
  const getSecSchoolName = getValues('secSchoolName') // assign the getvalues secschoolname to getSecSchoolName
  const watchSecSchoolName = watch('secSchoolName') // assign the watch secschoolname to watchSecSchoolName
  const getSecDegree = getValues('secDegree') // assign the getvalues secdegree to getSecDegree

  // if schoolname value is empty or null, set form values to default and clear errors
  useEffect(() => {
    if (watchSecSchoolName === null || watchSecSchoolName === '') {
      setSecondary({ ...secondary, degree: '', from: null, to: null, units: '', yearGraduated: null, awards: '' })
      setValue('secDegree', '')
      setValue('secFrom', null)
      setValue('secTo', null)
      setValue('secUnits', '')
      setValue('secYearGraduated', null)
      setValue('secAwards', null)
      clearErrors('secDegree')
      clearErrors('secFrom')
      clearErrors('secTo')
      clearErrors('secUnits')
      clearErrors('secYearGraduated')
      clearErrors('secAwards')
    }
  }, [watchSecSchoolName])

  // if getsecunits is any of the following, set year graduated to null
  useEffect(() => {
    if (
      getSecUnits === 'First year high school' ||
      getSecUnits === 'Second year high school' ||
      getSecUnits === 'Third year high school' ||
      getSecUnits === 'Grade 11' ||
      getSecUnits === 'Grade 9' ||
      getSecUnits === 'Grade 8' ||
      getSecUnits === 'Grade 7'
    ) {
      setValue('secYearGraduated', null)
      clearErrors('secYearGraduated')
      setSecondary({ ...secondary, yearGraduated: null })
    } else if (getSecUnits === 'Graduated') {
      setValue('secYearGraduated', getValues('secTo'))
      clearErrors('secYearGraduated')
      setSecondary({ ...secondary, yearGraduated: getValues('secTo') })
    }
  }, [watchSecUnits, watch('secTo')])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [])

  return (
    <>
      <Card
        title="Secondary"
        subtitle="Leave blank if not applicable."
        children={
          <>
            <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-2">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="secSchoolName"
                  isRequired={getSecSchoolName ? true : false}
                  placeholder="Name of School"
                  type="text"
                  controller={{
                    ...register('secSchoolName', {
                      value: secondary.schoolName ? secondary.schoolName : '',
                      onChange: (e) => setSecondary({ ...secondary, schoolName: e.target.value }),
                    }),
                  }}
                  isError={errors.secSchoolName ? true : false}
                  errorMessage={errors.secSchoolName?.message}
                />
              </div>
              <div className="col-span-1 mb-7 w-full">
                <SelectListRFFL
                  id="secDegree"
                  selectList={secondaryLevel}
                  // muted={!getSecSchoolName ? true : false}
                  isRequired={getSecSchoolName ? true : false}
                  variant="light"
                  defaultOption="Secondary Level"
                  controller={{
                    ...register('secDegree', {
                      value: !isEmpty(secondary.degree) ? secondary.degree : '',
                      onChange: (e) => setSecondary({ ...secondary, degree: e.target.value }),
                    }),
                  }}
                  isError={errors.secDegree ? true : false}
                  errorMessage={errors.secDegree?.message}
                />
              </div>
            </div>

            <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
              <div className="xs:block col-span-1 w-full gap-4 lg:flex lg:grid-cols-2">
                <div className="col-span-1 mb-7 w-full">
                  <FloatingLabelInputRF
                    id="secFrom"
                    muted={!getSecSchoolName ? true : false}
                    isRequired={getSecSchoolName ? true : false}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Year Started"
                    type="number"
                    controller={{
                      ...register('secFrom', {
                        value: secondary.from ? secondary.from : null,
                        onChange: (e) => setSecondary({ ...secondary, from: e.target.value }),
                      }),
                    }}
                    isError={errors.secFrom ? true : false}
                    errorMessage={errors.secFrom?.message}
                  />
                </div>

                <div className="col-span-1 mb-7 w-full">
                  <FloatingLabelInputRF
                    id="secTo"
                    muted={!getSecSchoolName ? true : false}
                    isRequired={getSecSchoolName ? true : false}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Year Ended"
                    type="number"
                    controller={{
                      ...register('secTo', {
                        value: secondary.to ? secondary.to : null,
                        onChange: (e) => setSecondary({ ...secondary, to: e.target.value }),
                      }),
                    }}
                    isError={errors.secTo ? true : false}
                    errorMessage={errors.secTo?.message}
                  />
                </div>
              </div>
              <div className="col-span-1 mb-7 w-full">
                {isLoading ? (
                  <></>
                ) : (
                  <SelectListRFFL
                    id="secUnits"
                    variant="light"
                    // muted={!getSecSchoolName ? true : false}
                    isRequired={getSecSchoolName ? true : false}
                    selectList={
                      watch('secDegree') === 'High School'
                        ? highestLevelHS
                        : getSecDegree === 'Junior High School'
                        ? highestLevelJHS
                        : getSecDegree === 'Senior High School'
                        ? highestLevelSHS
                        : []
                    }
                    defaultOption="Highest Level"
                    controller={{
                      ...register('secUnits', {
                        value: !isEmpty(secondary.units) ? secondary.units : '',
                        onChange: (e) => setSecondary({ ...secondary, units: e.target.value }),
                      }),
                    }}
                    isError={errors.secUnits ? true : false}
                    errorMessage={errors.secUnits?.message}
                  />
                )}
              </div>
            </div>

            <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="secYearGrad"
                  onWheel={(e) => e.currentTarget.blur()}
                  muted={true}
                  isRequired={getSecSchoolName && getSecUnits === 'Graduated' ? true : false}
                  placeholder="Year Graduated"
                  type="number"
                  controller={{
                    ...register('secYearGraduated', {
                      value: secondary.yearGraduated ? secondary.yearGraduated : null,
                      onChange: (e) => setSecondary({ ...secondary, yearGraduated: e.target.value }),
                    }),
                  }}
                  isError={errors.secYearGraduated ? true : false}
                  errorMessage={errors.secYearGraduated?.message}
                />
              </div>
              <div className="col-span-1 w-full">
                <FloatingLabelInputRF
                  id="secAwards"
                  muted={!getSecSchoolName ? true : false}
                  placeholder="Scholarship or Academic Honors Received"
                  type="text"
                  isRequired={getSecSchoolName ? true : false}
                  controller={{
                    ...register('secAwards', {
                      value: secondary.awards ? secondary.awards : '',
                      onChange: (e) => setSecondary({ ...secondary, awards: e.target.value }),
                    }),
                  }}
                  isError={errors.secAwards ? true : false}
                  errorMessage={errors.secAwards?.message}
                />
              </div>
            </div>
          </>
        }
      />
    </>
  )
}
