import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { units } from '../../../../../utils/constants/constants';
import { useApplicantStore } from '../../../../store/applicant.store';
import { usePdsStore } from '../../../../store/pds.store';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';

/**
 * @degree Initializes the array of label and value objects in the Degree input
 */
const degree = [{ label: 'Elementary', value: 'Elementary' }];

/**
 * @units Initializes the array of label and value objects in the Units input
 */

type ElemEducation = {
  elemSchoolName: string;
  elemDegree: string;
  elemFrom: number;
  elemTo: number;
  elemUnits: string;
  elemAwards: string;
  elemYearGraduated: number | null;
};

export const Elementary = (): JSX.Element => {
  // pulls the elementary object from the pds store
  const elementary = usePdsStore((state) => state.elementary);

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
      clearErrors('elemYearGraduated');
      setElementary({ ...elementary, yearGraduated: getValues('elemTo') });
    }
  }, [watchElemUnits, watch('elemTo')]);

  return (
    <>
      <Card title="Elementary" subtitle="Leave blank if not applicable.">
        <>
          <div className="gap-4 xs:block mt-7 lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="elemSchoolName"
                placeholder="Name of School"
                type="text"
                isRequired
                controller={{
                  ...register('elemSchoolName', {
                    value: elementary.schoolName ? elementary.schoolName : '',
                    onChange: (e) =>
                      setElementary({
                        ...elementary,
                        schoolName: e.target.value,
                      }),
                  }),
                }}
                isError={errors.elemSchoolName ? true : false}
                errorMessage={errors.elemSchoolName?.message}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
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
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 gap-4 xs:block lg:flex lg:grid-cols-2">
              <div className="w-full col-span-1 mb-7">
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
                />
              </div>

              <div className="w-full col-span-1 mb-7">
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
                />
              </div>
            </div>

            <div className="w-full col-span-1 mb-7">
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
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
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

            <div className="w-full col-span-1 xs:mb-7">
              <FloatingLabelInputRF
                id="elemAwards"
                placeholder="Scholarship or Academic Honors Received"
                type="text"
                isRequired
                controller={{
                  ...register('elemAwards', {
                    value: elementary.awards ? elementary.awards : '',
                    onChange: (e) => setElementary({ ...elementary, awards: e.target.value }),
                  }),
                }}
                isError={errors.elemAwards ? true : false}
                errorMessage={errors.elemAwards?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
