/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { AlertNotification, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { isEmpty } from 'lodash';
import { useSWRConfig } from 'swr';
import { useLeaveStore } from '../../../store/leave.store';
import { useEmployeeStore } from '../../../store/employee.store';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { putPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import Calendar from './LeaveCalendar';

type EditLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  /** after a successful save */
  onSaved: () => void;
};

/** leave types filed as a date range (from - to) */
const RANGE_LEAVES: string[] = [
  LeaveName.MATERNITY,
  LeaveName.STUDY,
  LeaveName.REHABILITATION,
  LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN,
  LeaveName.ADOPTION,
];
const LOCATION_LEAVES: string[] = [
  LeaveName.VACATION,
  LeaveName.FORCED,
  LeaveName.SPECIAL_PRIVILEGE,
  LeaveName.LEAVE_WITHOUT_PAY,
];

/** an ongoing leave can be edited by the employee only until the HRMO certifies it; never monetization / terminal */
export const isLeaveEditable = (status?: string, leaveName?: string) =>
  status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION &&
  leaveName !== LeaveName.MONETIZATION &&
  leaveName !== LeaveName.TERMINAL;

const inputClass = 'w-full text-slate-500 text-md border-slate-300 rounded';

export const EditLeaveModal = ({ modalState, setModalState, closeModalAction, onSaved }: EditLeaveModalProps) => {
  const { leaveIndividualDetail, leaveDates, leaveDateFrom, leaveDateTo, overlappingLeaveCount, pendingLeaves } =
    useLeaveStore((state) => ({
      leaveIndividualDetail: state.leaveIndividualDetail,
      leaveDates: state.leaveDates,
      leaveDateFrom: state.leaveDateFrom,
      leaveDateTo: state.leaveDateTo,
      overlappingLeaveCount: state.overlappingLeaveCount,
      pendingLeaves: state.leaves.onGoing,
    }));
  const { setLeaveDates, setLeaveDateFrom, setLeaveDateTo } = useLeaveStore((state) => ({
    setLeaveDates: state.setLeaveDates,
    setLeaveDateFrom: state.setLeaveDateFrom,
    setLeaveDateTo: state.setLeaveDateTo,
  }));
  const {
    vacationLeaveBalance,
    forcedLeaveBalance,
    sickLeaveBalance,
    specialPrivilegeLeaveBalance,
    wellnessLeaveBalance,
  } = useLeaveLedgerStore((state) => ({
    vacationLeaveBalance: state.vacationLeaveBalance,
    forcedLeaveBalance: state.forcedLeaveBalance,
    sickLeaveBalance: state.sickLeaveBalance,
    specialPrivilegeLeaveBalance: state.specialPrivilegeLeaveBalance,
    wellnessLeaveBalance: state.wellnessLeaveBalance,
  }));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const { mutate } = useSWRConfig();
  const { windowWidth } = UseWindowDimensions();

  const info = leaveIndividualDetail?.leaveApplicationBasicInfo;
  const details = leaveIndividualDetail?.leaveApplicationDetails as Record<string, string> | undefined;
  const leaveName = info?.leaveName ?? '';
  const isRange = RANGE_LEAVES.includes(leaveName);

  const [changeDates, setChangeDates] = useState<boolean>(false);
  const [placeType, setPlaceType] = useState<string>('Philippines'); // Philippines | Abroad
  const [place, setPlace] = useState<string>('');
  const [hospital, setHospital] = useState<string>('inHospital'); // inHospital | outPatient
  const [illness, setIllness] = useState<string>('');
  const [study, setStudy] = useState<string>('master'); // master | bar | other
  const [studyOther, setStudyOther] = useState<string>('');
  const [splWomen, setSplWomen] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // load the current values every time the modal opens
  useEffect(() => {
    if (!modalState) return;
    setChangeDates(false);
    setError('');
    setLeaveDates([]);
    setLeaveDateFrom(null);
    setLeaveDateTo(null);
    setPlaceType(details?.inPhilippinesOrAbroad === 'Abroad' ? 'Abroad' : 'Philippines');
    setPlace(details?.location ?? '');
    setHospital(details?.hospital === 'Out Patient' ? 'outPatient' : 'inHospital');
    setIllness(details?.illness ?? '');
    setStudy(details?.forMastersCompletion === '1' ? 'master' : details?.forBarBoardReview === '1' ? 'bar' : 'other');
    setStudyOther(details?.studyLeaveOther ?? '');
    setSplWomen(details?.splWomen ?? '');
  }, [modalState]);

  /** leave dates of the employee's other pending leaves of the same credit type (this leave not counted) */
  const otherPendingDays = (names: string[]) =>
    (pendingLeaves ?? [])
      .filter((l) => l.id !== info?.id && names.includes(l.leaveName))
      .reduce((n, l) => n + (l.leaveDates?.length ?? 0), 0);

  const checkCredits = (days: number): string => {
    if (
      leaveName === LeaveName.VACATION &&
      days > Math.round(Number(vacationLeaveBalance)) - otherPendingDays([LeaveName.VACATION, LeaveName.FORCED])
    )
      return 'Insufficient Vacation Leave Credits.';
    if (
      leaveName === LeaveName.FORCED &&
      (days > Math.round(Number(vacationLeaveBalance)) - otherPendingDays([LeaveName.VACATION, LeaveName.FORCED]) ||
        days > Math.round(Number(forcedLeaveBalance)))
    )
      return 'Insufficient Leave Credits.';
    if (
      leaveName === LeaveName.SICK &&
      days > Math.round(Number(sickLeaveBalance)) - otherPendingDays([LeaveName.SICK])
    )
      return 'Insufficient Sick Leave Credits.';
    if (leaveName === LeaveName.SPECIAL_PRIVILEGE && (days > 3 || days > Number(specialPrivilegeLeaveBalance)))
      return 'Special Privilege Leave: maximum of 3 days and within your credits.';
    if (leaveName === LeaveName.WELLNESS && (days > 3 || days > Number(wellnessLeaveBalance)))
      return 'Wellness Leave: maximum of 3 days and within your credits.';
    return '';
  };

  const save = async () => {
    setError('');
    const data: Record<string, unknown> = { employeeId: employeeDetails.employmentDetails.userId };

    if (LOCATION_LEAVES.includes(leaveName)) {
      if (isEmpty(place.trim())) return setError('Please specify the place.');
      data.inPhilippines = placeType === 'Philippines' ? place.trim() : null;
      data.abroad = placeType === 'Abroad' ? place.trim() : null;
    } else if (leaveName === LeaveName.SICK) {
      if (isEmpty(illness.trim())) return setError('Please specify the illness.');
      data.inHospital = hospital === 'inHospital' ? illness.trim() : null;
      data.outPatient = hospital === 'outPatient' ? illness.trim() : null;
    } else if (leaveName === LeaveName.STUDY) {
      data.forMastersCompletion = study === 'master' ? true : null;
      data.forBarBoardReview = study === 'bar' ? true : null;
      data.studyLeaveOther = study === 'other' ? studyOther.trim() : null;
      if (study === 'other' && isEmpty(studyOther.trim())) return setError('Please specify the study leave.');
    } else if (leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN) {
      if (isEmpty(splWomen.trim())) return setError('Please specify the illness.');
      data.splWomen = splWomen.trim();
    }

    if (changeDates) {
      if (isRange) {
        if (!leaveDateFrom || !leaveDateTo) return setError('Please select the leave dates.');
        if (leaveDateTo < leaveDateFrom) return setError('Please select an acceptable date of Leave.');
        if (overlappingLeaveCount > 0) return setError('There are overlapping Leaves in your application.');
        data.leaveApplicationDates = { from: leaveDateFrom, to: leaveDateTo };
      } else {
        if (!leaveDates || leaveDates.length === 0) return setError('Please select a date of Leave.');
        const creditError = checkCredits(leaveDates.length);
        if (creditError) return setError(creditError);
        data.leaveApplicationDates = leaveDates;
      }
    }

    setSaving(true);
    const { error: putError, result } = await putPortal(`/v1/leave-application/${info?.id}`, data);
    setSaving(false);
    if (putError) return setError(typeof result === 'string' ? result : 'Failed to save the changes.');

    // refresh the leave list (and the pending leave details through onSaved)
    mutate(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/${employeeDetails.employmentDetails.userId}`
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onSaved();
    closeModalAction();
  };

  const radio = (name: string, value: string, label: string, current: string, onChange: (v: string) => void) => (
    <label className="flex items-center gap-2 text-md text-slate-600 cursor-pointer">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} />
      {label}
    </label>
  );

  return (
    <>
      {saved ? <ToastNotification toastType="success" notifMessage="Leave application updated." /> : null}
      <Modal
        size={`${windowWidth > 1280 ? 'sm' : windowWidth > 1024 ? 'md' : 'full'}`}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Edit Leave Application</span>
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
          <div className="w-full flex flex-col gap-4 px-4 pb-4">
            <AlertNotification
              alertType="info"
              notifMessage="You can edit this application until the HRMO certifies it. The leave type cannot be changed."
              dismissible={false}
            />
            {error ? <AlertNotification alertType="error" notifMessage={error} dismissible={false} /> : null}

            {/* leave type (locked) */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-500 text-md">Leave Type</label>
              <input className={`${inputClass} bg-slate-100 cursor-not-allowed`} value={leaveName} disabled readOnly />
            </div>

            {/* details per leave type */}
            {LOCATION_LEAVES.includes(leaveName) ? (
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-md">Where will the leave be spent?</label>
                <div className="flex flex-wrap gap-4">
                  {radio('placeType', 'Philippines', 'Within the Philippines', placeType, setPlaceType)}
                  {radio('placeType', 'Abroad', 'Abroad', placeType, setPlaceType)}
                </div>
                <input
                  className={inputClass}
                  placeholder={placeType === 'Abroad' ? 'Country / place abroad' : 'Place within the Philippines'}
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
            ) : null}

            {leaveName === LeaveName.SICK ? (
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-md">Sick leave</label>
                <div className="flex flex-wrap gap-4">
                  {radio('hospital', 'inHospital', 'In Hospital', hospital, setHospital)}
                  {radio('hospital', 'outPatient', 'Out Patient', hospital, setHospital)}
                </div>
                <input
                  className={inputClass}
                  placeholder="Specify the illness"
                  value={illness}
                  onChange={(e) => setIllness(e.target.value)}
                />
              </div>
            ) : null}

            {leaveName === LeaveName.STUDY ? (
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-md">Study leave</label>
                <div className="flex flex-wrap gap-4">
                  {radio('study', 'master', `Completion of Master's Degree`, study, setStudy)}
                  {radio('study', 'bar', 'BAR/Board Examination Review', study, setStudy)}
                  {radio('study', 'other', 'Other', study, setStudy)}
                </div>
                {study === 'other' ? (
                  <input
                    className={inputClass}
                    placeholder="Specify"
                    value={studyOther}
                    onChange={(e) => setStudyOther(e.target.value)}
                  />
                ) : null}
              </div>
            ) : null}

            {leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ? (
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-md">Illness</label>
                <input
                  className={inputClass}
                  placeholder="Specify the illness"
                  value={splWomen}
                  onChange={(e) => setSplWomen(e.target.value)}
                />
              </div>
            ) : null}

            {/* leave dates */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-500 text-md">Leave Dates</label>
              <p className="text-md text-slate-700">
                {isRange && info?.leaveDates?.length
                  ? `${DateFormatter(info.leaveDates[0], 'MM-DD-YYYY')} - ${DateFormatter(
                      info.leaveDates[info.leaveDates.length - 1],
                      'MM-DD-YYYY'
                    )}`
                  : (info?.leaveDates ?? []).map((d) => DateFormatter(d, 'MM-DD-YYYY')).join(', ')}{' '}
                <span className="text-slate-400">({info?.leaveDates?.length ?? 0} day/s)</span>
              </p>
              <label className="flex items-center gap-2 text-md text-slate-600 cursor-pointer w-fit">
                <input type="checkbox" checked={changeDates} onChange={(e) => setChangeDates(e.target.checked)} />
                Change the leave dates
              </label>
              {changeDates && modalState ? (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-slate-500">Select the new leave dates. They replace the current dates.</p>
                  <Calendar
                    type={isRange ? 'range' : 'single'}
                    clickableDate={true}
                    leaveName={leaveName}
                    isLateFiling={info?.isLateFiling === 'true'}
                    editLeaveApplicationId={info?.id}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <Button variant={'default'} size={'md'} loading={false} onClick={closeModalAction}>
              Cancel
            </Button>
            <Button variant={'primary'} size={'md'} loading={saving} disabled={saving} onClick={save}>
              Save Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditLeaveModal;
