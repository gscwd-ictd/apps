import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useEffect, useState } from 'react';
import { HiMail } from 'react-icons/hi';
import { withSession } from '../../../utils/helpers/session';

// export default function Messages({ pendingAcknowledgements, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function PassSlipApplicationModal() {
  const [natureOfBusiness, setNatureOfBusiness] = useState<string>('');
  const [transportation, setTransportation] = useState<string>();
  const [purpose, setPurpose] = useState<string>();
  const [natureOfBusinessName, setNatureOfBusinessName] = useState<string>();

  // useEffect(() => {
  //   console.log(natureOfBusiness);
  // }, [natureOfBusiness]);

  const handleNatureOfBusiness = (e: string) => {
    setNatureOfBusiness(e);
    setPurpose('');
  };

  const handlePurposeDetails = (e: string) => {
    setPurpose(e);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
          <div className="w-full pb-4 flex gap-2 justify-start items-center">
            <span className="text-slate-500 text-xl font-medium">Date</span>
            <input
              type="date"
              className="border-slate-300 text-slate-500"
            ></input>
          </div>
          <label className="pt-2 text-slate-500 text-xl font-medium">
            Select Nature of Business:
          </label>
          <div>
            <select
              value={natureOfBusiness}
              className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
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
            <div
              className={`${
                natureOfBusinessName
                  ? 'flex flex-col gap-1 w-full bg-slate-100 text-sm p-2 mt-1'
                  : 'hidden'
              }`}
            >
              <span className="font-bold">{natureOfBusinessName}</span>
            </div>
          </div>
          <div
            className={`${
              natureOfBusiness ? 'pt-2 flex flex-col gap-4 ' : 'hidden'
            }`}
          >
            <label
              className={`${
                natureOfBusiness === 'Official Business'
                  ? '-mb-2 text-slate-500 text-xl font-medium'
                  : 'hidden'
              }`}
            >
              Select Mode of Transportation:
            </label>
            <select
              defaultValue="transportation"
              className={`${
                natureOfBusiness === 'Official Business'
                  ? 'text-slate-500 w-full h-16 rounded text-lg border-slate-300'
                  : 'hidden'
              }`}
              onChange={(e) =>
                setTransportation(e.target.value as unknown as string)
              }
            >
              <option value="transportation" disabled>
                Select Mode of Transportation
              </option>
              <option value="office">Office Vehicle</option>
              <option value="private">Private/Personal Vehicle</option>
              <option value="public">Public Vehicle</option>
            </select>

            <div className="w-full flex gap-2 justify-start items-center">
              <span className="text-slate-500 text-xl font-medium">
                Estimated Hours:
              </span>
              <input
                type="number"
                className="border-slate-300 text-slate-500"
              ></input>
            </div>
            <label
              className={`${
                natureOfBusiness
                  ? 'text-slate-500 text-xl font-medium'
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
              value={purpose}
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
