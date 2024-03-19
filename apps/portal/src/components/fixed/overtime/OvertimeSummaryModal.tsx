/* eslint-disable @nx/enforce-module-boundaries */
import { HiX } from 'react-icons/hi';
import { Button, Modal } from '@gscwd-apps/oneui';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { format } from 'date-fns';
import OvertimeSummaryReportPdfModal from './OvertimeSummaryReportPdfModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: any;
};

const monthList: Array<SelectOption> = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const yearList: Array<SelectOption> = [
  { label: format(new Date(), 'yyyy'), value: format(new Date(), 'yyyy') },
  { label: `${Number(format(new Date(), 'yyyy')) - 1}`, value: Number(format(new Date(), 'yyyy')) - 1 },
];

const periodList: Array<SelectOption> = [
  { label: 'First Half', value: 'first' },
  { label: 'Second Half', value: 'second' },
];

const employeeTypeList: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Casual', value: 'casual' },
  { label: 'Job Order', value: 'job order' },
];

export const OvertimeSummaryModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  //zustand initialization to access Leave store
  const {
    selectedMonth,
    selectedPeriod,
    selectedYear,
    selectedEmployeeType,
    setSelectedMonth,
    setSelectedYear,
    setSelectedPeriod,
    setSelectedEmployeeType,
    pdfOvertimeSummaryModalIsOpen,
    setPdfOvertimeSummaryModalIsOpen,
  } = useOvertimeStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedPeriod: state.selectedPeriod,
    selectedYear: state.selectedYear,
    selectedEmployeeType: state.selectedEmployeeType,
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
    setSelectedPeriod: state.setSelectedPeriod,
    setSelectedEmployeeType: state.setSelectedEmployeeType,
    pdfOvertimeSummaryModalIsOpen: state.pdfOvertimeSummaryModalIsOpen,
    setPdfOvertimeSummaryModalIsOpen: state.setPdfOvertimeSummaryModalIsOpen,
  }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const onChangeMonth = (month: number) => {
    setSelectedMonth(month);
  };

  const onChangeYear = (year: number) => {
    setSelectedYear(year);
  };

  const onChangePeriod = (period: string) => {
    setSelectedPeriod(period);
  };

  const onChangeEmployeeType = (type: string) => {
    setSelectedEmployeeType(type);
  };

  const closePdfOvertimeSummaryModal = async () => {
    setPdfOvertimeSummaryModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Summary</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">Employee Type:</label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => onChangeEmployeeType(e.target.value)}
                    defaultValue={''}
                  >
                    <option value={''} disabled>
                      Selected Type
                    </option>
                    {employeeTypeList.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx} disabled={item.label === 'Job Order' ? true : false}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">Month:</label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => onChangeMonth(e.target.value as unknown as number)}
                    defaultValue={''}
                  >
                    <option value={''} disabled>
                      Select Month
                    </option>
                    {monthList.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">Year:</label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => onChangeYear(e.target.value as unknown as number)}
                    defaultValue={''}
                  >
                    <option value={''} disabled>
                      Select Year
                    </option>
                    {yearList.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">Period:</label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => onChangePeriod(e.target.value)}
                    defaultValue={''}
                  >
                    <option value={''} disabled>
                      Select Period
                    </option>
                    {periodList.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <OvertimeSummaryReportPdfModal
            modalState={pdfOvertimeSummaryModalIsOpen}
            setModalState={setPdfOvertimeSummaryModalIsOpen}
            closeModalAction={closePdfOvertimeSummaryModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                disabled={selectedMonth && selectedPeriod && selectedYear && selectedEmployeeType ? false : true}
                variant={'primary'}
                size={'md'}
                loading={false}
                type="submit"
                onClick={(e) => setPdfOvertimeSummaryModalIsOpen(true)}
              >
                Generate Summary
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
