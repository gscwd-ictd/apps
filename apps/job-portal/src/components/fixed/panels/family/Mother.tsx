import { Card } from '../../../modular/cards/Card';
import { useFormContext } from 'react-hook-form';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { usePdsStore } from '../../../../store/pds.store';
import { ParentForm } from 'apps/job-portal/utils/types/data/family.type';

export const MotherInfo = (): JSX.Element => {
  // set parents state from pds context
  const parents = usePdsStore((state) => state.parents);
  const setParents = usePdsStore((state) => state.setParents);

  // initialize react hook forms
  const {
    register,
    formState: { errors },
  } = useFormContext<ParentForm>();

  return (
    <>
      <Card
        title="Mother's Maiden Name"
        subtitle="Write your mother's maiden name (the name when she was single or before marriage). Write 'N/A' if not applicable"
      >
        <>
          <div className="gap-4 xs:block mt-7 lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="motherlastname"
                placeholder="Surname"
                type="text"
                isRequired
                controller={{
                  ...register('motherLName', {
                    value: parents.motherLastName,
                    onChange: (e) =>
                      setParents({
                        ...parents,
                        motherLastName: e.target.value,
                      }),
                  }),
                }}
                isError={errors.motherLName ? true : false}
                errorMessage={errors.motherLName?.message}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="motherfirstname"
                placeholder="First Name"
                type="text"
                isRequired
                controller={{
                  ...register('motherFName', {
                    value: parents.motherFirstName,
                    onChange: (e) =>
                      setParents({
                        ...parents,
                        motherFirstName: e.target.value,
                      }),
                  }),
                }}
                isError={errors.motherFName ? true : false}
                errorMessage={errors.motherFName?.message}
              />
            </div>
          </div>
          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 lg:w-[50%] lg:pr-2">
              <FloatingLabelInputRF
                id="mothermiddlename"
                placeholder="Middle Name"
                type="text"
                isRequired
                controller={{
                  ...register('motherMName', {
                    value: parents.motherMiddleName,
                    onChange: (e) =>
                      setParents({
                        ...parents,
                        motherMiddleName: e.target.value,
                      }),
                  }),
                }}
                isError={errors.motherMName ? true : false}
                errorMessage={errors.motherMName?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
