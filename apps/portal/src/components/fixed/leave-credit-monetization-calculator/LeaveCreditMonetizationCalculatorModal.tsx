/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect, useState } from 'react';
import { useLeaveMonetizationCalculatorStore } from 'apps/portal/src/store/leave-monetization-calculator.store';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  vacationLeave: number;
  forcedLeave: number;
  sickLeave: number;
  sgAmount: number;
  sgIncrement: string;
  estimatedMaxAmount: number;
  monetizationConstant: number;
};

export const LeaveCreditMonetizationCalculatorModal = ({
  modalState,
  setModalState,
  closeModalAction,
  vacationLeave,
  forcedLeave,
  sickLeave,
  sgAmount,
  sgIncrement,
  estimatedMaxAmount,
  monetizationConstant = 0,
}: ModalProps) => {
  const { windowWidth } = UseWindowDimensions();

  const { leaveCalculatorModalIsOpen } = useLeaveMonetizationCalculatorStore((state) => ({
    leaveCalculatorModalIsOpen: state.leaveCalculatorModalIsOpen,
  }));

  const [leaveCredits, setLeaveCredits] = useState<number>(Number(vacationLeave) + Number(sickLeave));
  const [leaveCreditsToCompute, setLeaveCreditsToCompute] = useState<number>(null);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(estimatedMaxAmount);
  const [salaryGrade, setSalaryGrade] = useState<number>(0);

  const computeEstimateAmount = (credits: number) => {
    if (credits) {
      if (credits <= leaveCredits) {
        setLeaveCreditsToCompute(credits);
        // setEstimatedAmount(Math.round(salaryGrade * credits * monetizationConstant));
        setEstimatedAmount(Math.round(Number(monetizationConstant * salaryGrade * credits) * 100) / 100);
      } else {
        setLeaveCreditsToCompute(leaveCredits);
        // setEstimatedAmount(salaryGrade * leaveCredits * monetizationConstant);
        setEstimatedAmount(Math.round(Number(monetizationConstant * salaryGrade * leaveCredits) * 100) / 100);
      }
    } else {
      setLeaveCreditsToCompute(null);
      // setEstimatedAmount(salaryGrade * 0 * monetizationConstant);
      setEstimatedAmount(Math.round(Number(monetizationConstant * salaryGrade * 0) * 100) / 100);
    }
  };

  const resetComputation = () => {
    setLeaveCredits(Number(vacationLeave) + Number(sickLeave));
    setLeaveCreditsToCompute(Number(vacationLeave) + Number(sickLeave));
    setSalaryGrade(sgAmount);
    // setEstimatedAmount(salaryGrade * leaveCredits * monetizationConstant);
    setEstimatedAmount(Math.round(Number(monetizationConstant * salaryGrade * leaveCredits) * 100) / 100);
  };

  useEffect(() => {
    setLeaveCredits(Number(vacationLeave) + Number(sickLeave));
    setLeaveCreditsToCompute(Number(vacationLeave) + Number(sickLeave));
    setSalaryGrade(sgAmount);
  }, [leaveCalculatorModalIsOpen]);

  useEffect(() => {
    setEstimatedAmount(estimatedMaxAmount);
  }, [estimatedMaxAmount, leaveCalculatorModalIsOpen]);

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Leave Credit Monetization Calculator</span>
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
          {!vacationLeave && !sickLeave && !sgAmount && !sgIncrement ? (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                /> */}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 px-4 rounded">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-col justify-center items-center w-full -mt-4 pb-4">
                      <label className="text-slate-500 text-xl font-medium">
                        {`Computation: Salary X Leave Credits X ${
                          monetizationConstant === 0 ? '-- -- --' : monetizationConstant
                        }`}
                      </label>
                      <label className="text-slate-500 text-sm font-medium">
                        1. The maximum total leave credits is the combination of SL and VL
                      </label>
                      <label className="text-slate-500 text-sm font-medium">
                        2. The default of computed leave credits is maximum total leave
                      </label>
                      <label className="text-slate-500 text-sm font-medium">
                        3. The constant 0.048….. is based on CSC MC No. 02, s.. 2016
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium">Salary Grade:</label>

                      <div className="w-full md:w-44">
                        <input
                          disabled
                          type="text"
                          className="border-slate-100 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="SG"
                          defaultValue={`SG ${sgIncrement} : P${sgAmount ? sgAmount.toLocaleString() : 0}`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium">Vacation Leave Credits:</label>

                      <div className="w-full md:w-44">
                        <input
                          type="number"
                          className="border-slate-100 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="VL and Forced Leave Credits"
                          value={Number(vacationLeave).toFixed(3)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium">Sick Leave Credits:</label>

                      <div className="w-full md:w-44">
                        <input
                          type="number"
                          className="border-slate-100 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="Sick Leave Credits"
                          value={Number(sickLeave).toFixed(3)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium">Total Leave Credits:</label>

                      <div className="w-full md:w-44">
                        <input
                          type="number"
                          className="border-slate-100 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="Total Leave Credit"
                          value={(Number(vacationLeave) + Number(sickLeave)).toFixed(3)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium">Leave Credits To Compute:</label>

                      <div className="w-full md:w-44">
                        <input
                          type="number"
                          className="border-blue-400 border-2 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="Enter Leave Credit"
                          onChange={(e: any) => computeEstimateAmount(e.target.value)}
                          value={
                            leaveCreditsToCompute % 1 != 0
                              ? Number(leaveCreditsToCompute).toFixed(3)
                              : leaveCreditsToCompute
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium">Estimated Monetization:</label>

                      <div className="w-full md:w-44">
                        <input
                          disabled
                          type="text"
                          id="monetization"
                          className="border-slate-100 text-slate-500 h-12 text-md w-full rounded"
                          placeholder="Estimated Monetization"
                          value={Number(estimatedAmount).toFixed(3).toLocaleString()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 text-md px-4">
            <div className="flex justify-end gap-2 text-md">
              <Button variant={'primary'} size={'md'} loading={false} type="submit" onClick={resetComputation}>
                Reset
              </Button>
              <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveCreditMonetizationCalculatorModal;
