import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { useFormContext } from 'react-hook-form';
import { usePdsStore } from '../../../../store/pds.store';
import { useApplicantStore } from '../../../../store/applicant.store';
import { SpouseForm } from 'apps/job-portal/utils/types/data/family.type';

export const SpouseInfo = (): JSX.Element => {
  // set spouse state from pds store
  const spouse = usePdsStore((state) => state.spouse);
  const setSpouse = usePdsStore((state) => state.setSpouse);
  const applicant = useApplicantStore((state) => state.applicant);

  // initialize react hook forms
  const {
    register,
    formState: { errors },
  } = useFormContext<SpouseForm>();

  return (
    <>
      <Card
        title="Spouse's Information"
        subtitle="Write your spouse's information. Write 'N/A' if not applicable."
      >
        <>
          <div className="gap-4 xs:block mt-7 lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spouselastname"
                placeholder="Surname"
                isRequired
                type="text"
                controller={{
                  ...register('spouseLName', {
                    value: spouse.lastName,
                    onChange: (e) =>
                      setSpouse({ ...spouse, lastName: e.target.value }),
                  }),
                }}
                isError={errors.spouseLName ? true : false}
                errorMessage={errors.spouseLName?.message}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousefirstname"
                placeholder="First Name"
                isRequired
                type="text"
                controller={{
                  ...register('spouseFName', {
                    value: spouse.firstName,
                    onChange: (e) =>
                      setSpouse({ ...spouse, firstName: e.target.value }),
                  }),
                }}
                isError={errors.spouseFName ? true : false}
                errorMessage={errors.spouseFName?.message}
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousemiddlename"
                placeholder="Middle Name"
                isRequired
                type="text"
                controller={{
                  ...register('spouseMName', {
                    value: spouse.middleName,
                    onChange: (e) =>
                      setSpouse({ ...spouse, middleName: e.target.value }),
                  }),
                }}
                isError={errors.spouseMName ? true : false}
                errorMessage={errors.spouseMName?.message}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousenameext"
                placeholder="Name Extension (Jr.,Sr.)"
                isRequired
                type="text"
                controller={{
                  ...register('spouseNameExt', {
                    value: spouse.nameExtension,
                    onChange: (e) =>
                      setSpouse({ ...spouse, nameExtension: e.target.value }),
                  }),
                }}
                isError={errors.spouseNameExt ? true : false}
                errorMessage={errors.spouseNameExt?.message}
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousebusinessname"
                placeholder="Employer Name or Business Name"
                type="text"
                isRequired
                controller={{
                  ...register('spouseEmpBusName', {
                    value: spouse.employer,
                    onChange: (e) =>
                      setSpouse({ ...spouse, employer: e.target.value }),
                  }),
                }}
                isError={errors.spouseEmpBusName ? true : false}
                errorMessage={errors.spouseEmpBusName?.message}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousebusaddr"
                placeholder="Business Address"
                type="text"
                isRequired
                controller={{
                  ...register('spouseBusAddr', {
                    value: spouse.businessAddress,
                    onChange: (e) =>
                      setSpouse({ ...spouse, businessAddress: e.target.value }),
                  }),
                }}
                isError={errors.spouseBusAddr ? true : false}
                errorMessage={errors.spouseBusAddr?.message}
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="spousetelno"
                placeholder="Telephone No."
                type="text"
                isRequired
                controller={{
                  ...register('spouseTelNo', {
                    value: spouse.telephoneNumber,
                    onChange: (e) =>
                      setSpouse({ ...spouse, telephoneNumber: e.target.value }),
                  }),
                }}
                isError={errors.spouseTelNo ? true : false}
                errorMessage={errors.spouseTelNo?.message}
              />
            </div>
            <div className="w-full col-span-1">
              <FloatingLabelInputRF
                id="spouseoccupation"
                placeholder="Occupation"
                isRequired
                type="text"
                controller={{
                  ...register('spouseOccupation', {
                    value: spouse.occupation,
                    onChange: (e) =>
                      setSpouse({ ...spouse, occupation: e.target.value }),
                  }),
                }}
                isError={errors.spouseOccupation ? true : false}
                errorMessage={errors.spouseOccupation?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
