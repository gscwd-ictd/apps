/* eslint-disable @nx/enforce-module-boundaries */
import { usePassSlipStore } from '../../../store/passslip.store';
import { PassSlip } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { useInboxStore } from '../../../../src/store/inbox.store';
import { OvertimeMessageContent, PsbMessageContent } from 'apps/portal/src/types/inbox.type';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { TrainingByEmployeeId } from 'libs/utils/src/lib/types/training.type';

type TabProps = {
  tab: number;
};

export const AllInboxListTab = ({ tab }: TabProps) => {
  const {
    trainingMessages,
    overtimeMessages,
    psbMessages,
    psbMessageModalIsOpen,
    overtimeMessageModalIsOpen,
    trainingMessageModalIsOpen,
    setOvertimeMessageModalIsOpen,
    setPsbMessageModalIsOpen,
    setTrainingMessageModalIsOpen,
    setMessagePsb,
    setMessageOvertime,
    setMessageTraining,
  } = useInboxStore((state) => ({
    trainingMessages: state.message.trainingMessages,
    overtimeMessages: state.message.overtimeMessages,
    psbMessages: state.message.psbMessages,
    psbMessageModalIsOpen: state.psbMessageModalIsOpen,
    overtimeMessageModalIsOpen: state.overtimeMessageModalIsOpen,
    trainingMessageModalIsOpen: state.trainingMessageModalIsOpen,
    setOvertimeMessageModalIsOpen: state.setOvertimeMessageModalIsOpen,
    setPsbMessageModalIsOpen: state.setPsbMessageModalIsOpen,
    setTrainingMessageModalIsOpen: state.setTrainingMessageModalIsOpen,
    setMessagePsb: state.setMessagePsb,
    setMessageOvertime: state.setMessageOvertime,
    setMessageTraining: state.setMessageTraining,
  }));

  const onSelect = (messageDetails) => {
    //Overtime
    if (tab === 1) {
      setMessageOvertime(messageDetails);
      if (!overtimeMessageModalIsOpen) {
        setOvertimeMessageModalIsOpen(true);
      }
    }
    //Training
    else if (tab === 2) {
      setMessageTraining(messageDetails);
      if (!trainingMessageModalIsOpen) {
        setTrainingMessageModalIsOpen(true);
      }
    }
    //PSB
    else if (tab === 3) {
      setMessagePsb(messageDetails);
      if (!psbMessageModalIsOpen) {
        setPsbMessageModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {tab === 1 && overtimeMessages && overtimeMessages.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {overtimeMessages.map((item: OvertimeMessageContent, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-tr-none rounded-bl-none cursor-pointer rounded-xl border-b-gray-200 hover:bg-indigo-50"
              >
                <div className={`w-full px-1 py-2`}>
                  <h1 className={`text-lg font-medium text-gray-600 `}>
                    {DateFormatter(item?.plannedDate, 'MMMM DD, YYYY')}
                  </h1>

                  <p className={`text-sm text-gray-500 `}>Estimated Hours: {item.estimatedHours}</p>
                  <p className={`text-sm text-gray-500 `}>Purpose: {item.purpose}</p>
                  <p className={`text-sm w-96 text-indigo-500 `}>
                    Status:{' '}
                    {item.status == OvertimeStatus.APPROVED
                      ? 'APPROVED'
                      : item.status == OvertimeStatus.DISAPPROVED
                      ? 'DISAPPROVED'
                      : item.status == OvertimeStatus.CANCELLED
                      ? 'CANCELLED'
                      : item.status == OvertimeStatus.PENDING
                      ? 'PENDING'
                      : item.status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : tab === 1 && overtimeMessages && overtimeMessages.length <= 0 ? (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">No messages found at the moment</h1>
        </div>
      ) : null}

      {tab === 2 && trainingMessages && trainingMessages.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {trainingMessages.map((item: TrainingByEmployeeId, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-tr-none rounded-bl-none cursor-pointer rounded-xl border-b-gray-200 hover:bg-indigo-50"
              >
                <div className={`w-full px-1 py-2`}>
                  <h1 className={`text-lg font-medium text-gray-600 `}>{item.name}</h1>

                  <p className={`text-sm text-gray-500 `}>Location: {item.location}</p>
                  <p className={`text-sm text-gray-500 `}>
                    Start Date: {DateFormatter(item?.trainingStart, 'MMMM DD, YYYY')}
                  </p>
                  <p className={`text-sm text-gray-500 `}>
                    End Date: {DateFormatter(item?.trainingEnd, 'MMMM DD, YYYY')}
                  </p>
                  {/* <p className={`text-sm w-96 text-indigo-500 `}>
                  Status:{' '}
                  {item.status == OvertimeStatus.APPROVED
                    ? 'APPROVED'
                    : item.status == OvertimeStatus.DISAPPROVED
                    ? 'DISAPPROVED'
                    : item.status == OvertimeStatus.CANCELLED
                    ? 'CANCELLED'
                    : item.status == OvertimeStatus.PENDING
                    ? 'PENDING'
                    : item.status}
                </p> */}
                </div>
              </li>
            );
          })}
        </ul>
      ) : tab === 2 && trainingMessages && trainingMessages.length <= 0 ? (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">No messages found at the moment</h1>
        </div>
      ) : null}

      {tab === 3 && psbMessages && psbMessages.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {psbMessages.map((item: PsbMessageContent, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-tr-none rounded-bl-none cursor-pointer rounded-xl border-b-gray-200 hover:bg-indigo-50"
              >
                <div className={`w-full px-1 py-2`}>
                  <h1
                    className={`text-lg font-medium ${
                      !item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.details.positionTitle}
                  </h1>
                  <p
                    className={`text-sm ${
                      !item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                  >
                    Date: {DateFormatter(item.details.schedule, 'MMMM DD, YYYY')}
                  </p>
                  <p
                    className={`text-sm ${
                      !item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                  >
                    Assignment: {item.details.assignment}
                  </p>
                  <p
                    className={`text-sm ${
                      !item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                  >
                    Venue: {item.details.venue}
                  </p>
                  <p
                    className={`text-sm w-96 ${
                      !item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                        ? 'text-indigo-500'
                        : 'text-indigo-300'
                    }`}
                  >
                    Status:{' '}
                    {!item?.details?.acknowledgedSchedule && !item?.details?.declinedSchedule
                      ? 'PENDING'
                      : item?.details?.acknowledgedSchedule
                      ? 'ACCEPTED'
                      : item?.details?.declinedSchedule
                      ? 'DECLINED'
                      : ''}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : tab === 3 && psbMessages && psbMessages.length <= 0 ? (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">No messages found at the moment</h1>
        </div>
      ) : null}
    </>
  );
};
