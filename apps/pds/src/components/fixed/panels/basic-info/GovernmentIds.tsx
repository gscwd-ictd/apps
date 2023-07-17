import { Card } from '../../../modular/cards/Card';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { GovernmentIssuedIds } from '../../../../types/data/basic-info.type';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { GovernmentIdsAlert } from './GovernmentIdsAlert';

export const GovernmentIDsBI = (): JSX.Element => {
  // set government id object, employee object state from pds context
  const governmentIssuedIds = usePdsStore((state) => state.governmentIssuedIds);
  const governmentIssuedIdsOnEdit = usePdsStore(
    (state) => state.governmentIssuedIdsOnEdit
  );
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const setGovernmentIssuedIds = usePdsStore(
    (state) => state.setGovernmentIssuedIds
  );
  const initialPdsState = usePdsStore((state) => state.initialPdsState);

  // initialize basic info useform context
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<GovernmentIssuedIds>();

  const setInitialValues = () => {
    clearErrors();
    setValue('gsisNumber', initialPdsState.governmentIssuedIds.gsisNumber);
    setValue(
      'pagibigNumber',
      initialPdsState.governmentIssuedIds.pagibigNumber
    );
    setValue(
      'philhealthNumber',
      initialPdsState.governmentIssuedIds.philhealthNumber
    );
    setValue('sssNumber', initialPdsState.governmentIssuedIds.sssNumber);
    setValue('tinNumber', initialPdsState.governmentIssuedIds.tinNumber);
    setValue('agencyNumber', initialPdsState.governmentIssuedIds.agencyNumber);
  };

  // assign employee id on page load
  useEffect(
    () =>
      setGovernmentIssuedIds({
        ...governmentIssuedIds,
        employeeId: employee.employmentDetails.userId,
      }),
    []
  );

  return (
    <>
      <Card
        title="Government IDs"
        subtitle="List down your Government IDs. Write N/A if not applicable"
        remarks={
          <div className="">
            <GovernmentIdsAlert setInitialValues={setInitialValues} />
          </div>
        }
      >
        <>
          <div className="gap-4 xs:block mt-7 lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="gsisno"
                placeholder="GSIS BP No."
                type="text"
                isRequired
                defaultValue={
                  governmentIssuedIds.gsisNumber
                    ? governmentIssuedIds.gsisNumber
                    : ''
                }
                maxLength={11}
                controller={{
                  ...register('gsisNumber', {
                    value: governmentIssuedIds.gsisNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        gsisNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.gsisNumber ? true : false}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
                errorMessage={errors.gsisNumber?.message}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="pagibigNo"
                placeholder="PAG-IBIG MID No."
                type="text"
                isRequired
                defaultValue={
                  governmentIssuedIds.pagibigNumber
                    ? governmentIssuedIds.pagibigNumber
                    : ''
                }
                maxLength={14}
                controller={{
                  ...register('pagibigNumber', {
                    value: governmentIssuedIds.pagibigNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        pagibigNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.pagibigNumber ? true : false}
                errorMessage={errors.pagibigNumber?.message}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="philhealthno"
                placeholder="Philhealth No."
                type="text"
                isRequired
                maxLength={14}
                defaultValue={
                  governmentIssuedIds.philhealthNumber
                    ? governmentIssuedIds.philhealthNumber
                    : ''
                }
                controller={{
                  ...register('philhealthNumber', {
                    value: governmentIssuedIds.philhealthNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        philhealthNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.philhealthNumber ? true : false}
                errorMessage={errors.philhealthNumber?.message}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="sssno"
                placeholder="SSS No."
                type="text"
                isRequired
                maxLength={12}
                defaultValue={
                  governmentIssuedIds.sssNumber
                    ? governmentIssuedIds.sssNumber.trim()
                    : ''
                }
                controller={{
                  ...register('sssNumber', {
                    value: governmentIssuedIds.sssNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        sssNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.sssNumber ? true : false}
                errorMessage={errors.sssNumber?.message}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="tinno"
                placeholder="TIN No."
                isRequired
                type="text"
                maxLength={15}
                defaultValue={
                  governmentIssuedIds.tinNumber
                    ? governmentIssuedIds.tinNumber
                    : ''
                }
                controller={{
                  ...register('tinNumber', {
                    value: governmentIssuedIds.tinNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        tinNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.tinNumber ? true : false}
                errorMessage={errors.tinNumber?.message}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>
            <div className="w-full col-span-1">
              <FloatingLabelInputRF
                id="agencyno"
                placeholder="Agency Employee No."
                isRequired
                type="text"
                defaultValue={
                  governmentIssuedIds.agencyNumber
                    ? governmentIssuedIds.agencyNumber
                    : ''
                }
                controller={{
                  ...register('agencyNumber', {
                    value: governmentIssuedIds.agencyNumber.trim(),
                    onChange: (e) =>
                      setGovernmentIssuedIds({
                        ...governmentIssuedIds,
                        agencyNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.agencyNumber ? true : false}
                errorMessage={errors.agencyNumber?.message}
                muted={
                  hasPds && governmentIssuedIdsOnEdit
                    ? false
                    : hasPds && !governmentIssuedIdsOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
