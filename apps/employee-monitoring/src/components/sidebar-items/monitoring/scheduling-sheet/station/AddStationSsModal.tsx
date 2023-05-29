import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import SelectSchedSsModal from '../field/SelectFieldSchedSsModal';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import SelectStationSchedSsModal from './SelectStationSchedSsModal';
import RadioGroup from 'apps/employee-monitoring/src/components/radio/RadioGroup';
import { RadioButtonRF } from 'apps/employee-monitoring/src/components/radio/RadioButtonRF';

type AddStationGsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddStationSsModal: FunctionComponent<AddStationGsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const [selectGroupModalIsOpen, setSelectGroupModalIsOpen] =
    useState<boolean>(false);
  // open select group modal
  const openSelectGroupModal = () => setSelectGroupModalIsOpen(true);

  // close select group modal
  const closeSelectGroupModal = () => {
    setSelectGroupModalIsOpen(false);
  };

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsopen] =
    useState<boolean>(false);

  // open select schedule modal
  const openSelectScheduleModal = () => setSelectScheduleModalIsopen(true);

  // close select schedule modal
  const closeSelectScheduleModal = () => {
    setSelectScheduleModalIsopen(false);
  };

  // schedule sheet store
  const {
    schedule,
    selectedScheduleId,
    setSelectedScheduleId,
    getScheduleById,
    getScheduleByIdFail,
    getScheduleByIdSuccess,
    loadingSchedule,
  } = useScheduleSheetStore((state) => ({
    schedule: state.schedule,
    selectedScheduleId: state.selectedScheduleId,
    setSelectedScheduleId: state.setSelectedScheduleId,
    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,
    loadingSchedule: state.loading.loadingSchedule,
  }));

  // use SWR
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(
    !isEmpty(selectedScheduleId) ? `/schedules/${selectedScheduleId}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // set loading to true
  useEffect(() => {
    getScheduleById();
  }, [selectedScheduleId]);

  // set the schedule
  useEffect(() => {
    // success
    if (!isEmpty(swrSchedule)) getScheduleByIdSuccess(swrSchedule.data);

    // fail
    if (!isEmpty(swrScheduleError))
      getScheduleByIdFail(swrScheduleError.message);
  }, [swrSchedule, swrScheduleError]);

  // this portion is only for testing... please delete after
  useEffect(() => {
    // setSelectedScheduleId('b0235625-0ffc-4fb5-86ea-43a41b1d6a28');
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="text-2xl font-medium">Add Station Scheduling Sheet</h1>
        </Modal.Header>
        <Modal.Body>
          <>
            <Modal
              open={selectGroupModalIsOpen}
              setOpen={setSelectGroupModalIsOpen}
            >
              <Modal.Header>
                <h1 className="text-2xl font-medium">Select one (1) group</h1>
              </Modal.Header>
              <Modal.Body>
                <select>
                  <option>test</option>
                </select>
              </Modal.Body>
              <Modal.Footer>
                <div className="justify-end w-full">
                  <Button variant="info" onClick={closeSelectGroupModal}>
                    Cancel
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            <SelectStationSchedSsModal
              modalState={selectScheduleModalIsOpen}
              setModalState={setSelectScheduleModalIsopen}
              closeModalAction={closeSelectScheduleModal}
            />
            <form id="addStationSsForm">
              <div className="">
                <form id="addStationGsModal">
                  <div className="flex w-full grid-cols-3 gap-2 mb-6 ">
                    {/* Effectivity */}
                    <section className="p-2 bg-gray-200 border rounded">
                      <p className="flex items-center justify-center w-full font-semibold">
                        Effectivity
                      </p>
                      <hr className="dotted" />
                      <div className="grid items-end grid-cols-2 gap-2 border">
                        <LabelInput
                          id="gsStationStartDate"
                          name="dateFrom"
                          type="date"
                          label="Start Date"
                        />
                        <LabelInput
                          id="gsStationEndDate"
                          name="dateTo"
                          type="date"
                          label="End Date"
                        />
                      </div>
                      <p className="flex items-center justify-center w-full font-semibold">
                        Type
                      </p>
                      <RadioGroup
                        groupName="schedType"
                        className="w-full border-0"
                        isFlex={true}
                        // onChange={offRelThirdHandler}
                      >
                        <RadioButtonRF
                          id="scheduleSheetType"
                          label="Individual"
                          value={0}
                        />

                        <RadioButtonRF
                          id="scheduleSheetType"
                          label="Group"
                          value={1}
                        />
                      </RadioGroup>
                      {/* <input type="radio">Individual</input>
                      <input type="radio">Group</input> */}
                    </section>

                    {/* Group */}
                    <section className="p-2 bg-gray-200 border rounded">
                      <p className="flex items-center justify-center w-full font-semibold">
                        Station Schedule
                      </p>
                      <div className="flex flex-col w-full gap-2">
                        {swrScheduleIsLoading ? (
                          <LoadingSpinner size="lg" />
                        ) : (
                          <>
                            <LabelInput
                              id="scheduleName"
                              label="Name"
                              value={schedule.name ?? '--'}
                              disabled
                            />
                            <div className="flex items-end w-full gap-2 border">
                              <LabelInput
                                id="scheduleTimeIn"
                                label="Time in"
                                value={
                                  schedule.timeIn
                                    ? formatTime(schedule.timeIn)
                                    : '-- : --'
                                }
                                disabled
                              />

                              <LabelInput
                                id="scheduleTimeOut"
                                label="Time out"
                                value={
                                  schedule.timeOut
                                    ? formatTime(schedule.timeOut)
                                    : '-- : --'
                                }
                                disabled
                              />
                            </div>

                            {/* <div className="flex items-end w-full gap-2 border">
                              <LabelInput
                                id="scheduleLunchIn"
                                label="Lunch in"
                                value={
                                  schedule.lunchIn
                                    ? formatTime(schedule.timeIn)
                                    : '-- : --'
                                }
                                disabled
                              />

                              <LabelInput
                                id="scheduleLunchOut"
                                label="Lunch out"
                                value={
                                  schedule.lunchOut
                                    ? formatTime(schedule.lunchOut)
                                    : '-- : --'
                                }
                                disabled
                              />
                            </div> */}
                          </>
                        )}

                        <div className="flex ">
                          <button
                            className="w-full px-2 py-2 text-white bg-red-500 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={openSelectScheduleModal}
                            type="button"
                          >
                            <span className="text-xs ">Select Schedule</span>
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Group */}
                    <section className="p-2 bg-gray-200 border rounded">
                      <p className="flex items-center justify-center w-full font-semibold">
                        Group (Optional)
                      </p>
                      <div className="flex flex-col w-full gap-2 ">
                        <LabelInput
                          id="groupSchedulingName"
                          label="Ref Name"
                          disabled
                        />
                        <div className="flex">
                          <button
                            className="w-full px-2 py-2 text-white bg-red-500 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={openSelectGroupModal}
                            type="button"
                          >
                            <span className="text-xs ">Select Group</span>
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </form>
              </div>
            </form>
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-gray-700 bg-gray-200 rounded text-md hover:bg-gray-300"
              onClick={closeModalAction}
            >
              Cancel
            </button>

            <button
              className="px-3 py-2 text-white bg-blue-500 rounded text-md disabled:cursor-not-allowed hover:bg-blue-400"
              type="submit"
              form="addStationGsModal"
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStationSsModal;
