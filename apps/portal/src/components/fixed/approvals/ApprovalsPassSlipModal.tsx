import { useState } from 'react';
import { useApprovalStore } from '../../../../src/store/approvals.store';

export default function ApprovalPassSlipModal() {
  const selectedPassSlip = useApprovalStore((state) => state.selectedPassSlip);
  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const onChangeType = (action: string) => {
    setAction(action);
    console.log(action);
  };

  const handleReason = (e: string) => {
    setReason(e);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
          <div className="w-full pb-2 flex gap-2 justify-start items-center">
            <span className="text-slate-500 text-xl font-medium">Date:</span>
            <div className="border-slate-300 text-slate-500 border px-4 text-lg">
              {/* {selectedPassSlip.date} */}
            </div>
          </div>
          <div className="flex gap-2">
            <label className="text-slate-500 text-xl font-medium">
              Select Nature of Business:
            </label>
            <div className="text-slate-500 rounded text-lg border-slate-300 border px-4">
              {selectedPassSlip.natureOfBusiness}
            </div>
          </div>

          <div className={'flex flex-col gap-4 '}>
            <div
              className={`${
                selectedPassSlip.natureOfBusiness === 'Official Business'
                  ? 'flex gap-2 '
                  : 'hidden'
              }`}
            >
              <label className={'text-slate-500 text-xl font-medium'}>
                Select Mode of Transportation:
              </label>
              <div
                className={
                  'text-slate-500 rounded text-lg border-slate-300 border px-4'
                }
              >
                {/* {selectedPassSlip.modeOfTransportation} */}
              </div>
            </div>

            <div className="w-full flex gap-2 justify-start items-center">
              <span className="text-slate-500 text-xl font-medium">
                Estimated Hours:
              </span>
              <div className="border-slate-300 border px-4 text-slate-500 text-lg">
                {/* {selectedPassSlip.estimatedHours} */}
              </div>
            </div>
            <label className={'text-slate-500 text-xl font-medium'}>
              Purpose/Desination:
            </label>
            <textarea
              className={
                'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
              }
              // value={selectedPassSlip.purpose}
              rows={4}
              disabled={true}
            ></textarea>
            <div className="w-full flex gap-2 justify-start items-center pt-12">
              <span className="text-slate-500 text-xl font-medium">
                Action:
              </span>
              <select
                className={`text-slate-500 w-100 h-10 rounded text-md border border-slate-200'
                  
              `}
                onChange={(e) =>
                  onChangeType(e.target.value as unknown as string)
                }
              >
                <option>Approve</option>
                <option>Disapprove</option>
              </select>
            </div>

            <textarea
              className={
                'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
              }
              placeholder="Enter Reason"
              rows={3}
              onChange={(e) =>
                handleReason(e.target.value as unknown as string)
              }
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
