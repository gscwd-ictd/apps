/* eslint-disable @nx/enforce-module-boundaries */
import { Button, ListDef, Modal, Select } from '@gscwd-apps/oneui';
import { HiPrinter, HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveLedgerTable } from '../table/LeaveLedgerTable';
import LeaveLedgerPdfModal from './LeaveLedgerPdfModal';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { useEffect } from 'react';
import { format } from 'date-fns';

type LeaveLedgerModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeaveLedgerModal = ({ modalState, setModalState, closeModalAction }: LeaveLedgerModalProps) => {
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { selectedYear, setSelectedYear, leaveLedgerPdfModalIsOpen, setLeaveLedgerPdfModalIsOpen } =
    useLeaveLedgerStore((state) => ({
      selectedYear: state.selectedYear,
      setSelectedYear: state.setSelectedYear,
      leaveLedgerPdfModalIsOpen: state.leaveLedgerPdfModalIsOpen,
      setLeaveLedgerPdfModalIsOpen: state.setLeaveLedgerPdfModalIsOpen,
    }));

  // cancel action for Leave Application Modal
  const closeLeaveLedgerPdfModal = async () => {
    setLeaveLedgerPdfModalIsOpen(false);
  };

  type Year = { year: string };
  const yearNow = format(new Date(), 'yyyy');

  const years = [{ year: `${yearNow}` }, { year: `${Number(yearNow) - 1}` }] as Year[];

  //year select
  const yearList: ListDef<Year> = {
    key: 'year',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''} pl-4 cursor-pointer`}>
        {info.year}
      </div>
    ),
  };

  const onChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    setSelectedYear(format(new Date(), 'yyyy'));
  }, []);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <LeaveLedgerPdfModal
        modalState={leaveLedgerPdfModalIsOpen}
        setModalState={setLeaveLedgerPdfModalIsOpen}
        employeeData={employeeDetails}
        closeModalAction={closeLeaveLedgerPdfModal}
      />

      <Modal size={`${windowWidth > 1024 ? 'xl' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Leave Ledger</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body className="overflow-visible">
          <div className="flex flex-col px-4">
            <div className="flex items-center justify-end gap-2 pb-2">
              <div className="overflow-visible relative">
                <Select
                  className="w-36 md:w-28"
                  data={years}
                  initial={years[0]}
                  listDef={yearList}
                  onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
                />
              </div>

              <Button onClick={(e) => setLeaveLedgerPdfModalIsOpen(true)} size={`md`}>
                <div className="flex items-center w-full gap-2">
                  <HiPrinter /> Print Ledger
                </div>
              </Button>
            </div>
            <LeaveLedgerTable employeeData={employeeDetails} selectedYear={selectedYear} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveLedgerModal;
