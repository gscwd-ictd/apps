/* eslint-disable @nx/enforce-module-boundaries */
import axios from 'axios';
import dayjs from 'dayjs';
import ConvertToYearMonth from 'apps/employee-monitoring/src/utils/functions/ConvertToYearMonth';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

export const runtime = 'edge';

export default async function GET() {
  const emsUrl = process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN;
  const monthYear = ConvertToYearMonth(dayjs().toString());

  try {
    const response = await axios.get<Array<PassSlip>>(`${emsUrl}/pass-slip/ems/${monthYear}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const finalCount = await CountHrmoApproval(response.data);
    // ({ forHrmoApprovalCount: finalCount });

    return Response.json({ forHrmoApprovalCount: finalCount });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        return {
          message: error.response.data.message || 'An API error occurred',
          forHrmoApprovalCount: 0,
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return {
          message: 'No response from external API',
          forHrmoApprovalCount: 0,
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Axios request setup error:', error.message);
        return {
          message: 'Axios request error',
          forHrmoApprovalCount: 0,
        };
      }
    } else {
      // Other types of errors (e.g., programming errors)
      console.error('Unexpected error:', error);
      return {
        message: 'An unexpected error occurred',
        forHrmoApprovalCount: 0,
      };
    }
  }
}

const CountHrmoApproval = async (response: Array<PassSlip>) => {
  let countForHrmoApproval = 0;

  response.forEach((data: PassSlip) => {
    if (data.status === PassSlipStatus.FOR_HRMO_APPROVAL) {
      countForHrmoApproval++;
    }
  });

  return countForHrmoApproval;
};
