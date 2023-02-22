import { Card } from '../../../modular/cards/Card';
import { useFormContext } from 'react-hook-form';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { ParentForm } from '../../../../types/data/family.type';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from 'store/employee.store';
import { FatherAlert } from './FatherAlert';

export const FatherInfo = (): JSX.Element => {
  // set parents state from pds store
  const parents = usePdsStore((state) => state.parents);
  const fatherOnEdit = usePdsStore((state) => state.fatherOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setParents = usePdsStore((state) => state.setParents);
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
      fatherLastName: initialPdsState.parents.fatherLastName,
      fatherFirstName: initialPdsState.parents.fatherFirstName,
      fatherMiddleName: initialPdsState.parents.fatherMiddleName,
      fatherNameExtension: initialPdsState.parents.fatherNameExtension,
    });
    setValue('fatherLName', initialPdsState.parents.fatherLastName);
    setValue('fatherFName', initialPdsState.parents.fatherFirstName);
    setValue('fatherMName', initialPdsState.parents.fatherMiddleName);
    setValue('fatherNameExt', initialPdsState.parents.fatherNameExtension);
  };

  return (
    <>
      <Card title="Father's Information" subtitle="Write your father's information. Write 'N/A' if not applicable.">
        <>
          <div className="-mt-16 flex w-full justify-end pb-10">
            <FatherAlert setInitialValues={setInitialValues} />
          </div>

          <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="fatherLName"
                placeholder="Surname"
                isRequired
                type="text"
                controller={{
                  ...register('fatherLName', {
                    value: parents.fatherLastName,
                    onChange: (e) => setParents({ ...parents, fatherLastName: e.target.value }),
                  }),
                }}
                isError={errors.fatherLName ? true : false}
                errorMessage={errors.fatherLName?.message}
                muted={hasPds && fatherOnEdit ? false : hasPds && !fatherOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="fatherfirstname"
                placeholder="First Name"
                isRequired
                type="text"
                controller={{
                  ...register('fatherFName', {
                    value: parents.fatherFirstName,
                    onChange: (e) => setParents({ ...parents, fatherFirstName: e.target.value }),
                  }),
                }}
                isError={errors.fatherFName ? true : false}
                errorMessage={errors.fatherFName?.message}
                muted={hasPds && fatherOnEdit ? false : hasPds && !fatherOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>

          <div className="xs:block gap-4 lg:flex lg:grid-cols-2">
            <div className="col-span-1 mb-7 w-full">
              <FloatingLabelInputRF
                id="fathermiddlename"
                placeholder="Middle Name"
                isRequired
                type="text"
                controller={{
                  ...register('fatherMName', {
                    value: parents.fatherMiddleName,
                    onChange: (e) => setParents({ ...parents, fatherMiddleName: e.target.value }),
                  }),
                }}
                isError={errors.fatherMName ? true : false}
                errorMessage={errors.fatherMName?.message}
                muted={hasPds && fatherOnEdit ? false : hasPds && !fatherOnEdit ? true : !hasPds && false}
              />
            </div>
            <div className="col-span-1 w-full ">
              <FloatingLabelInputRF
                id="fathernameext"
                placeholder="Name Extension (Jr.,Sr.)"
                type="text"
                isRequired
                controller={{
                  ...register('fatherNameExt', {
                    value: parents.fatherNameExtension,
                    onChange: (e) => setParents({ ...parents, fatherNameExtension: e.target.value }),
                  }),
                }}
                isError={errors.fatherNameExt ? true : false}
                errorMessage={errors.fatherNameExt?.message}
                muted={hasPds && fatherOnEdit ? false : hasPds && !fatherOnEdit ? true : !hasPds && false}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
