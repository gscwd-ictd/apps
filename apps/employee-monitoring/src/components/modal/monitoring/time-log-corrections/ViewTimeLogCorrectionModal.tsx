/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import { TimeLogCorrection } from 'apps/employee-monitoring/src/utils/types/time-log-correction.type';
import RenderTimeLogCorrectionStatus from 'apps/employee-monitoring/src/utils/functions/RenderTimeLogCorrectionStatus';

type ViewTimeLogCorrectionModalProps = {
  rowData: TimeLogCorrection;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const toAmPm = (time: string | null) => {
  if (!time) return '-';
  const [h, m] = time.split(':').map(Number);
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Read-only details of a time log correction request: original vs corrected time logs and status. */
const ViewTimeLogCorrectionModal: FunctionComponent<ViewTimeLogCorrectionModalProps> = ({
  rowData,
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const rows: Array<[string, string | null, string | null]> = [
    ['Time In', rowData.dtrTimeIn, rowData.correctedTimeIn],
    ['Lunch Out', rowData.dtrLunchOut, rowData.correctedLunchOut],
    ['Lunch In', rowData.dtrLunchIn, rowData.correctedLunchIn],
    ['Time Out', rowData.dtrTimeOut, rowData.correctedTimeOut],
  ];

  return (
    <Modal open={modalState} setOpen={setModalState} size="md">
      <Modal.Header withCloseBtn>
        <div className="flex justify-between text-2xl font-semibold text-black">
          <span className="px-5">Time Log Correction</span>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center"
            onClick={closeModalAction}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col w-full gap-4 px-5">
          <div className="grid grid-cols-2 gap-3">
            <LabelValue
              label="Employee"
              direction="top-to-bottom"
              textSize="md"
              value={rowData.employeeFullName ?? '-'}
            />
            <LabelValue label="Employee No." direction="top-to-bottom" textSize="md" value={rowData.companyId} />
            <LabelValue label="Assignment" direction="top-to-bottom" textSize="md" value={rowData.assignment ?? '-'} />
            <LabelValue label="DTR Date" direction="top-to-bottom" textSize="md" value={rowData.dtrDate} />
            <LabelValue label="Date Filed" direction="top-to-bottom" textSize="md" value={rowData.dateFiled ?? '-'} />
            <LabelValue label="Date Acted" direction="top-to-bottom" textSize="md" value={rowData.dateActed ?? '-'} />
            <LabelValue
              label="Status"
              direction="top-to-bottom"
              textSize="md"
              value={RenderTimeLogCorrectionStatus(rowData.status)}
            />
          </div>

          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Time Log</th>
                <th className="px-3 py-2 text-left">Original (DTR)</th>
                <th className="px-3 py-2 text-left">Requested Correction</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, original, corrected]) => (
                <tr key={label} className="border-t">
                  <td className="px-3 py-2 text-gray-600">{label}</td>
                  <td className="px-3 py-2">{toAmPm(original)}</td>
                  <td className={`px-3 py-2 ${corrected !== original ? 'font-semibold text-indigo-700' : ''}`}>
                    {toAmPm(corrected)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <LabelValue label="Remarks" direction="top-to-bottom" textSize="md" value={rowData.remarks || '-'} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end w-full gap-2">
          <button
            className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded hover:bg-gray-200 transition-all"
            onClick={closeModalAction}
            type="button"
          >
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewTimeLogCorrectionModal;
