/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { SchedulesPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Footer';
import { SchedulesPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Header';
import { Schedule } from '../../../../../../libs/utils/src/lib/types/schedule.type';
import React, { useEffect, useState } from 'react';
import { ScheduleShift } from 'libs/utils/src/lib/enums/schedule.enum';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { listOfRestDays } from '../../../../../../libs/utils/src/lib/constants/rest-days.const';
import Toggle from 'apps/employee-monitoring/src/components/switch/Toggle';
import { isEmpty } from 'lodash';

const listOfSchedules: Array<Schedule> = [
  {
    name: 'Regular Time Clock',
    timeIn: '08:00',
    timeOut: '05:00',
    lunchIn: '12:00',
    lunchOut: '12:30',
    withLunch: true,
    restDays: [6, 0],
    shift: ScheduleShift.MORNING,
  },
  {
    name: 'Flexible Time Clock A',
    timeIn: '07:00',
    timeOut: '04:00',
    withLunch: true,
    lunchIn: '11:00',
    lunchOut: '11:30',
    restDays: [1, 0],
    shift: ScheduleShift.MORNING,
  },
  {
    name: 'Flexible Time Clock B',
    timeIn: '06:00',
    timeOut: '03:00',
    withLunch: true,
    lunchIn: '10:00',
    lunchOut: '10:30',
    restDays: [1, 2],
    shift: ScheduleShift.MORNING,
  },
  {
    name: 'Pumping Station Morning Time Clock',
    timeIn: '07:00',
    timeOut: '07:00',
    withLunch: false,
    lunchIn: null,
    lunchOut: null,
    restDays: [6, 0],
    shift: ScheduleShift.MORNING,
  },
  {
    name: 'Pumping Station Night Time Clock',
    timeIn: '19:00',
    timeOut: '07:00',
    withLunch: false,
    lunchIn: null,
    lunchOut: null,
    restDays: [6, 0],
    shift: ScheduleShift.NIGHT,
  },
];

const shiftSelection: Array<{ label: string; value: string }> = [
  { label: 'Morning', value: 'morning' },
  { label: 'Night', value: 'night' },
];

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [action, setAction] = useState<string>('');
  const [withLunch, setWithLunch] = useState<boolean>(false);
  const [scheduleForEdit, setScheduleForEdit] = useState<Schedule>(
    {} as Schedule
  );
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  const [scheduleModalIsOpen, setScheduleModalIsOpen] =
    useState<boolean>(false);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);

  const capitalizer = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const {
    setValue,
    getValues,
    watch,
    register,
    formState: { errors },
  } = useForm<Schedule>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      timeIn: '00:00:00',
      timeOut: '00:00:00',
      withLunch: true,
      lunchIn: null,
      lunchOut: null,
      name: '',
      restDays: [],
      shift: ScheduleShift.MORNING,
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

  // when edit action is clicked
  const editAction = async (sched: Schedule, idx: number) => {
    setAction('update');
    setScheduleForEdit(sched);
    setSelectedRestDays(await transformRestDays(sched.restDays));
    loadNewDefaultValues(sched);
    setScheduleModalIsOpen(true);
  };

  // loads the default values, utilizes react hook forms
  const loadNewDefaultValues = (sched: Schedule) => {
    setValue('id', sched.id);
    setValue('name', sched.name);
    setValue('timeIn', sched.timeIn);
    setValue('timeOut', sched.timeOut);
    setValue('withLunch', sched.withLunch);
    setWithLunch(sched.withLunch);
    setValue('lunchIn', sched.lunchIn);
    setValue('lunchOut', sched.lunchOut);
    setValue('shift', sched.shift);
  };

  const closeAction = () => {
    setScheduleModalIsOpen(false);
  };

  //! this must be replaced with fetch
  useEffect(() => {
    setSchedules(listOfSchedules);
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
          title="Schedules"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Schedules',
              path: '',
            },
          ]}
        />
        <Modal
          open={scheduleModalIsOpen}
          setOpen={setScheduleModalIsOpen}
          steady
          size="lg"
        >
          <Modal.Header>
            <div className="flex justify-between w-full">
              <span className="text-2xl text-gray-600">Edit</span>
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
                {/* <div className="flex flex-col w-full">
                  <div className="text-xs text-gray-700">Rest Day</div>
                  <MyListBox
                    selectedItems={selectedRestDays}
                    setSelectedItems={setSelectedRestDays}
                  />
                </div> */}
                {/* <div className="flex flex-col w-full">
                  <label htmlFor="scheduleRestDay">
                    <span className="text-xs text-gray-700">Rest Day/s</span>
                  </label>
                  <div
                    className="w-full border rounded border-gray-300/90"
                    id="scheduleRestDay"
                  >
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="text-xs border-b divide-x-2">
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Sunday" className="select-none">
                              Sunday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Monday" className="select-none">
                              Monday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Tuesday" className="select-none">
                              Tuesday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Wednesday" className="select-none">
                              Wednesday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Thursday" className="select-none">
                              Thursday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Friday" className="select-none">
                              Friday
                            </label>
                          </th>
                          <th className="font-light w-[1/7]">
                            <label htmlFor="Saturday" className="select-none">
                              Saturday
                            </label>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide">
                        <tr className="divide-x-2">
                          {listOfRestDays.map((day) => {
                            return (
                              <td
                                key={day.value}
                                className="w-[1/7]  text-center"
                              >
                                <input
                                  type="checkbox"
                                  id={day.label}
                               
                                />
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button variant="info">
                <span className="text-xs font-normal">Update</span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <div className="mx-5">
          <Card title={''}>
            {/** Top Card */}
            <div className="flex flex-col w-full h-full">
              <SchedulesPageHeader />
              <div className="w-full px-5 mt-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs border-b-2 text-slate-700">
                      <th className="font-semibold w-[1/8] text-left ">
                        Schedule Name
                      </th>

                      <th className="font-semibold w-[1/8] text-left">
                        Time In
                      </th>
                      <th className="font-semibold w-[1/8] text-left">
                        Time Out
                      </th>
                      <th className="font-semibold w-[1/8] text-left">
                        Lunch In
                      </th>
                      <th className="font-semibold w-[1/8] text-left">
                        Lunch Out
                      </th>
                      <th className="font-semibold w-[1/8] text-left">Shift</th>
                      <th className="font-semibold w-[1/8] text-left">
                        Rest Day
                      </th>

                      <th className="font-semibold w-[1/8] text-center">
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
                              <td className="w-[1/8] text-xs ">{sched.name}</td>

                              <td className="w-[1/8] text-xs">
                                {sched.timeIn}
                              </td>

                              <td className="w-[1/8] text-xs">
                                {sched.timeOut}
                              </td>
                              <td className="w-[1/8] text-xs">
                                {sched.lunchIn ? sched.lunchIn : 'N/A'}
                              </td>
                              <td className="w-[1/8] text-xs">
                                {sched.lunchOut ? sched.lunchOut : 'N/A'}
                              </td>
                              <td className="w-[1/8] text-xs">
                                {capitalizer(sched.shift)}
                              </td>
                              <td className="w-[1/8] text-xs ">
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
                              <td className="w-[1/8]">
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
      </div>
    </>
  );
}
