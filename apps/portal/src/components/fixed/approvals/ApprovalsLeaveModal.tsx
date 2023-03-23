import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiMail } from 'react-icons/hi';
import { withSession } from '../../../utils/helpers/session';
import { useApprovalStore } from '../../../../src/store/approvals.store';

// export default function Messages({ pendingAcknowledgements, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function ApprovalLeaveModal() {
  const [leaveType, setLeaveType] = useState<string>('');
  const [leaveLocation, setLeaveLocation] = useState<string>();
  const [leaveDetails, setLeaveDetails] = useState<string>();
  const [leaveName, setLeaveName] = useState<string>();
  const [leaveDesc, setLeaveDesc] = useState<string>();
  const [leaveReminder, setLeaveReminder] = useState<string>(
    'For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be accompanied by a clearance from money, property, and work-related accountabilities (pursuant to CSC Memorandum Circular No. 2, s. 1985).'
  );
  const selectedLeave = useApprovalStore((state) => state.selectedLeave);
  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const onChangeType = (action: string) => {
    setAction(action);
    console.log(action);
  };

  const handleReason = (e: string) => {
    setReason(e);
  };
  const handleLeaveType = (e: string) => {
    setLeaveType(e);
    setLeaveLocation('');
    setLeaveDetails('');
    if (e === 'vacation') {
      setLeaveName('Vacation Leave');
      setLeaveDesc(
        'It shall be filed five(5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within the Phillipines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from the money and work accountabilities.'
      );
    } else if (e === 'mandatory') {
      setLeaveName('Mandatory/Force Leave');
      setLeaveDesc(
        'Annual five-day vacatuin leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.'
      );
    } else if (e === 'sick') {
      setLeaveName('Sick Leave');
      setLeaveDesc(
        `It shall be filed immediately upon employee's return from such leave. IF filed in advance or exceeding the five (5) days, application shall be accompanied by a medical certificate. In case medical consultation was not availed of, an affidavit should be executed by an applicant. `
      );
    } else if (e === 'maternity') {
      setLeaveName('Maternity Leave - 105 Days');
      setLeaveDesc(
        `Proof of pregnancy e.g. ultrasound, doctor's certificate on the expected data of delivery. Accomplished Notice of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed. Seconded female employees shall enjoy maternity leave with full pay in the recipient agency. `
      );
    } else if (e === 'paternity') {
      setLeaveName('Paternity Leave - 7 Days');
      setLeaveDesc(
        `Proof of child's delivery e.g. birth certificate, medical certificate and marriage contract.`
      );
    } else if (e === 'special-privilege') {
      setLeaveName('Special Prividege Leave - 3 Days');
      setLeaveDesc(
        `It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases. Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.`
      );
    } else if (e === 'solo-parent') {
      setLeaveName('Solo Parent Leave - 7 Days');
      setLeaveDesc(
        `It shall be filed in advance or whenever possible five (5) days before going on such leave with updated Solo Parent Identification Card.`
      );
    } else if (e === 'study') {
      setLeaveName('Study Leave - Up to 6 Months');
      setLeaveDesc(
        `Shall meet the agency's internal requirements, if any; Contract between the agency head or authorized representative and the employee concerned.`
      );
    } else if (e === 'vawc') {
      setLeaveName('VAWC Leave - 10 Days');
      setLeaveDesc(
        `It shall be filed in advance or immediately upon the woman employee's return from such leave. It shall be accompanied by any of the following supporting documents: a. Barangay Protection Order (BPO) obtained from the barangay; b. Temporary/Permanent Protection Order (TPO/PPO) obtained from the court; c. If the protection order is not yet issued by the barangay or the court, a certification issued by the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO, TPO, or PPO has been filed with the said office shall be sufficient to support the application for the ten-day leave; or d. In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of the occurence of violence on the victim and medical certificate may be considered, at the discretion of the immediate supervisor of the woman employee concerned.`
      );
    } else if (e === 'rehabilitation') {
      setLeaveName('Rehabilitation Leave - Up to 6 Months');
      setLeaveDesc(
        `Application shall be made within one (1) week from the time of the accident except when a longer period is warranted. Letter request supported by relevant reports such as the police report, if any. Medical certificate on the nature of the injuries, the course of treatment involved, and the need to undergo rest, recuperation, and rehabilitation, as the case may be. Written concurrence of a government physician should be obtained relative to the recommendation for rehabilitation if the attending physician is a private practitioner, praticularly on the duration of the period of rehabilitation.`
      );
    } else if (e === 'special-women') {
      setLeaveName('Special Leave Benefits for Women - Up to 2 Months');
      setLeaveDesc(
        `The application may be filed in advance, that is, at least five (5) days prior to the scheduled date of the gynecological surgery that will be undergone by the employee. In case of emergency, the application for special leave shall be filed immediately upon employee's return but during confinement the agency shall be notified of said surgery. The application shall be accompanied by a medical certificate filled out by the proper medical authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological disorder which shall be addressed or was addressed by the said surgery; the histopathological report; the operative technique used for the surgery; the duration of the surgery including the perioperative period (period of confinement around surgery); as well as the employee's estimate period of recuperation of the same.`
      );
    } else if (e === 'special-emergency') {
      setLeaveName('Special Emergency (Calamity) Leave - Up to 5 Days');
      setLeaveDesc(
        `The special emergency leave can be applied for a maximum of five (5) straight working days or staggered basis within thirty (30) days from the actual occurence of the natural calamity/disaster. Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster. The head of office shall take full responsibility for teh grant of special emergency leave and verification of teh employee's eligibility to be granted thereof. Said verification shall include: validation of place of residence based on latest available records of the affected employee; verification that the place of residence is covered in the declaration of calamity area by the proper government agency, and such other proofs as may be necessary.`
      );
    } else if (e === 'adoption') {
      setLeaveName('Adoption Leave');
      setLeaveDesc(
        `Application for adoption leave shall be filed with an authenticated copy of teh Pre-Adoptive Placement Authority issued by the Department of Scoial Welfare and Development (DSWD).`
      );
    } else if (e === 'others') {
      setLeaveName('Others');
      setLeaveDesc(
        `For Monetization of Leave Credits, application for monetization of fifthy percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons. For Terminal Leave, proof of employee's resignation or retirement or separation from the service.
        `
      );
    }
  };

  const handleLeaveLocation = (e: string) => {
    setLeaveLocation(e);
    setLeaveDetails('');
  };

  const handleLeaveDetails = (e: string) => {
    setLeaveDetails(e);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 ">
        <div className="w-full flex flex-col gap-2 p-4 rounded">
          {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
          <div className="w-full pb-4">
            <span className="text-slate-500 text-xl font-medium">
              {/* {`${selectedLeave.firstName} ${selectedLeave.middleName} ${selectedLeave.lastName}'s Leave Credits as of Jan 1, 2023`} */}
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
          <div className="w-full flex flex-col gap-2 p-2">
            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Employee:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.firstName} {selectedLeave.middleName}{' '}
                {selectedLeave.lastName} */}
              </div>
            </div>
            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Position:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.position} */}
              </div>
            </div>
            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Salary:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.salary} */}
              </div>
            </div>

            <div className={`flex flex-row gap-40 justify-start`}>
              <div className={`flex flex-row gap-4`}>
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  Office/Department:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {/* {selectedLeave.office} */}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 bg-slate-50 p-2">
            <div className="flex flex-row gap-4">
              <label className="pt-2 text-slate-500 text-2xl font-medium ">
                Leave Details:
              </label>
            </div>
            <div className="flex flex-row gap-4">
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Leave Type:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.typeOfLeave} */}
              </div>
            </div>
            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Date Filed:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {selectedLeave.dateOfFiling}
              </div>
            </div>
            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.withinThePhilippines
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Within Philippines:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.location} */}
              </div>
            </div>
            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.abroad
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Abroad:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.location} */}
              </div>
            </div>
            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.inHospital
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                In Hospital:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.illness} */}
              </div>
            </div>
            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.outPatient
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Out Patient:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.illness} */}
              </div>
            </div>
            <label
            // className={`${
            //   selectedLeave.detailsOfLeave.masterDegree
            //     ? ' pt-2 text-slate-500 text-lg font-medium'
            //     : 'hidden'
            // }`}
            >
              {`For Completion of Master's Degree`}
            </label>
            <label
            // className={`${
            //   selectedLeave.detailsOfLeave.bar
            //     ? ' pt-2 text-slate-500 text-lg font-medium'
            //     : 'hidden'
            // }`}
            >
              {`For BAR/Board Examination Review`}
            </label>
            <label
            // className={`${
            //   selectedLeave.detailsOfLeave.monetization
            //     ? ' pt-2 text-slate-500 text-lg font-medium'
            //     : 'hidden'
            // }`}
            >
              {`For Monetization of Leave Credits`}
            </label>
            <label
            // className={`${
            //   selectedLeave.detailsOfLeave.terminal
            //     ? ' pt-2 text-slate-500 text-lg font-medium'
            //     : 'hidden'
            // }`}
            >
              {`For Terminal Leave`}
            </label>

            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.other
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Other Reason:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.other} */}
              </div>
            </div>
            <div
            // className={`${
            //   selectedLeave.detailsOfLeave.specialLeaveWomenIllness
            //     ? 'flex flex-row gap-4'
            //     : 'hidden'
            // }`}
            >
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Illness:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.detailsOfLeave.specialLeaveWomenIllness} */}
              </div>
            </div>

            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Number of Working Days Applied For:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {/* {selectedLeave.numberOfWorkingDays} */}
              </div>
            </div>
            <div className={`flex flex-row gap-4`}>
              <label className="pt-2 text-slate-500 text-lg font-medium ">
                Commutation:
              </label>
              <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                {selectedLeave.commutation}
              </div>
            </div>
          </div>

          <div className="w-full flex gap-2 justify-start items-center pt-12">
            <span className="text-slate-500 text-xl font-medium">Action:</span>
            <select
              className={`text-slate-500 w-100 h-10 rounded text-md border border-slate-200'
                  
              `}
              onChange={(e) =>
                onChangeType(e.target.value as unknown as string)
              }
            >
              <option>Approve</option>
              <option>Disapprove</option>
            </select>
          </div>

          <textarea
            className={
              'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
            }
            placeholder="Enter Recommendation"
            rows={3}
            onChange={(e) => handleReason(e.target.value as unknown as string)}
          ></textarea>
        </div>
      </div>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
//   const { data } = await axios.get(`http://192.168.137.249:4003/api/vacant-position-postings/psb/schedules/${context.query.id}/unacknowledged`);
//   return { props: { pendingAcknowledgements: data, id: context.query.id } };
// }
// )
