import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import Calendar from '../calendar/Calendar';
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { LeaveContents, LeaveType } from '../../../../src/types/leave.type';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useEmployeeStore } from '../../../../src/store/employee.store';

type LeaveApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: string;
};

const typeOfLeave: Array<SelectOption> = [
  { label: 'Vacation Leave', value: '585e4746-e09b-4720-80ba-3f059daa2b5e' },
  { label: 'Forced Leave', value: '59d3f978-431d-4fbb-8949-19cfd7c5a218' },
  { label: 'Sick Leave', value: 'acdf4218-313c-4abc-a884-13f302b322f5' },
  { label: 'Maternity Leave', value: 'Maternity Leave_id_235345345' },
  { label: 'Paternity Leave', value: 'Paternity Leave_id_235345345' },
  {
    label: 'Special Privilege Leave',
    value: 'Special Privilege Leave_id_235345345',
  },
  { label: 'Solo Parent Leave', value: 'Solo Parent Leave_id_235345345' },
  { label: 'Study Leave', value: 'Study Leave_id_235345345' },
  { label: '10-Day VAWC Leave', value: '10-Day VAWC Leave_id_235345345' },
  {
    label: 'Rehabilitation Privilege',
    value: 'Rehabilitation Privilege_id_235345345',
  },
  {
    label: 'Special Leave Benefits for Women',
    value: 'Special Leave Benefits for Women_id_235345345',
  },
  {
    label: 'Special Emergency (Calamity) Leave',
    value: 'Special Emergency (Calamity) Leave_id_235345345',
  },
  { label: 'Adoption Leave', value: 'Adoption Leave' },
  { label: 'Others', value: 'Others_id_235345345' },
];

const leaveLocation: Array<SelectOption> = [
  { label: 'Within the Philippines', value: 'Within the Philippines' },
  { label: 'Abroad (Specify)', value: 'Abroad (Specify)' },
];

const leaveHospital: Array<SelectOption> = [
  {
    label: 'In Hospital (Specify Illness)',
    value: 'In Hospital (Specify Illness)',
  },
  {
    label: 'Out Patient (Specify Illness)',
    value: 'Out Patient (Specify Illness)',
  },
];

const leaveStudy: Array<SelectOption> = [
  {
    label: `Completion of Master's Degree`,
    value: `Completion of Master's Degree`,
  },
  {
    label: 'BAR/Board Examination Review',
    value: 'BAR/Board Examination Review',
  },
  { label: 'Other', value: 'Other' },
];

const leaveOther: Array<SelectOption> = [
  {
    label: `Monetization of Leave Credits`,
    value: `Monetization of Leave Credits`,
  },
  {
    label: 'Terminal Leave',
    value: 'Terminal Leave',
  },
];

const leaveCommutation: Array<SelectOption> = [
  {
    label: `Not Requested`,
    value: `Not Requested`,
  },
  {
    label: 'Requested',
    value: 'Requested',
  },
];

