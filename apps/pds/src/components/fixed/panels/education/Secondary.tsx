import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useEmployeeStore } from '../../../../store/employee.store';
import { usePdsStore } from '../../../../store/pds.store';
import { SecEducation } from '../../../../types/data/education.type';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';
import { secondaryLevel, highestLevelHS, highestLevelJHS, highestLevelSHS } from '../../../../../utils/constants/constants';
import { SecondaryAlert } from './SecondaryAlert';

export const Secondary = (): JSX.Element => {
  // set secondary object, employee object from pds store
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const secondary = usePdsStore((state) => state.secondary);
  const secondaryOnEdit = usePdsStore((state) => state.secondaryOnEdit);
  const setSecondary = usePdsStore((state) => state.setSecondary);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);

  // initialize react hook use form context
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<SecEducation>();

  const watchSecUnits = watch('secUnits'); // assign the watch secunits to watchSecUnits
  const getSecUnits = getValues('secUnits'); // assign the getvalues secunits to getSecUnits
  const getSecSchoolName = getValues('secSchoolName'); // assign the getvalues secschoolname to getSecSchoolName
  const watchSecSchoolName = watch('secSchoolName'); // assign the watch secschoolname to watchSecSchoolName
  const getSecDegree = getValues('secDegree'); // assign the getvalues secdegree to getSecDegree

  const setInitialValues = () => {
    clearErrors();
    setSecondary(initialPdsState.secondary);
    setValue('secSchoolName', initialPdsState.secondary.schoolName!);
    setValue('secDegree', initialPdsState.secondary.degree!);
    setValue('secFrom', initialPdsState.secondary.from!);
    setValue('secTo', initialPdsState.secondary.to!);
    setValue('secUnits', initialPdsState.secondary.units!);
    setValue('secYearGraduated', initialPdsState.secondary.yearGraduated!);
    setValue('secAwards', initialPdsState.secondary.awards!);
  };

  // if schoolname value is empty or null, set form values to default and clear errors
  useEffect(() => {
    if (getSecSchoolName === null || getSecSchoolName === '') {
      setSecondary({ ...secondary, degree: '', from: null, to: null, units: '', yearGraduated: null, awards: '' });
      setValue('secDegree', '');
      setValue('secFrom', null);
      setValue('secTo', null);
      setValue('secUnits', '');
      setValue('secYearGraduated', null);
      setValue('secAwards', '');
      clearErrors('secDegree');
      clearErrors('secFrom');
      clearErrors('secTo');
      clearErrors('secUnits');
      clearErrors('secYearGraduated');
      clearErrors('secAwards');
    }
  }, [watchSecSchoolName]);

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
      setValue('secYearGraduated', null);
      clearErrors('secYearGraduated');
      setSecondary({ ...secondary, yearGraduated: null });
    } else if (getSecUnits === 'Graduated') {
      setValue('secYearGraduated', getValues('secTo'));
      clearErrors('secYearGraduated');
      setSecondary({ ...secondary, yearGraduated: getValues('secTo') });
    }
  }, [watchSecUnits, watch('secTo')]);

  // assign the employee id on page load
  useEffect(() => {
    setSecondary({ ...secondary, employeeId: employee.employmentDetails.userId });
  }, []);
  return (
    <>
      <Card title="Secondary" subtitle="Leave blank if not applicable.">
        <>
          <div className="-mt-16 flex w-full justify-end pb-10">
            <SecondaryAlert setInitialValues={setInitialValues} />
          </div>
          <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="secSchoolName"
                isRequired={getSecSchoolName ? true : false}
                placeholder="Name of School"
                type="text"
                controller={{
                  ...register('secSchoolName', {
                    value: secondary.schoolName ? secondary.schoolName.trim() : '',
                    onChange: (e) => setSecondary({ ...secondary, schoolName: e.target.value }),
                  }),
                }}
                isError={errors.secSchoolName ? true : false}
                errorMessage={errors.secSchoolName?.message}
                muted={hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 mb-7 w-full">
              <SelectListRFFL
                id="secDegree"
                selectList={secondaryLevel}
                isRequired={getSecSchoolName ? true : false}
                variant="light"
                defaultOption="Secondary Level"
                controller={{
                  ...register('secDegree', {
                    value: secondary.degree ? secondary.degree : '',
                    onChange: (e) => setSecondary({ ...secondary, degree: e.target.value }),
                  }),
                }}
                isError={errors.secDegree ? true : false}
                errorMessage={errors.secDegree?.message}
                muted={
                  (hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false) || (!getSecSchoolName ? true : false)
                }
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="xs:block col-span-1 w-full gap-4 lg:flex lg:grid-cols-2">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="secFrom"
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
                  muted={
                    (hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false) || (!getSecSchoolName ? true : false)
                  }
                />
              </div>

              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="secTo"
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
                  muted={
                    (hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false) || (!getSecSchoolName ? true : false)
                  }
                />
              </div>
            </div>
            <div className="col-span-1 mb-7 w-full">
              <SelectListRFFL
                id="secUnits"
                variant="light"
                isRequired={getSecSchoolName ? true : false}
                value={secondary.units ? secondary.units : ''}
                selectList={
                  getSecDegree === 'High School'
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
                    value: secondary.units ? secondary.units : '',
                    onChange: (e) => setSecondary({ ...secondary, units: e.target.value }),
                  }),
                }}
                isError={errors.secUnits ? true : false}
                errorMessage={errors.secUnits?.message}
                muted={
                  (hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false) || (!getSecSchoolName ? true : false)
                }
              />
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
                muted={
                  (hasPds && secondaryOnEdit ? false : hasPds && !secondaryOnEdit ? true : !hasPds && false) || (!getSecSchoolName ? true : false)
                }
                placeholder="Scholarship or Academic Honors Received"
                type="text"
                isRequired={getSecSchoolName ? true : false}
                controller={{
                  ...register('secAwards', {
                    value: secondary.awards ? secondary.awards.trim() : '',
                    onChange: (e) => setSecondary({ ...secondary, awards: e.target.value }),
                  }),
                }}
                isError={errors.secAwards ? true : false}
                errorMessage={errors.secAwards?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
