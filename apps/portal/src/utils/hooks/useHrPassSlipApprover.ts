import axios from 'axios';
import useSWR from 'swr';
import { fetchWithToken } from '../hoc/fetcher';

/**
 * HR Pass Slip Approvers are set in EMS Settings > HR Pass Slip Approvers (employees of the Recruitment and
 * Personnel Welfare Division). They can open the Approvals page to approve the pass slips sent to them.
 */
const hrPassSlipApproverUrl = (employeeId: string) =>
  `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/ems-settings/hr-pass-slip-approvers/${employeeId}/is-approver`;

/** client side (navigation): one shared request per employee */
export const useHrPassSlipApprover = (employeeId?: string): boolean => {
  const { data } = useSWR(employeeId ? hrPassSlipApproverUrl(employeeId) : null, fetchWithToken, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  return data?.isHrPassSlipApprover === true;
};

/** server side (getServerSideProps): false when EMS cannot be reached */
export const isHrPassSlipApprover = async (employeeId?: string): Promise<boolean> => {
  if (!employeeId) return false;
  try {
    const { data } = await axios.get(hrPassSlipApproverUrl(employeeId), { timeout: 5000 });
    return data?.isHrPassSlipApprover === true;
  } catch {
    return false;
  }
};
