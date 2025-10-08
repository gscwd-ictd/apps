/* eslint-disable @nx/enforce-module-boundaries */
import { ElemEducation } from 'apps/pds/src/types/data/family.type';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { units } from '../../../../../utils/constants/constants';
import { useEmployeeStore } from '../../../../store/employee.store';
import { usePdsStore } from '../../../../store/pds.store';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';
import { ElementaryAlert } from './ElementaryAlert';

/**
 * @degree Initializes the array of label and value objects in the Degree input
 */
const degree = [{ label: 'Elementary', value: 'Elementary' }];

/**
 * @units Initializes the array of label and value objects in the Units input
 */

export const Elementary = (): JSX.Element => {
  // pulls the elementary object from the pds store
  const elementary = usePdsStore((state) => state.elementary);
  const employee = useEmployeeStore((state) => state.employeeDetails); // pulls the employee object from the employee store
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const elementaryOnEdit = usePdsStore((state) => state.elementaryOnEdit);
  const setElementary = usePdsStore((state) => state.setElementary);

  const {
    register,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<ElemEducation>();
  const getElemUnits = getValues('elemUnits'); // assign the getValues elemunits to getElemUnits
  const watchElemUnits = watch('elemUnits'); // assign the watch elemunits to watchElemunits

  const setInitialValues = () => {
    clearErrors();
    setElementary(initialPdsState.elementary);
    setValue('elemSchoolName', initialPdsState.elementary.schoolName!);
    setValue('elemDegree', initialPdsState.elementary.degree!);
    setValue('elemFrom', initialPdsState.elementary.from!);
    setValue('elemTo', initialPdsState.elementary.to!);
    setValue('elemUnits', initialPdsState.elementary.units!);
    setValue('elemYearGraduated', initialPdsState.elementary.yearGraduated!);
    setValue('elemAwards', initialPdsState.elementary.awards!);
  };

  // effect sets year grad to empty if getelemunits' value is any of the ff
  useEffect(() => {
    if (
      getElemUnits === 'Grade 1' ||
      getElemUnits === 'Grade 2' ||
      getElemUnits === 'Grade 3' ||
      getElemUnits === 'Grade 4' ||
      getElemUnits === 'Grade 5'
    ) {
      setValue('elemYearGraduated', null);
      clearErrors('elemYearGraduated');
      setElementary({ ...elementary, yearGraduated: null });
    } else if (getElemUnits === 'Graduated') {
      setValue('elemYearGraduated', getValues('elemTo'));
      setElementary({ ...elementary, yearGraduated: getValues('elemTo') });
      clearErrors('elemYearGraduated');
    }
  }, [watchElemUnits, watch('elemTo')]);

  useEffect(
    () =>
      setElementary({
        ...elementary,
        employeeId: employee.employmentDetails.userId,
      }),
    []
  );

  return (
    <>
      <Card
        title="Elementary"
        subtitle="Write your elementary education information. Write 'N/A' if not applicable."
        remarks={<ElementaryAlert setInitialValues={setInitialValues} />}
      >
        <>
          <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="elemSchoolName"
                placeholder="Name of School"
                type="text"
                isRequired
                controller={{
                  ...register('elemSchoolName', {
                    value: elementary.schoolName ? elementary.schoolName.trim() : '',
                    onChange: (e) =>
                      setElementary({
                        ...elementary,
                        schoolName: e.target.value,
                      }),
                  }),
                }}
                isError={errors.elemSchoolName ? true : false}
                errorMessage={errors.elemSchoolName?.message}
                muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
              />
            </div>

            <div className="col-span-1 mb-7 w-full">
              <SelectListRFFL
                id="elemDegree"
                selectList={degree}
                isRequired
                variant="light"
                defaultOption="Basic Education"
                controller={{
                  ...register('elemDegree', {
                    value: elementary.degree ? elementary.degree : '',
                    onChange: (e) => setElementary({ ...elementary, degree: e.target.value }),
                  }),
                }}
                isError={errors.elemDegree ? true : false}
                errorMessage={errors.elemDegree?.message}
                muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="xs:block col-span-1 w-full gap-4 lg:flex lg:grid-cols-2">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="elemFrom"
                  placeholder="Year Started"
                  type="number"
                  isRequired
                  onWheel={(e) => e.currentTarget.blur()}
                  controller={{
                    ...register('elemFrom', {
                      value: elementary.from ? elementary.from : undefined,
                      onChange: (e) => setElementary({ ...elementary, from: e.target.value }),
                    }),
                  }}
                  isError={errors.elemFrom ? true : false}
                  errorMessage={errors.elemFrom?.message}
                  muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
                />
              </div>

              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="elemTo"
                  placeholder="Year Ended"
                  type="number"
                  onWheel={(e) => e.currentTarget.blur()}
                  isRequired
                  controller={{
                    ...register('elemTo', {
                      value: elementary.to ? elementary.to : undefined,
                      onChange: (e) => setElementary({ ...elementary, to: e.target.value }),
                    }),
                  }}
                  isError={errors.elemTo ? true : false}
                  errorMessage={errors.elemTo?.message}
                  muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
                />
              </div>
            </div>

            <div className="col-span-1 mb-7 w-full">
              <SelectListRFFL
                id="elemUnits"
                variant="light"
                placeholder="Highest level"
                isRequired
                type="text"
                controller={{
                  ...register('elemUnits', {
                    value: elementary.units ? elementary.units : '',
                    onChange: (e) => setElementary({ ...elementary, units: e.target.value }),
                  }),
                }}
                selectList={units}
                defaultOption={'Highest level'}
                isError={errors.elemUnits ? true : false}
                errorMessage={errors.elemUnits?.message}
                muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="elemYearGraduated"
                isRequired={getElemUnits === 'Graduated' ? true : false}
                placeholder="Year Graduated"
                muted={true}
                type="number"
                controller={{
                  ...register('elemYearGraduated', {
                    value: elementary.yearGraduated ? elementary.yearGraduated : null,
                    onChange: (e) =>
                      setElementary({
                        ...elementary,
                        yearGraduated: e.target.value,
                      }),
                  }),
                }}
                isError={errors.elemYearGraduated ? true : false}
                errorMessage={errors.elemYearGraduated?.message}
              />
            </div>

            <div className="xs:mb-7 col-span-1 w-full">
              <FloatingLabelInputRF
                id="elemAwards"
                placeholder="Scholarship or Academic Honors Received"
                type="text"
                isRequired
                controller={{
                  ...register('elemAwards', {
                    value: elementary.awards ? elementary.awards.trim() : '',
                    onChange: (e) => setElementary({ ...elementary, awards: e.target.value }),
                  }),
                }}
                isError={errors.elemAwards ? true : false}
                errorMessage={errors.elemAwards?.message}
                muted={hasPds && elementaryOnEdit ? false : hasPds && !elementaryOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
