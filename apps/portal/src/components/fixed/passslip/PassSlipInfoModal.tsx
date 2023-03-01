import { usePassSlipStore } from '../../../store/passslip.store';

// export default function Messages({ pendingAcknowledgements, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function PassSlipInfoModal() {
  const selectedPassSlip = usePassSlipStore((state) => state.selectedPassSlip);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
          <div className="w-full pb-2 flex gap-2 justify-start items-center">
            <span className="text-slate-500 text-xl font-medium">Date:</span>
            <div className="border-slate-300 text-slate-500 border px-4 text-lg">
              {selectedPassSlip.dateOfApplication}
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
                {selectedPassSlip.obTransportation}
              </div>
            </div>

            <div className="w-full flex gap-2 justify-start items-center">
              <span className="text-slate-500 text-xl font-medium">
                Estimated Hours:
              </span>
              <div className="border-slate-300 border px-4 text-slate-500 text-lg">
                {selectedPassSlip.estimateHours}
              </div>
            </div>
            <label className={'text-slate-500 text-xl font-medium'}>
              Purpose/Desination:
            </label>
            <textarea
              className={
                'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
              }
              value={selectedPassSlip.purposeDestination}
              rows={5}
              disabled={true}
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
