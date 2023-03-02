/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { SchedulesPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Footer';
import { SchedulesPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Header';
import { Schedule } from '../../../../../../../libs/utils/src/lib/types/schedule.type';
import React, { useEffect, useState } from 'react';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectOption } from '../../../../../../../libs/utils/src/lib/types/select.type';
import { listOfRestDays } from '../../../../../../../libs/utils/src/lib/constants/rest-days.const';
import Toggle from 'apps/employee-monitoring/src/components/switch/Toggle';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { Categories } from 'libs/utils/src/lib/enums/category.enum';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { capitalizer } from 'apps/employee-monitoring/src/utils/functions/capitalizer';

const listOfSchedules: Array<Schedule> = [
  {
    name: 'Field Time Clock A',
    category: Categories.REGULAR,
    timeIn: '08:00',
    timeOut: '05:00',
    withLunch: false,
    restDays: [6, 0],
    shift: ScheduleShifts.MORNING,
    lunchIn: null,
    lunchOut: null,
  },
  {
    name: 'Field Time Clock B',
    category: Categories.REGULAR,
    timeIn: '05:00',
    timeOut: '02:00',
    withLunch: false,
    restDays: [6, 0],
    shift: ScheduleShifts.NIGHT,
    lunchIn: null,
    lunchOut: null,
  },
];

const shiftSelection: Array<SelectOption> = [
  { label: 'Morning', value: 'morning' },
  { label: 'Night', value: 'night' },
];

const categorySelection: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Flexible', value: 'flexible' },
  { label: 'Pumping Operator AM', value: 'operator-am' },
  { label: 'Pumping Operator PM', value: 'operator-pm' },
];

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const action = useScheduleStore((state) => state.action);
  const setAction = useScheduleStore((state) => state.setAction);
  const [withLunch, setWithLunch] = useState<boolean>(true);
  const [scheduleForEdit, setScheduleForEdit] = useState<Schedule>(
    {} as Schedule
  );
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  const modalIsOpen = useScheduleStore((state) => state.modalIsOpen);
  const setModalIsOpen = useScheduleStore((state) => state.setModalIsOpen);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);

  const {
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<Schedule>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      category: Categories.REGULAR,
      timeIn: '',
      timeOut: '',
      withLunch: false,
      name: '',
      restDays: [],
      shift: ScheduleShifts.MORNING,
    },
  });

  // transforms the array of numbers(rest days) to array of key value pair
  const transformRestDays = async (restDays: Array<number>) => {
    const tempRestDays = restDays.map((day: number) => {
      return { ...listOfRestDays.find((tempDay) => tempDay.value === day) };
    });
    return tempRestDays;
    // .sort((a, b) => (a.value > b.value ? 1 : -1));
  };

  // transform category string
  const transformCategory = (category: string) => {
    if (category === 'regular') return 'Regular';
    else if (category === 'flexible') return 'Flexible';
    else if (category === 'operator-am') return 'Operator AM';
    else if (category === 'operator-pm') return 'Operator PM';
    else return '';
  };

  // when edit action is clicked
  const editAction = async (sched: Schedule, idx: number) => {
    setAction(ModalActions.UPDATE);
    setScheduleForEdit(sched);
    setSelectedRestDays(await transformRestDays(sched.restDays));
    loadNewDefaultValues(sched);
    setModalIsOpen(true);
  };

  // loads the default values, utilizes react hook forms
  const loadNewDefaultValues = (sched: Schedule) => {
    setValue('id', sched.id);
    setValue('name', sched.name);
    setValue('category', sched.category);
    setValue('timeIn', sched.timeIn);
    setValue('timeOut', sched.timeOut);
    setValue('withLunch', false);
    setWithLunch(sched.withLunch);
    setValue('shift', sched.shift);
  };

  // run this when modal is closed
  const closeAction = () => {
    setModalIsOpen(false);
    resetToDefaultValues();
  };

  // reset all values
  const resetToDefaultValues = () => {
    reset();
    setSelectedRestDays([]);
    setWithLunch(true);
  };

  //! this must be replaced with fetch
  useEffect(() => {
    setSchedules(listOfSchedules);
    setSelectedRestDays([]);
  }, []);

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchIn'))) setValue('lunchIn', null);
  }, [watch('lunchIn')]);

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchOut'))) setValue('lunchOut', null);
  }, [watch('lunchOut')]);

  // with lunch in/out listener
  useEffect(() => {
    if (withLunch) setValue('withLunch', true);
    else if (!withLunch) setValue('withLunch', false);
  }, [withLunch]);

  return (
    <>
      <div className="min-h-[100%] min-w-full">
        <BreadCrumbs
          title="Field-based Schedules"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Schedules',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Field',
              path: '',
            },
          ]}
        />

        <Modal open={modalIsOpen} setOpen={setModalIsOpen} steady size="xl">
          <Modal.Header>
            <div className="flex justify-between w-full">
              <span className="text-2xl text-gray-600">
                {action === ModalActions.CREATE
                  ? 'New Schedule'
                  : action === ModalActions.UPDATE
                  ? 'Edit'
                  : ''}
              </span>
              <button
                className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded-full"
                type="button"
                onClick={closeAction}
              >
                x
              </button>
            </div>
          </Modal.Header>
          <hr />
          <Modal.Body>
            <div className="w-full mt-5">
              <div className="flex flex-col w-full gap-5">
                {/** name */}
                <LabelInput
                  id={'scheduleName'}
                  label={'Schedule Name'}
                  controller={{ ...register('name') }}
                  onChange={(e) =>
                    setScheduleForEdit({
                      ...scheduleForEdit,
                      name: e.target.value,
                    })
                  }
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                />

                {/** Shift */}
                <SelectListRF
                  id="scheduleCategory"
                  selectList={categorySelection}
                  controller={{ ...register('category') }}
                  label="Category"
                />

                {/** Time in */}
                <LabelInput
                  id={'scheduleTimeIn'}
                  type="time"
                  label={'Time In'}
                  onChange={(e) =>
                    setScheduleForEdit({
                      ...scheduleForEdit,
                      timeIn: e.target.value,
                    })
                  }
                  controller={{ ...register('timeIn') }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                />

                {/** Time Out */}
                <LabelInput
                  id={'scheduleTimeOut'}
                  type="time"
                  label={'Time Out'}
                  onChange={(e) =>
                    setScheduleForEdit({
                      ...scheduleForEdit,
                      timeOut: e.target.value,
                    })
                  }
                  controller={{ ...register('timeOut') }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                />

                {/** With Lunch */}
                <div className="flex gap-2 text-start">
                  <Toggle
                    labelPosition="top"
                    enabled={withLunch}
                    setEnabled={setWithLunch}
                    label={'With Lunch In & Out:'}
                  />
                  <div
                    className={`text-xs ${
                      withLunch ? 'text-blue-400' : 'text-gray-400'
                    }`}
                  >
                    {withLunch ? (
                      <button
                        onClick={() => setWithLunch((prev) => !prev)}
                        className="underline"
                      >
                        <span>Yes</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setWithLunch((prev) => !prev)}
                        className="underline"
                      >
                        <span>No</span>
                      </button>
                    )}
                  </div>
                </div>

                {/** Lunch In */}
                {watch('withLunch') === true ? (
                  <LabelInput
                    id={'scheduleLunchIn'}
                    type="time"
                    label={'Lunch In'}
                    onChange={(e) =>
                      setScheduleForEdit({
                        ...scheduleForEdit,
                        lunchIn: e.target.value,
                      })
                    }
                    controller={{ ...register('lunchIn') }}
                    isError={errors.lunchIn ? true : false}
                    errorMessage={errors.lunchIn?.message}
                  />
                ) : null}

                {/** Lunch Out */}
                {watch('withLunch') === true ? (
                  <LabelInput
                    id={'scheduleLunchOut'}
                    type="time"
                    label={'Lunch Out'}
                    onChange={(e) =>
                      setScheduleForEdit({
                        ...scheduleForEdit,
                        lunchOut: e.target.value,
                      })
                    }
                    controller={{ ...register('lunchOut') }}
                    isError={errors.lunchOut ? true : false}
                    errorMessage={errors.lunchOut?.message}
                  />
                ) : null}

                {/** Shift */}
                <SelectListRF
                  id="scheduleShift"
                  selectList={shiftSelection}
                  controller={{ ...register('shift') }}
                  label="Shift"
                />

                {/** Rest Day */}
                <div className="flex flex-col w-full min-h-[2.25rem]">
                  <MySelectList
                    id="scheduleRestDays"
                    label="Rest Day(s)"
                    multiple
                    options={listOfRestDays}
                    onChange={(o) => setSelectedRestDays(o)}
                    value={selectedRestDays}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button variant="info">
                <span className="text-xs font-normal">
                  {action === ModalActions.CREATE
                    ? 'Add'
                    : action === ModalActions.UPDATE
                    ? 'Update'
                    : ''}
                </span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Can I="access" this="maintenance_schedules">
          <div className="mx-5">
            <Card title={''}>
              {/** Top Card */}
              <div className="flex flex-col w-full h-full">
                <SchedulesPageHeader />
                <div className="w-full px-5 mt-5">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs border-b-2 text-slate-700">
                        <th className="font-semibold w-[1/9] text-left ">
                          Schedule Name
                        </th>

                        <th className="font-semibold w-[1/9] text-left ">
                          Category
                        </th>

                        <th className="font-semibold w-[1/9] text-left">
                          Time In
                        </th>
                        <th className="font-semibold w-[1/9] text-left">
                          Time Out
                        </th>
                        <th className="font-semibold w-[1/9] text-left">
                          Lunch In
                        </th>
                        <th className="font-semibold w-[1/9] text-left">
                          Lunch Out
                        </th>
                        <th className="font-semibold w-[1/9] text-left">
                          Shift
                        </th>
                        <th className="font-semibold w-[1/9] text-left">
                          Rest Day
                        </th>

                        <th className="font-semibold w-[1/9] text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide">
                      {schedules &&
                        schedules.map((sched, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr className="h-[4rem] text-gray-700">
                                <td className="w-[1/9] text-xs ">
                                  {sched.name}
                                </td>

                                <td className="w-[1/9] text-xs ">
                                  {transformCategory(sched.category)}
                                </td>

                                <td className="w-[1/9] text-xs">
                                  {sched.timeIn}
                                </td>

                                <td className="w-[1/9] text-xs">
                                  {sched.timeOut}
                                </td>
                                <td className="w-[1/9] text-xs">
                                  {sched.lunchIn ? sched.lunchIn : 'N/A'}
                                </td>
                                <td className="w-[1/9] text-xs">
                                  {sched.lunchOut ? sched.lunchOut : 'N/A'}
                                </td>
                                <td className="w-[1/9] text-xs">
                                  {capitalizer(sched.shift)}
                                </td>
                                <td className="w-[1/9] text-xs ">
                                  {sched.restDays
                                    .sort((a, b) => (a > b ? 1 : -1))
                                    .map((day, index) => {
                                      return (
                                        <React.Fragment key={index}>
                                          {day === 0
                                            ? 'Sunday'
                                            : day === 1
                                            ? 'Monday'
                                            : day === 2
                                            ? 'Tuesday'
                                            : day === 3
                                            ? 'Wednesday'
                                            : day === 4
                                            ? 'Thursday'
                                            : day === 5
                                            ? 'Friday'
                                            : day === 6
                                            ? 'Saturday'
                                            : null}
                                          {index + 1 < sched.restDays.length
                                            ? ', '
                                            : ''}
                                        </React.Fragment>
                                      );
                                    })}
                                </td>
                                <td className="w-[1/9]">
                                  <div className="flex w-full gap-2 text-center">
                                    <Button
                                      variant="info"
                                      onClick={() => editAction(sched, index)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                      </svg>
                                    </Button>
                                    <Button variant="danger">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <SchedulesPageFooter />
              </div>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
