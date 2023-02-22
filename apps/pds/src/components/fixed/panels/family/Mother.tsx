/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Card } from '../../../modular/cards/Card';
import { useFormContext } from 'react-hook-form';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { ParentForm } from '../../../../types/data/family.type';
import { usePdsStore } from '../../../../store/pds.store';
import { MotherAlert } from './MotherAlert';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';

export const MotherInfo = (): JSX.Element => {
  // set parents state from pds context
  const parents = usePdsStore((state) => state.parents);
  const setParents = usePdsStore((state) => state.setParents);
  const motherOnEdit = usePdsStore((state) => state.motherOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);

  // initialize react hook forms
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<ParentForm>();

  const setInitialValues = () => {
    clearErrors();
    setParents({
      ...parents,
      motherLastName: initialPdsState.parents.motherLastName,
      motherFirstName: initialPdsState.parents.motherFirstName,
      motherMiddleName: initialPdsState.parents.motherMiddleName,
    });
    setValue('motherLName', initialPdsState.parents.motherLastName);
    setValue('motherFName', initialPdsState.parents.motherFirstName);
    setValue('motherMName', initialPdsState.parents.motherMiddleName);
  };

  return (
    <>
      <Card
        title="Mother's Maiden Name"
        subtitle="Write your mother's maiden name (the name when she was single or before marriage). Write 'N/A' if not applicable"
      >
        <>
          <div className="flex justify-end w-full pb-10 -mt-16">
            <MotherAlert setInitialValues={setInitialValues} />
          </div>
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
                    onChange: (e) => setParents({ ...parents, motherLastName: e.target.value }),
                  }),
                }}
                isError={errors.motherLName ? true : false}
                errorMessage={errors.motherLName?.message}
                muted={hasPds && motherOnEdit ? false : hasPds && !motherOnEdit ? true : !hasPds && false}
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
                    onChange: (e) => setParents({ ...parents, motherFirstName: e.target.value }),
                  }),
                }}
                isError={errors.motherFName ? true : false}
                errorMessage={errors.motherFName?.message}
                muted={hasPds && motherOnEdit ? false : hasPds && !motherOnEdit ? true : !hasPds && false}
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
                    onChange: (e) => setParents({ ...parents, motherMiddleName: e.target.value }),
                  }),
                }}
                isError={errors.motherMName ? true : false}
                errorMessage={errors.motherMName?.message}
                muted={hasPds && motherOnEdit ? false : hasPds && !motherOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
