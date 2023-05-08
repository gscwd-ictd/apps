import { Card } from '../../../modular/cards/Card'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF'
import { GovernmentIssuedIds } from '../../../../types/data/basic-info.type'
import { usePdsStore } from '../../../../store/pds.store'
import { useEmployeeStore } from '../../../../store/employee.store'

export const GovernmentIDsBI = (): JSX.Element => {
  // set government id object, employee object state from pds context
  const governmentIssuedIds = usePdsStore((state) => state.governmentIssuedIds)
  const setGovernmentIssuedIds = usePdsStore((state) => state.setGovernmentIssuedIds)
  const employee = useEmployeeStore((state) => state.employeeDetails)

  // initialize basic info useform context
  const {
    register,
    formState: { errors },
  } = useFormContext<GovernmentIssuedIds>()

  return (
    <>
      <Card
        title="Government IDs"
        subtitle="List down your Government IDs"
        children={
          <>
            <div className="xs:block mt-7 gap-4 lg:flex lg:grid-cols-3">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="gsisno"
                  placeholder="GSIS BP No."
                  type="text"
                  isRequired
                  defaultValue={governmentIssuedIds.gsisNumber ? governmentIssuedIds.gsisNumber : ''}
                  maxLength={11}
                  controller={{
                    ...register('gsisNumber', {
                      value: governmentIssuedIds.gsisNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, gsisNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.gsisNumber ? true : false}
                  errorMessage={errors.gsisNumber?.message}
                />
              </div>
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="pagibigNo"
                  placeholder="PAG-IBIG MID No."
                  type="text"
                  isRequired
                  defaultValue={governmentIssuedIds.pagibigNumber ? governmentIssuedIds.pagibigNumber : ''}
                  maxLength={14}
                  controller={{
                    ...register('pagibigNumber', {
                      value: governmentIssuedIds.pagibigNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, pagibigNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.pagibigNumber ? true : false}
                  errorMessage={errors.pagibigNumber?.message}
                />
              </div>
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="philhealthno"
                  placeholder="Philhealth No."
                  type="text"
                  isRequired
                  maxLength={14}
                  defaultValue={governmentIssuedIds.philhealthNumber ? governmentIssuedIds.philhealthNumber : ''}
                  controller={{
                    ...register('philhealthNumber', {
                      value: governmentIssuedIds.philhealthNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, philhealthNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.philhealthNumber ? true : false}
                  errorMessage={errors.philhealthNumber?.message}
                />
              </div>
            </div>

            <div className="xs:block gap-4 lg:flex lg:grid-cols-3">
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="sssno"
                  placeholder="SSS No."
                  type="text"
                  isRequired
                  maxLength={12}
                  defaultValue={governmentIssuedIds.sssNumber ? governmentIssuedIds.sssNumber : ''}
                  controller={{
                    ...register('sssNumber', {
                      value: governmentIssuedIds.sssNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, sssNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.sssNumber ? true : false}
                  errorMessage={errors.sssNumber?.message}
                />
                {/* {errors.sssNumber && <span className="text-xs text-red-600 ">{errors.sssNumber.message}</span>} */}
              </div>
              <div className="col-span-1 mb-7 w-full">
                <FloatingLabelInputRF
                  id="tinno"
                  placeholder="TIN No."
                  isRequired
                  type="text"
                  maxLength={15}
                  defaultValue={governmentIssuedIds.tinNumber ? governmentIssuedIds.tinNumber : ''}
                  controller={{
                    ...register('tinNumber', {
                      value: governmentIssuedIds.tinNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, tinNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.tinNumber ? true : false}
                  errorMessage={errors.tinNumber?.message}
                />
              </div>
              <div className="col-span-1 w-full">
                <FloatingLabelInputRF
                  id="agencyno"
                  placeholder="Agency Employee No."
                  isRequired
                  type="text"
                  defaultValue={governmentIssuedIds.agencyNumber ? governmentIssuedIds.agencyNumber : ''}
                  controller={{
                    ...register('agencyNumber', {
                      value: governmentIssuedIds.agencyNumber,
                      onChange: (e) => setGovernmentIssuedIds({ ...governmentIssuedIds, agencyNumber: e.target.value }),
                    }),
                  }}
                  isError={errors.agencyNumber ? true : false}
                  errorMessage={errors.agencyNumber?.message}
                />
              </div>
            </div>
          </>
        }
      />
    </>
  )
}
