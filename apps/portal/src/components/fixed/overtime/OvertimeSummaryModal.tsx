/* eslint-disable @nx/enforce-module-boundaries */
import { HiX } from 'react-icons/hi';
import { Button, Modal } from '@gscwd-apps/oneui';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { format } from 'date-fns';
import OvertimeSummaryReportModal from './OvertimeSummaryReportModal';
import { useEffect, useState } from 'react';
import OvertimeAuthorizationAccomplishmentModal from './OvertimeAuthorizationAccomplishmentModal';
import { MySelectList } from '../../modular/inputs/SelectList';
import { NightDifferentialReportModal } from './NightDifferentialReportModal';

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
  { label: 'Permanent', value: 'permanent' },
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
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen,
    setPdfOvertimeAuthorizationAccomplishmentModalIsOpen,
    nightDiffEmployees,
    mutatedNightDiffEmployees,
    setMutatedNightDiffEmployees,
    pdfNightDifferentialModalIsOpen,
    setPdfNightDifferentialModalIsOpen,
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
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen: state.pdfOvertimeAuthorizationAccomplishmentModalIsOpen,
    setPdfOvertimeAuthorizationAccomplishmentModalIsOpen: state.setPdfOvertimeAuthorizationAccomplishmentModalIsOpen,
    nightDiffEmployees: state.nightDiffEmployees,
    mutatedNightDiffEmployees: state.mutatedNightDiffEmployees,
    setMutatedNightDiffEmployees: state.setMutatedNightDiffEmployees,
    pdfNightDifferentialModalIsOpen: state.pdfNightDifferentialModalIsOpen,
    setPdfNightDifferentialModalIsOpen: state.setPdfNightDifferentialModalIsOpen,
  }));

  const [summaryType, setSummaryType] = useState<string>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);

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

  const closePdfOvertimeSummaryModal = () => {
    setPdfOvertimeSummaryModalIsOpen(false);
    setPdfOvertimeAuthorizationAccomplishmentModalIsOpen(false);
    setPdfNightDifferentialModalIsOpen(false);
  };

  const handleOvertimeModal = () => {
    if (summaryType === 'overtimeAuthorizationAccomplishment') {
      setPdfOvertimeAuthorizationAccomplishmentModalIsOpen(true);
    } else if (summaryType === 'nightShiftDifferentialPay') {
      setPdfNightDifferentialModalIsOpen(true);
    } else {
      setPdfOvertimeSummaryModalIsOpen(true);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  useEffect(() => {
    setSummaryType(null);
    setSelectedYear(Number(format(new Date(), 'yyyy')));
    setSelectedEmployees([]);
  }, [modalState]);

  useEffect(() => {
    let mutatedOptions: Array<SelectOption> = [];
    nightDiffEmployees.map((item) => {
      mutatedOptions.push({ label: item.employeeFullName, value: item.employeeId });
    });
    // mutatedOptions.sort((a, b) => a.label.localeCompare(b.label));
    // set local state
    // setSelectedEmployees(mutatedOptions);
    //update to zustand
    setMutatedNightDiffEmployees(mutatedOptions);
  }, [nightDiffEmployees]);

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Report Summary</span>
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
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                  Summary Type: <span className="text-red-600">*</span>
                </label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => setSummaryType(e.target.value)}
                    defaultValue={''}
                  >
                    <option value={''} disabled>
                      Selected Type
                    </option>
                    <option value={'overtimeSummary'}>Overtime Summary</option>
                    <option value={'overtimeAuthorizationAccomplishment'}>Accomplishment Summary</option>
                    <option value={'nightShiftDifferentialPay'}>Night Shift Differential Pay</option>
                  </select>
                </div>
              </div>

              {summaryType === 'nightShiftDifferentialPay' ? (
                <div className="flex flex-col gap-1 md:pt-3">
                  <label className="text-slate-500 text-md font-medium">
                    Employees:
                    <span className="text-red-600">*</span>
                  </label>

                  <MySelectList
                    withSearchBar={true}
                    id="employees"
                    label=""
                    multiple
                    options={mutatedNightDiffEmployees}
                    onChange={(o) => setSelectedEmployees(o)}
                    value={selectedEmployees}
                  />
                </div>
              ) : null}

              {summaryType !== 'nightShiftDifferentialPay' ? (
                <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                    Employee Type: <span className="text-red-600">*</span>
                  </label>
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
                        <option value={item.value} key={idx}>
                          {/* <option value={item.value} key={idx} disabled={item.label === 'Job Order' ? true : false}> */}
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                  Month: <span className="text-red-600">*</span>
                </label>
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
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                  Year: <span className="text-red-600">*</span>
                </label>
                <div className="w-full md:w-80">
                  <select
                    className="text-slate-500 h-12 w-full md:w-80 rounded text-md border-slate-300"
                    required
                    onChange={(e) => onChangeYear(e.target.value as unknown as number)}
                    defaultValue={''}
                  >
                    {/* <option value={''} disabled>
                      Select Year
                    </option> */}
                    {yearList.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                  Period: <span className="text-red-600">*</span>
                </label>
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
          <OvertimeSummaryReportModal
            modalState={pdfOvertimeSummaryModalIsOpen}
            setModalState={setPdfOvertimeSummaryModalIsOpen}
            closeModalAction={closePdfOvertimeSummaryModal}
          />

          {/* Overtime Authorization-Accomplishment Summary Modal */}
          <OvertimeAuthorizationAccomplishmentModal
            modalState={pdfOvertimeAuthorizationAccomplishmentModalIsOpen}
            setModalState={setPdfOvertimeAuthorizationAccomplishmentModalIsOpen}
            closeModalAction={closePdfOvertimeSummaryModal}
          />

          {/* Overtime Authorization-Accomplishment Summary Modal */}
          <NightDifferentialReportModal
            modalState={pdfNightDifferentialModalIsOpen}
            selectedEmployees={selectedEmployees}
            setModalState={setPdfNightDifferentialModalIsOpen}
            closeModalAction={closePdfOvertimeSummaryModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                disabled={
                  summaryType &&
                  summaryType !== 'nightShiftDifferentialPay' &&
                  selectedMonth &&
                  selectedPeriod &&
                  selectedYear &&
                  selectedEmployeeType
                    ? false
                    : summaryType &&
                      summaryType == 'nightShiftDifferentialPay' &&
                      selectedMonth &&
                      selectedPeriod &&
                      selectedYear
                    ? false
                    : true
                }
                variant={'primary'}
                size={'md'}
                loading={false}
                type="submit"
                onClick={(e) => handleOvertimeModal()}
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
