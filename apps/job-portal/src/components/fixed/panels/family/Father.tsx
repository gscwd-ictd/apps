import { Card } from '../../../modular/cards/Card'
import { useFormContext } from 'react-hook-form'
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF'
import { ParentForm } from '../../../../types/data/family.type'
import { usePdsStore } from '../../../../store/pds.store'

export const FatherInfo = (): JSX.Element => {
  // set parents state from pds store
  const parents = usePdsStore((state) => state.parents)
  const setParents = usePdsStore((state) => state.setParents)

  // initialize react hook forms
  const {
    register,
    formState: { errors },
  } = useFormContext<ParentForm>()

  return (
    <>
      <Card
        title="Father's Information"
        subtitle="Write your father's information. Write 'N/A' if not applicable."
        children={
          <>
            <div className="gap-4 xs:block mt-7 lg:flex lg:grid-cols-2">
              <div className="w-full col-span-1 mb-7">
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
                />
              </div>
              <div className="w-full col-span-1 mb-7">
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
                />
              </div>
            </div>

            <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
              <div className="w-full col-span-1 mb-7">
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
                />
              </div>
              <div className="w-full col-span-1 ">
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
                />
              </div>
            </div>
          </>
        }
      />
    </>
  )
}
