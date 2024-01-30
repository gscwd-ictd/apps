import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { govtIds } from '../../../../../utils/constants/constants';
import { useEmployeeStore } from '../../../../store/employee.store';
import { usePdsStore } from '../../../../store/pds.store';
import { GovtIssuedIdForm } from '../../../../types/data/supporting-info.type';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';
import { GovernmentIssuedIdAlert } from './GovernmentIssuedIdAlert';

export const OIGovtID = (): JSX.Element => {
  // set government issued id object, employee object state to pds context
  const governmentIssuedId = usePdsStore((state) => state.governmentIssuedId);
  const setGovernmentIssuedId = usePdsStore((state) => state.setGovernmentIssuedId);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const governmentIssuedIdOnEdit = usePdsStore((state) => state.governmentIssuedIdOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const hasPds = useEmployeeStore((state) => state.hasPds);

  // initialize government issued id use form context
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<GovtIssuedIdForm>();

  const setInitialValues = () => {
    clearErrors();
    setGovernmentIssuedId(initialPdsState.governmentIssuedId);
    setValue('govtId', initialPdsState.governmentIssuedId.issuedId);
    setValue('govtIdNo', initialPdsState.governmentIssuedId.idNumber);
    setValue('issueDate', initialPdsState.governmentIssuedId.issueDate);
    setValue('issuePlace', initialPdsState.governmentIssuedId.issuePlace);
  };

  // assign employee id on page load
  useEffect(() => {
    setGovernmentIssuedId({
      ...governmentIssuedId,
      employeeId: employee.employmentDetails.userId,
    });
  }, []);

  return (
    <>
      <Card
        title={'Government Issued ID'}
        subtitle="Only use a valid or non expired ID."
        remarks={<GovernmentIssuedIdAlert setInitialValues={setInitialValues} />}
      >
        <>
          <div className="w-full col-span-1 my-7">
            <SelectListRFFL
              id="govtId"
              selectList={govtIds}
              value={governmentIssuedId.issuedId}
              variant="light"
              isRequired
              defaultOption="Government ID"
              controller={{
                ...register('govtId', {
                  value: governmentIssuedId.idNumber,
                  onChange: (e) =>
                    setGovernmentIssuedId({
                      ...governmentIssuedId,
                      issuedId: e.target.value,
                    }),
                }),
              }}
              isError={errors.govtId ? true : false}
              errorMessage={errors.govtId?.message}
              muted={
                hasPds && governmentIssuedIdOnEdit
                  ? false
                  : hasPds && !governmentIssuedIdOnEdit
                  ? true
                  : !hasPds && false
              }
            />
          </div>

          <div className="w-full col-span-1 mb-7">
            <FloatingLabelInputRF
              id="govtIdNo"
              placeholder="ID Number"
              value={governmentIssuedId.idNumber}
              isRequired
              type="text"
              controller={{
                ...register('govtIdNo', {
                  value: governmentIssuedId.idNumber,
                  onChange: (e) =>
                    setGovernmentIssuedId({
                      ...governmentIssuedId,
                      idNumber: e.target.value,
                    }),
                }),
              }}
              isError={errors.govtIdNo ? true : false}
              errorMessage={errors.govtIdNo?.message}
              muted={
                hasPds && governmentIssuedIdOnEdit
                  ? false
                  : hasPds && !governmentIssuedIdOnEdit
                  ? true
                  : !hasPds && false
              }
            />
          </div>

          <div className="w-full col-span-1 mb-7">
            <FloatingLabelInputRF
              id="issueDate"
              value={governmentIssuedId.issueDate}
              placeholder="Issued Date"
              type="date"
              controller={{
                ...register('issueDate', {
                  value: governmentIssuedId.issueDate,
                  onChange: (e) =>
                    setGovernmentIssuedId({
                      ...governmentIssuedId,
                      issueDate: e.target.value,
                    }),
                }),
              }}
              isError={errors.issueDate ? true : false}
              errorMessage={errors.issueDate?.message}
              muted={
                hasPds && governmentIssuedIdOnEdit
                  ? false
                  : hasPds && !governmentIssuedIdOnEdit
                  ? true
                  : !hasPds && false
              }
            />
          </div>

          <div className="w-full col-span-1 mb-7">
            <FloatingLabelInputRF
              id="issuePlace"
              value={governmentIssuedId.issuePlace}
              isRequired
              placeholder="Issued Place"
              type="text"
              controller={{
                ...register('issuePlace', {
                  value: governmentIssuedId.issuePlace,
                  onChange: (e) =>
                    setGovernmentIssuedId({
                      ...governmentIssuedId,
                      issuePlace: e.target.value,
                    }),
                }),
              }}
              isError={errors.issuePlace ? true : false}
              errorMessage={errors.issuePlace?.message}
              muted={
                hasPds && governmentIssuedIdOnEdit
                  ? false
                  : hasPds && !governmentIssuedIdOnEdit
                  ? true
                  : !hasPds && false
              }
            />
          </div>
        </>
      </Card>
    </>
  );
};
