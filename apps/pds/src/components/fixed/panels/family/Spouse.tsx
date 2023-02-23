import { Card } from '../../../modular/cards/Card';
import { useEffect } from 'react';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { useFormContext } from 'react-hook-form';
import { SpouseForm } from '../../../../types/data/family.type';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { SpouseAlert } from './SpouseAlert';

export const SpouseInfo = (): JSX.Element => {
  // set spouse state from pds store
  const spouse = usePdsStore((state) => state.spouse);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const spouseOnEdit = usePdsStore((state) => state.spouseOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setSpouse = usePdsStore((state) => state.setSpouse);

  // initialize react hook forms
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<SpouseForm>();

  const setInitialValues = () => {
    clearErrors();
    setSpouse(initialPdsState.spouse);
    setValue('spouseLName', initialPdsState.spouse.lastName);
    setValue('spouseFName', initialPdsState.spouse.firstName);
    setValue('spouseMName', initialPdsState.spouse.middleName);
    setValue('spouseNameExt', initialPdsState.spouse.nameExtension);
    setValue('spouseEmpBusName', initialPdsState.spouse.employer);
    setValue('spouseBusAddr', initialPdsState.spouse.businessAddress);
    setValue('spouseTelNo', initialPdsState.spouse.telephoneNumber);
    setValue('spouseOccupation', initialPdsState.spouse.occupation);
  };

  // set employee id on page load
  useEffect(() => {
    setSpouse({ ...spouse, employeeId: employee.employmentDetails.userId });
  }, []);
  return (
    <>
      <Card title="Spouse's Information" subtitle="Write your spouse's information. Write 'N/A' if not applicable.">
        <>
          <div className="-mt-16 flex w-full justify-end pb-10">
            <SpouseAlert setInitialValues={setInitialValues} />
          </div>

          <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spouselastname"
                placeholder="Surname"
                isRequired
                type="text"
                controller={{
                  ...register('spouseLName', {
                    value: spouse.lastName,
                    onChange: (e) => setSpouse({ ...spouse, lastName: e.target.value }),
                  }),
                }}
                isError={errors.spouseLName ? true : false}
                errorMessage={errors.spouseLName?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousefirstname"
                placeholder="First Name"
                isRequired
                type="text"
                controller={{
                  ...register('spouseFName', {
                    value: spouse.firstName,
                    onChange: (e) => setSpouse({ ...spouse, firstName: e.target.value }),
                  }),
                }}
                isError={errors.spouseFName ? true : false}
                errorMessage={errors.spouseFName?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousemiddlename"
                placeholder="Middle Name"
                isRequired
                type="text"
                controller={{
                  ...register('spouseMName', {
                    value: spouse.middleName,
                    onChange: (e) => setSpouse({ ...spouse, middleName: e.target.value }),
                  }),
                }}
                isError={errors.spouseMName ? true : false}
                errorMessage={errors.spouseMName?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousenameext"
                placeholder="Name Extension (Jr.,Sr.)"
                isRequired
                type="text"
                controller={{
                  ...register('spouseNameExt', {
                    value: spouse.nameExtension,
                    onChange: (e) => setSpouse({ ...spouse, nameExtension: e.target.value }),
                  }),
                }}
                isError={errors.spouseNameExt ? true : false}
                errorMessage={errors.spouseNameExt?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousebusinessname"
                placeholder="Employer Name or Business Name"
                type="text"
                isRequired
                controller={{
                  ...register('spouseEmpBusName', {
                    value: spouse.employer,
                    onChange: (e) => setSpouse({ ...spouse, employer: e.target.value }),
                  }),
                }}
                isError={errors.spouseEmpBusName ? true : false}
                errorMessage={errors.spouseEmpBusName?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousebusaddr"
                placeholder="Business Address"
                type="text"
                isRequired
                controller={{
                  ...register('spouseBusAddr', {
                    value: spouse.businessAddress,
                    onChange: (e) => setSpouse({ ...spouse, businessAddress: e.target.value }),
                  }),
                }}
                isError={errors.spouseBusAddr ? true : false}
                errorMessage={errors.spouseBusAddr?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="spousetelno"
                placeholder="Telephone No."
                type="text"
                isRequired
                controller={{
                  ...register('spouseTelNo', {
                    value: spouse.telephoneNumber,
                    onChange: (e) => setSpouse({ ...spouse, telephoneNumber: e.target.value }),
                  }),
                }}
                isError={errors.spouseTelNo ? true : false}
                errorMessage={errors.spouseTelNo?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 w-full">
              <FloatingLabelInputRF
                id="spouseoccupation"
                placeholder="Occupation"
                isRequired
                type="text"
                controller={{
                  ...register('spouseOccupation', {
                    value: spouse.occupation,
                    onChange: (e) => setSpouse({ ...spouse, occupation: e.target.value }),
                  }),
                }}
                isError={errors.spouseOccupation ? true : false}
                errorMessage={errors.spouseOccupation?.message}
                muted={hasPds && spouseOnEdit ? false : hasPds && !spouseOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
