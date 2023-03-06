import { usePassSlipStore } from '../../../store/passslip.store';

// export default function Messages({ pendingAcknowledgements, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function PassSlipInfoModal() {
  const selectedPassSlip = usePassSlipStore((state) => state.selectedPassSlip);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          <div className="w-full flex gap-2 justify-start items-center">
            <span className="text-slate-500 text-lg font-medium">Date:</span>
            <div className="text-slate-500 text-lg">
              {selectedPassSlip.dateOfApplication}
            </div>
          </div>

          <div className="flex gap-2 justify-between items-center">
            <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
              Nature of Business:
            </label>

            <div className="w-96">
              <label className="text-slate-500 h-12 w-96  text-lg ">
                {selectedPassSlip.natureOfBusiness}
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <label
              className={`${
                selectedPassSlip.natureOfBusiness === 'Official Business'
                  ? 'text-slate-500 text-lg whitespace-nowrap font-medium'
                  : 'hidden'
              }`}
            >
              Mode of Transportation:
            </label>
            <div className="w-96">
              <label className="text-slate-500 h-12 w-96  text-lg ">
                {selectedPassSlip.obTransportation}
              </label>
            </div>
          </div>
          <div
            className={` flex flex-col gap-2
            `}
          >
            <div className="flex gap-2 justify-between items-center">
              <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                Estimated Hours:
              </label>
              <div className="w-96">
                <label className="text-slate-500 h-12 w-96  text-lg ">
                  {selectedPassSlip.estimateHours}
                </label>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col gap-2
            `}
          >
            <label className="text-slate-500 text-lg font-medium">
              Purpose/Desination:
            </label>
            <textarea
              className={
                'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
              }
              value={selectedPassSlip.purposeDestination}
              rows={4}
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
