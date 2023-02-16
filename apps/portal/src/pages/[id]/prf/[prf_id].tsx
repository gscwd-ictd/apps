import { MainContainer, ContentBody, ContentHeader } from '../../../components/modular/custom/containers/_index';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { UserRole } from '../../../../utils/enums/userRoles';
import { getEmployeeData } from '../../../../utils/hoc/employee';
import { Employee, Otp } from '../../../../utils/types/data';
import { HiAtSymbol, HiOutlineCalendar, HiOutlineDocumentDuplicate, HiOutlinePencil } from 'react-icons/hi';
import { Button } from '../../../components/modular/common/forms/Button';
import { useRouter } from 'next/router';
import { PrfTimelineV2 } from '../../../components/fixed/prf/PrfTimelineV2';
import { FormModal } from '../../../components/modular/common/overlays/FormModal';
import { useState } from 'react';
import { OtpModal } from '../../../components/fixed/otp/OtpModal';
import { OtpContext } from '../../../context/contexts';
import { PrfTimeline } from '../../../components/fixed/prf/PrfTimeline';
import axios from 'axios';
import Head from 'next/head';
import dayjs from 'dayjs';
import { Position } from '../../../types/position.type';
import { PrfDetails, PrfStatus } from '../../../types/prf.type';
import { withSession, invalidateSession } from '../../../../utils/helpers/session';

type PrfStatusDetails = {
  status: string;
  employeeId: string;
  name: string;
  position: string;
  updatedAt: Date;
  designation: string;
};

export type PrfTrail = {
  division: PrfStatusDetails;
  department: PrfStatusDetails;
  agm: PrfStatusDetails;
  admin: PrfStatusDetails;
  gm: PrfStatusDetails;
};

type PrfSummaryProps = {
  employee: Employee;
  prfDetails: PrfDetails;
  prfTrail: PrfTrail;
  renderType: 'view' | 'approval';
};

