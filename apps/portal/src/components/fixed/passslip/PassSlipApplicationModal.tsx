import { usePassSlipStore } from '../../../../src/store/passslip.store';

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useEffect, useState } from 'react';

import { withSession } from '../../../utils/helpers/session';

// export default function Messages({ pendingAcknowledgements, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function PassSlipApplicationModal() {
  const setNatureOfBusiness = usePassSlipStore(
    (state) => state.setNatureOfBusiness
  );

  const setEstimateHours = usePassSlipStore((state) => state.setEstimateHours);

  const setPurposeDestination = usePassSlipStore(
    (state) => state.setPurposeDestination
  );

  const setObTransportation = usePassSlipStore(
    (state) => state.setObTransportation
  );

  const handleNatureOfBusiness = (e: string) => {
    if (e !== 'Official Business') {
      setObTransportation(null);
    }
    setNatureOfBusiness(e);
    setPurposeDestination('');
  };

  const handlePurposeDetails = (e: string) => {
    setPurposeDestination(e);
  };

  const handleHours = (e: number) => {
    if (natureOfBusiness === 'Half Day' || natureOfBusiness === 'Undertime') {
      setEstimateHours(null);
    } else {
      setEstimateHours(e);
    }
  };

  const dateOfApplication = usePassSlipStore(
    (state) => state.dateOfApplication
  );
  const natureOfBusiness = usePassSlipStore((state) => state.natureOfBusiness);
  const purposeDestination = usePassSlipStore(
    (state) => state.purposeDestination
  );

  useEffect(() => {
    if (natureOfBusiness === 'Half Day' || natureOfBusiness === 'Undertime') {
      setEstimateHours(0);
    }
  }, [natureOfBusiness, setEstimateHours]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          <div className="w-full flex gap-2 justify-start items-center">
            <span className="text-slate-500 text-lg font-medium">Date:</span>
            <div className="text-slate-500 text-lg">{dateOfApplication}</div>
          </div>

          <div className="flex gap-2 justify-between items-center">
            <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
              Select Nature of Business:
            </label>

            <div className="w-96">
              <select
                value={natureOfBusiness}
                className="text-slate-500 h-12 w-96 rounded text-lg border-slate-300"
                onChange={(e) =>
                  handleNatureOfBusiness(e.target.value as unknown as string)
                }
              >
                <option value="" disabled>
                  Select Nature of Business
                </option>
                <option value="Personal Business">Personal Business</option>
                <option value="Half Day">Half Day</option>
                <option value="Undertime">Undertime</option>
                <option value="Official Business">Official Business</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <label
              className={`${
                natureOfBusiness === 'Official Business'
                  ? 'text-slate-500 text-lg whitespace-nowrap font-medium'
                  : 'hidden'
              }`}
            >
              Select Mode of Transportation:
            </label>
            <div className="w-96">
              <select
                defaultValue="transportation"
                className={`${
                  natureOfBusiness === 'Official Business'
                    ? 'text-slate-500 h-12 w-96 rounded text-lg border-slate-300'
                    : 'hidden'
                }`}
                onChange={(e) =>
                  setObTransportation(e.target.value as unknown as string)
                }
              >
                <option value="transportation" disabled>
                  Select Mode of Transportation
                </option>
                <option value="Office Vehicle">Office Vehicle</option>
                <option value="Private/Personal Vehicle">
                  Private/Personal Vehicle
                </option>
                <option value="Public Vehicle">Public Vehicle</option>
              </select>
            </div>
          </div>
          <div
            className={`${
              natureOfBusiness ? ' flex flex-col gap-2' : 'hidden'
            }`}
          >
            <div className="flex gap-2 justify-between items-center">
              <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                Estimated Hours:
              </label>
              <div className="w-96">
                <input
                  type="number"
                  defaultValue={
                    natureOfBusiness === 'Half Day' ||
                    natureOfBusiness === 'Undertime'
                      ? 0
                      : null
                  }
                  disabled={
                    natureOfBusiness === 'Half Day' ||
                    natureOfBusiness === 'Undertime'
                      ? true
                      : false
                  }
                  className="border-slate-300 text-slate-500 h-10 w-96"
                  onChange={(e) =>
                    handleHours(e.target.value as unknown as number)
                  }
                ></input>
              </div>
            </div>
          </div>
          <div
            className={`${
              natureOfBusiness ? ' flex flex-col gap-2' : 'hidden'
            }`}
          >
            <label
              className={`${
                natureOfBusiness
                  ? 'text-slate-500 text-lg font-medium'
                  : 'hidden'
              }`}
            >
              Purpose/Desination:
            </label>
            <textarea
              onChange={(e) =>
                handlePurposeDetails(e.target.value as unknown as string)
              }
              className={`${
                natureOfBusiness
                  ? 'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
                  : 'hidden'
              }`}
              value={purposeDestination}
              rows={3}
              placeholder={`Enter Purpose of Pass Slip`}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
//   const { data } = await axios.get(`http://192.168.137.249:4003/api/vacant-position-postings/psb/schedules/${context.query.id}/unacknowledged`);
//   return { props: { pendingAcknowledgements: data, id: context.query.id } };
// }
// )
