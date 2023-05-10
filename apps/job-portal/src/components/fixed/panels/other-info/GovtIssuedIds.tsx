/* eslint-disable @nx/enforce-module-boundaries */
import { GovtIssuedIdForm } from 'apps/job-portal/utils/types/data/supporting-info.type';
import { useFormContext } from 'react-hook-form';
import { govtIds } from '../../../../../utils/constants/constants';
import { useApplicantStore } from '../../../../store/applicant.store';
import { usePdsStore } from '../../../../store/pds.store';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';

export const OIGovtID = (): JSX.Element => {
  // set government issued id object, employee object state to pds context
  const governmentIssuedId = usePdsStore((state) => state.governmentIssuedId);
  const setGovernmentIssuedId = usePdsStore(
    (state) => state.setGovernmentIssuedId
  );
  const applicant = useApplicantStore((state) => state.applicant);

  // initialize government issued id use form context
  const {
    register,
    formState: { errors },
  } = useFormContext<GovtIssuedIdForm>();

  return (
    <>
      <Card title={'Government Issued ID'} subtitle="">
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
            />
          </div>

          <div className="w-full col-span-1 mb-7">
            <FloatingLabelInputRF
              id="issueDate"
              value={governmentIssuedId.issueDate}
              isRequired
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
            />
          </div>
        </>
      </Card>
    </>
  );
};