export default function PrfSummary({ employee, prfDetails, prfTrail, renderType }: PrfSummaryProps): JSX.Element {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [otp, setOtp] = useState<Otp>({ token: '', value: 0, isError: false });

  const router = useRouter();

  const onOtpModalClose = () => {
    setOtp({ token: '', value: 0, isError: false });
    setIsOtpModalOpen(false);
  };

  const verifyOtp = async () => {
    // disable otp modal
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_HRIS_URL}/prf-trail/${prfDetails._id}`, {
        // employee id of the approver
        employeeId: router.query.id,

        // set prf status to approved
        status: PrfStatus.APPROVED,

        // set remarks
        remarks: '',
      });

      setIsOtpModalOpen(false);
      router.reload();
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const result = (await axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/sms/verify/otp?token=${otp.token}`, { value: otp.value })).data;

    //   if (result === 'invalid') {
    //     setOtp({ ...otp, isError: true });
    //   } else if (result === 'valid') {
    //     setOtp({ ...otp, isError: false });

    //     try {
    //       await axios.patch(`${process.env.NEXT_PUBLIC_HRIS_URL}/prf-trail/${prfDetails._id}`, {
    //         // employee id of the approver
    //         employeeId: router.query.id,

    //         // set prf status to approved
    //         status: PrfStatus.APPROVED,

    //         // set remarks
    //         remarks: '',
    //       });

    //       setIsOtpModalOpen(false);
    //       router.reload();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   dayjs;
    // } catch (error) {
    //   setOtp({ ...otp, isError: true });
    // }
  };

  // handle prf approval
  const prfApproval = async (action: 'approve' | 'disapprove') => {
    if (action === 'approve') {
      verifyOtp();
      // OTP modal
      // setIsOtpModalOpen(true);
      // try {
      //   const otpToken = await (await axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/sms/otp`, { address: '09238045092' })).data;
      //   console.log(otpToken);
      //   otpToken ? setOtp({ ...otp, token: otpToken }) : null;
      // } catch (error) {
      //   console.log(error);
      // }
    }
  };

  return (
    <>
      <Head>
        <title>Position Request Details</title>
      </Head>
      <SideNav />

      <OtpContext.Provider value={{ otp, setOtp }}>
        <FormModal
          title=""
          subtitle=""
          modalSize="xl"
          isStatic
          isOpen={isOtpModalOpen}
          actionLabel="Verify code"
          onCancel={onOtpModalClose}
          setIsOpen={setIsOtpModalOpen}
          withCloseBtn={false}
          withCancelBtn
          onAction={verifyOtp}
          children={<OtpModal />}
        />
      </OtpContext.Provider>

      <MainContainer>
        <div className="w-full h-full px-20">
          <ContentHeader
            title={`# ${prfDetails.prfNo}`}
            subtitle={`Requested last ${dayjs(prfDetails.dateRequested).format('MMMM DD, YYYY')}`}
          >
            {renderType === 'approval' ? (
              <>
                <div>
                  <Button className="mr-2" btnVariant="white" btnLabel="Disapprove" onClick={() => prfApproval('disapprove')} />
                  <Button btnLabel="Approve" shadow onClick={() => prfApproval('approve')} />
                </div>
              </>
            ) : (
              <></>
            )}
          </ContentHeader>
          <ContentBody>
            <>
              <div className="mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <HiAtSymbol className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="mt-[0.2rem] inline font-medium text-gray-600">Requested by </p>
                      <p className="mt-[0.2rem] inline font-semibold text-indigo-500">{prfDetails.from.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <HiOutlineCalendar className="w-5 h-5 text-gray-600" />
                    <p className="mt-[0.2rem] font-medium text-gray-600">
                      Needed on {dayjs(prfDetails.dateNeeded).format('MMMM DD, YYYY')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <HiOutlinePencil className="w-5 h-5 text-gray-600" />
                    <p className="mt-[0.2rem] font-medium text-gray-600">
                      {prfDetails.withExam ? 'Examination is required' : 'No examination is required'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-10">
                {/* <PrfTimeline prfTrail={prfTrail} /> */}
                {renderType === 'view' && <PrfTimelineV2 prfTrail={prfTrail} createdAt={prfDetails.dateRequested} />}
              </div>

              <div className="w-full h-full">
                <div className="mt-14 h-[20rem] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-100">
                        <td>
                          <div className="pl-[4.3rem]">
                            <p className="font-semibold text-gray-700 uppercase">Position</p>
                          </div>
                        </td>
                        <td>
                          <div className="py-5">
                            <p className="font-semibold text-gray-700 uppercase">Item Number</p>
                          </div>
                        </td>
                        <td>
                          <div className="py-5">
                            <p className="font-semibold text-gray-700 uppercase">Remarks</p>
                          </div>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {prfDetails.prfPositions.map((position: Position, index: number) => {
                        return (
                          <tr
                            key={index}
                            className="transition-colors border-b cursor-pointer even:bg-slate-100 hover:border-l-indigo-400 hover:bg-slate-100"
                          >
                            <td>
                              <div className="flex items-center gap-5 px-5 py-3">
                                <div className="flex items-center justify-center rounded h-7 w-7 bg-indigo-50">
                                  <HiOutlineDocumentDuplicate className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                  <h1 className="text-gray-900">{position.positionTitle}</h1>
                                  <p className="text-xs text-gray-500">{position.designation}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-sm text-gray-600">{position.itemNumber}</td>
                            <td className="text-sm text-gray-600">{position.remarks ? `${position.remarks}` : 'No remarks'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
  try {
    // get the data of the logged in employee from the backend
    const employee = (await getEmployeeData(context)) as Employee;

    // check if user role is rank_and_file
    if (employee.userRole === UserRole.RANK_AND_FILE) {
      // if true, the employee is not allowed to access this page
      return {
        redirect: {
          permanent: false,
          destination: '/403',
        },
      };
    }

    const prfDetails = (await axios.get(`${process.env.NEXT_PUBLIC_HRIS_URL}/prf/details/${context.query.prf_id}`)).data;

    const prfTrail = (await axios.get(`${process.env.NEXT_PUBLIC_HRIS_URL}/prf-trail/${context.query.prf_id}`)).data;

    // return employee as props to prf page
    return { props: { employee, prfDetails, prfTrail, renderType: context.query.render_type } };
  } catch (error: any) {
    switch (error.response.data.statusCode) {
      // unauthorized
      case 401: {
        invalidateSession(context.res);

        // return to login page
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }

      // forbidden
      case 403: {
        return {
          redirect: {
            permanent: false,
            destination: '/403',
          },
        };
      }

      // request timeout
      case 408: {
        invalidateSession(context.res);

        // return to login
        return {
          redirect: {
            permanent: false,
            destination: '/login?page=dashboard&error=timeout',
          },
        };
      }

      // not found
      default: {
        return {
          notFound: true,
        };
      }
    }
  }
});