export const LeaveApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: LeaveApplicationModalProps) => {
  //zustand initialization to access Leave store
  const {
    postResponseApply,
    loadingResponse,
    errorResponse,
    leaveTypes,
    errorLeaveTypes,
    leaveDates,

    postLeave,
    postLeaveSuccess,
    postLeaveFail,

    getLeaveTypes,
    getLeaveTypesSuccess,
    getLeaveTypesFail,

    setLeaveDates,
  } = useLeaveStore((state) => ({
    postResponseApply: state.response.postResponseApply,
    loadingResponse: state.loading.loadingResponse,
    errorResponse: state.error.errorResponse,
    leaveTypes: state.leaveTypes,
    errorLeaveTypes: state.error.errorLeaveTypes,
    leaveDates: state.leaveDates,

    postLeave: state.postLeave,
    postLeaveSuccess: state.postLeaveSuccess,
    postLeaveFail: state.postLeaveFail,

    getLeaveTypes: state.getLeaveTypes,
    getLeaveTypesSuccess: state.getLeaveTypesSuccess,
    getLeaveTypesFail: state.getLeaveTypesFail,
    setLeaveDates: state.setLeaveDates,
  }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const [leaveReminder, setLeaveReminder] = useState<string>(
    'For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be accompanied by a clearance from money, property, and work-related accountabilities (pursuant to CSC Memorandum Circular No. 2, s. 1985).'
  );

  const leaveTypeUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-benefits`;

  const {
    data: swrLeaveTypes,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(leaveTypeUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveTypes(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveTypes)) {
      getLeaveTypesSuccess(swrIsLoading, swrLeaveTypes);
    }

    if (!isEmpty(swrError)) {
      getLeaveTypesFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaveTypes, swrError]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<LeaveContents>({
      mode: 'onChange',
      defaultValues: {
        // name: '',
        // id: employeeDetails.employmentDetails.userId,
        // office: '',
        // dateOfFiling: '',
        // position: '',
        // salary: '',
        typeOfLeave: {
          id: '',
          leaveName: '',
        },
        // leaveId: '',
        // numberOfWorkingDays: [],
        // inPhilippinesOrAbroad: '', //withinThePhilippines or abroad
        // location: '',
        // hospital: '', //inHospital or outPatient
        // illness: '',
        // specialLeaveWomenIllness: '',
        // study: '', //mastersDegree, BAR, or Other
        // studyPurpose: '', //applicable for Study Other only
        // other: '', //monetization, terminal leave
        // commutation: '',
      },
    });

  const onSubmit: SubmitHandler<LeaveContents> = (data: LeaveContents) => {
    let dataToSend;
    if (
      data.typeOfLeave.leaveName === 'Vacation Leave' ||
      data.typeOfLeave.leaveName === 'Forced Leave'
    ) {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
        inPhilippinesOrAbroad: data.inPhilippinesOrAbroad, //withinThePhilippines or abroad
        location: data.location,
      };
    } else if (data.typeOfLeave.leaveName === 'Sick Leave') {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
        hospital: data.hospital,
        illness: data.illness,
      };
    } else if (data.typeOfLeave.leaveName === 'Study Leave') {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
        study: data.study,
        studyPurpose: data.studyPurpose ? data.studyPurpose : null,
      };
    } else if (
      data.typeOfLeave.leaveName === 'Special Leave Benefits for Women'
    ) {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
        specialLeaveWomenIllness: data.specialLeaveWomenIllness,
      };
    } else if (data.typeOfLeave.leaveName === 'Others') {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
        other: data.other,
        commutation: data.commutation ? data.commutation : null,
      };
    } else {
      dataToSend = {
        id: data.id,
        typeOfLeave: data.typeOfLeave,
        leaveId: '',
        numberOfWorkingDays: data.numberOfWorkingDays,
      };
    }

    // handlePostResult(data);
    // postLeaveList();
    console.log(data);
    console.log(dataToSend);
    console.log(
      JSON.parse(
        `{"label":"Vacation Leave","value":"585e4746-e09b-4720-80ba-3f059daa2b5e"}`
      )
    );
  };

  const handlePostResult = async (data: LeaveContents) => {
    const { error, result } = await postPortal('/v1/pass-slip', data);

    if (error) {
      postLeaveFail(result);
    } else {
      postLeaveSuccess(result);

      reset();
      closeModalAction();
    }
  };

  const [leaveObject, setLeaveObject] = useState<LeaveType>();

  useEffect(() => {
    // if (watch('typeOfLeave.leaveName') === 'Vacation Leave') {
    //   setValue('leaveId', '585e4746-e09b-4720-80ba-3f059daa2b5e');
    // }
    // if (watch('typeOfLeave.leaveName') === 'Sick Leave') {
    //   setValue('leaveId', 'acdf4218-313c-4abc-a884-13f302b322f5');
    // }
    // if (watch('typeOfLeave.leaveName') === 'Forced Leave') {
    //   setValue('leaveId', '59d3f978-431d-4fbb-8949-19cfd7c5a218');
    // }
    // setValue('id', employeeDetails.employmentDetails.userId);
  }, [watch('typeOfLeave')]);

  useEffect(() => {
    setValue('numberOfWorkingDays', leaveDates);
  }, [leaveDates]);

  useEffect(() => {
    setValue('id', employeeDetails.employmentDetails.userId);
  }, []);

  return (
    <>
      {/* Notifications */}
      {!isEmpty(errorLeaveTypes) ? (
        <>
          {/* {console.log(errorLeaveTypes)} */}
          <ToastNotification
            toastType="error"
            notifMessage={`${errorLeaveTypes}: Failed to load Leave Types`}
          />
        </>
      ) : null}

      <Modal size={'xl'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Leave Applicattion</span>
              <button
                className="hover:bg-slate-100 px-1 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyLeaveForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 p-4 rounded">
                {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
                <div className="w-full pb-4">
                  <span className="text-slate-500 text-xl font-medium">
                    Your current Leave Credits:
                  </span>
                  <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                    <tbody>
                      <tr className="border border-slate-400">
                        <td className="border border-slate-400"></td>
                        <td className="border border-slate-400 text-center text-sm p-1">
                          Vacation Leave
                        </td>
                        <td className="border border-slate-400 text-center text-sm p-1">
                          Sick Leave
                        </td>
                      </tr>
                      <tr className="border border-slate-400">
                        <td className="border border-slate-400 text-sm p-1">
                          Total Earned
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          20
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          10
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 text-sm p-1">
                          Less this application
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          3
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          2
                        </td>
                      </tr>
                      <tr className="border border-slate-400 bg-green-100">
                        <td className="border border-slate-400 text-sm p-1">
                          Balance
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          7
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          8
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <label className="pt-2 text-slate-500 text-xl font-medium">
                      Leave Type:
                    </label>
                    {swrIsLoading ? <LoadingSpinner size="xs" /> : null}
                  </div>

                  <div className="flex gap-2 w-full items-center">
                    <select
                      id="typeOfLeave"
                      className="text-slate-500 w-full h-14 rounded text-lg border-slate-300"
                      required
                      defaultValue={''}
                      {...register('typeOfLeave')}
                      // disabled={swrIsLoading ? true : false}
                    >
                      <option value="" disabled>
                        Select Type Of Leave:
                      </option>
                      {
                        // swrLeaveTypes
                        typeOfLeave
                          ? //
                            // swrLeaveTypes.map((item: LeaveType, idx: number) => (
                            //   <option value={item.leaveName} key={idx}>
                            //     {item.leaveName}
                            //   </option>
                            // ))
                            typeOfLeave.map((item: Item, index: number) => (
                              <option
                                value={JSON.stringify(
                                  `{"label":"Vacation Leave","value":"585e4746-e09b-4720-80ba-3f059daa2b5e"}`
                                )}
                                key={index}
                              >
                                {item.label}
                              </option>
                            ))
                          : null
                      }
                    </select>
                  </div>
                </div>

                <div>
                  {watch('typeOfLeave') ? (
                    <div className="flex flex-col gap-1 w-full bg-slate-100 text-sm p-2 mt-1">
                      <span className="font-bold">
                        {watch('typeOfLeave.leaveName')}
                      </span>
                      <span>
                        {watch('typeOfLeave.leaveName') === 'Vacation Leave'
                          ? 'It shall be filed five(5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within the Phillipines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from the money and work accountabilities.'
                          : watch('typeOfLeave.leaveName') === 'Forced Leave'
                          ? 'Annual five-day vacatuin leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.'
                          : watch('typeOfLeave.leaveName') === 'Sick Leave'
                          ? `It shall be filed immediately upon employee's return from such leave. IF filed in advance or exceeding the five (5) days, application shall be accompanied by a medical certificate. In case medical consultation was not availed of, an affidavit should be executed by an applicant.`
                          : watch('typeOfLeave.leaveName') === 'Maternity Leave'
                          ? `Proof of pregnancy e.g. ultrasound, doctor's certificate on the expected data of delivery. Accomplished Notice of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed. Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.`
                          : watch('typeOfLeave.leaveName') === 'Paternity Leave'
                          ? `Proof of child's delivery e.g. birth certificate, medical certificate and marriage contract.`
                          : watch('typeOfLeave.leaveName') ===
                            'Special Privilege Leave'
                          ? `It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases. Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.`
                          : watch('typeOfLeave.leaveName') ===
                            'Solo Parent Leave'
                          ? `It shall be filed in advance or whenever possible five (5) days before going on such leave with updated Solo Parent Identification Card.`
                          : watch('typeOfLeave.leaveName') === 'Study Leave'
                          ? `Shall meet the agency's internal requirements, if any; Contract between the agency head or authorized representative and the employee concerned.`
                          : watch('typeOfLeave.leaveName') ===
                            '10-Day VAWC Leave'
                          ? `It shall be filed in advance or immediately upon the woman employee's return from such leave. It shall be accompanied by any of the following supporting documents: a. Barangay Protection Order (BPO) obtained from the barangay; b. Temporary/Permanent Protection Order (TPO/PPO) obtained from the court; c. If the protection order is not yet issued by the barangay or the court, a certification issued by the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO, TPO, or PPO has been filed with the said office shall be sufficient to support the application for the ten-day leave; or d. In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of the occurence of violence on the victim and medical certificate may be considered, at the discretion of the immediate supervisor of the woman employee concerned.`
                          : watch('typeOfLeave.leaveName') ===
                            'Rehabilitation Privilege'
                          ? `Application shall be made within one (1) week from the time of the accident except when a longer period is warranted. Letter request supported by relevant reports such as the police report, if any. Medical certificate on the nature of the injuries, the course of treatment involved, and the need to undergo rest, recuperation, and rehabilitation, as the case may be. Written concurrence of a government physician should be obtained relative to the recommendation for rehabilitation if the attending physician is a private practitioner, praticularly on the duration of the period of rehabilitation.`
                          : watch('typeOfLeave.leaveName') ===
                            'Special Leave Benefits for Women'
                          ? `The application may be filed in advance, that is, at least five (5) days prior to the scheduled date of the gynecological surgery that will be undergone by the employee. In case of emergency, the application for special leave shall be filed immediately upon employee's return but during confinement the agency shall be notified of said surgery. The application shall be accompanied by a medical certificate filled out by the proper medical authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological disorder which shall be addressed or was addressed by the said surgery; the histopathological report; the operative technique used for the surgery; the duration of the surgery including the perioperative period (period of confinement around surgery); as well as the employee's estimate period of recuperation of the same.`
                          : watch('typeOfLeave.leaveName') ===
                            'Special Emergency (Calamity) Leave'
                          ? `The special emergency leave can be applied for a maximum of five (5) straight working days or staggered basis within thirty (30) days from the actual occurence of the natural calamity/disaster. Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster. The head of office shall take full responsibility for teh grant of special emergency leave and verification of teh employee's eligibility to be granted thereof. Said verification shall include: validation of place of residence based on latest available records of the affected employee; verification that the place of residence is covered in the declaration of calamity area by the proper government agency, and such other proofs as may be necessary.`
                          : watch('typeOfLeave.leaveName') === 'Adoption Leave'
                          ? `Application for adoption leave shall be filed with an authenticated copy of teh Pre-Adoptive Placement Authority issued by the Department of Scoial Welfare and Development (DSWD).`
                          : watch('typeOfLeave.leaveName') === 'Others'
                          ? `For Monetization of Leave Credits, application for monetization of fifthy percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons. For Terminal Leave, proof of employee's resignation or retirement or separation from the service.`
                          : ``}
                      </span>
                    </div>
                  ) : null}
                </div>

                {watch('typeOfLeave') ? (
                  <>
                    {/* <label className="-mb-2 text-slate-500 text-xl font-medium w-full">
                      Details of Leave:
                    </label> */}
                    <div className="flex flex-row justify-between items-center w-full mt-1">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="pt-2 text-slate-500 text-xl font-medium">
                          {watch('typeOfLeave.leaveName') ===
                            'Vacation Leave' ||
                          watch('typeOfLeave.leaveName') === 'Forced Leave' ||
                          watch('typeOfLeave.leaveName') ===
                            'Special Privilege Leave'
                            ? 'Location:'
                            : watch('typeOfLeave.leaveName') === 'Sick Leave'
                            ? 'Hospitalization:'
                            : watch('typeOfLeave.leaveName') === 'Study Leave'
                            ? 'Study:'
                            : watch('typeOfLeave.leaveName') === 'Others'
                            ? 'Other Purpose: '
                            : null}
                        </label>
                      </div>

                      <div className="flex gap-2 w-full items-center">
                        {watch('typeOfLeave.leaveName') === 'Vacation Leave' ||
                        watch('typeOfLeave.leaveName') === 'Forced Leave' ||
                        watch('typeOfLeave.leaveName') ===
                          'Special Privilege Leave' ? (
                          <>
                            <select
                              id="inPhilippinesOrAbroad"
                              className="text-slate-500 w-full h-14 rounded text-lg border-slate-300"
                              required
                              defaultValue={''}
                              {...register('inPhilippinesOrAbroad')}
                            >
                              <option value="" disabled>
                                Select Location:
                              </option>
                              {leaveLocation.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeave.leaveName') === 'Sick Leave' ? (
                          <>
                            <select
                              id="hospital"
                              className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
                              required
                              defaultValue={''}
                              {...register('hospital')}
                            >
                              <option value="" disabled>
                                Select Hosptitalization:
                              </option>
                              {leaveHospital.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeave.leaveName') === 'Study Leave' ? (
                          <>
                            <select
                              id="study"
                              className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
                              required
                              defaultValue={''}
                              {...register('study')}
                            >
                              <option value="" disabled>
                                Select Study Purpose:
                              </option>
                              {leaveStudy.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeave.leaveName') === 'Others' ? (
                          <>
                            <select
                              id="others"
                              className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
                              required
                              defaultValue={''}
                              {...register('other')}
                            >
                              <option value="" disabled>
                                Select Other:
                              </option>
                              {leaveOther.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {watch('typeOfLeave.leaveName') === 'Others' &&
                    watch('other') === 'Monetization of Leave Credits' ? (
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="pt-2 text-slate-500 text-xl font-medium">
                            Commutation
                          </label>
                        </div>

                        <div className="flex gap-2 w-full items-center">
                          {watch('other') ===
                          'Monetization of Leave Credits' ? (
                            <div className="w-full">
                              <select
                                id="commutation"
                                className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
                                required
                                defaultValue={''}
                                {...register('commutation')}
                              >
                                <option value="" disabled>
                                  Select Other:
                                </option>
                                {leaveCommutation.map(
                                  (item: Item, idx: number) => (
                                    <option value={item.value} key={idx}>
                                      {item.label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {watch('typeOfLeave.leaveName') === 'Vacation Leave' ||
                    watch('typeOfLeave.leaveName') === 'Forced Leave' ||
                    watch('typeOfLeave.leaveName') ===
                      'Special Privilege Leave' ||
                    watch('typeOfLeave.leaveName') === 'Sick Leave' ||
                    watch('typeOfLeave.leaveName') ===
                      'Special Leave Benefits for Women' ||
                    (watch('typeOfLeave.leaveName') === 'Study Leave' &&
                      watch('study') === 'Other') ||
                    watch('typeOfLeave.leaveName') === 'Forced Leave' ? (
                      <textarea
                        {...(watch('typeOfLeave.leaveName') ===
                          'Vacation Leave' ||
                        watch('typeOfLeave.leaveName') === 'Forced Leave'
                          ? { ...register('location') }
                          : watch('typeOfLeave.leaveName') === 'Sick Leave'
                          ? { ...register('illness') }
                          : watch('typeOfLeave.leaveName') === 'Study Leave'
                          ? { ...register('studyPurpose') }
                          : watch('typeOfLeave.leaveName') ===
                            'Special Leave Benefits for Women'
                          ? { ...register('specialLeaveWomenIllness') }
                          : null)}
                        required
                        rows={3}
                        placeholder={`${
                          watch('typeOfLeave.leaveName') === 'Vacation Leave' ||
                          watch('typeOfLeave.leaveName') === 'Forced Leave' ||
                          watch('typeOfLeave.leaveName') ===
                            'Special Privilege Leave'
                            ? 'Specify Leave Details'
                            : watch('typeOfLeave.leaveName') === 'Sick Leave' ||
                              watch('typeOfLeave.leaveName') ===
                                'Special Leave Benefits for Women'
                            ? 'Specify Illness'
                            : watch('typeOfLeave.leaveName') ===
                                'Study Leave' && watch('study') === 'Other'
                            ? 'Specify Study Leave Purpose'
                            : 'Specify Leave Details'
                        }`}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-lg border-slate-300"
                      ></textarea>
                    ) : null}
                  </>
                ) : null}

                {watch('typeOfLeave') ? (
                  <>
                    <label className="pt-2 text-slate-500 text-xl font-medium">
                      Select Leave Dates:
                    </label>
                    <div className="w-full p-4 bg-gray-50 rounded">
                      <Calendar clickableDate={true} />
                    </div>
                  </>
                ) : null}

                <div
                  className={`flex flex-col gap-2 w-full bg-slate-100 text-sm p-2 mt-1`}
                >
                  <span>{leaveReminder}</span>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form="ApplyLeaveForm"
                type="submit"
              >
                Apply Leave
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
