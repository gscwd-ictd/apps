import { getOtpSms } from '../../../../src/utils/helpers/http-requests/sms-requests';
import { add, format } from 'date-fns';

export async function requestOtpCode(
  mobileNumber: string,
  id: any,
  otpName: string
) {
  //error if empty mobile number
  if (!mobileNumber) {
    return {
      otpFieldError: true,
      isSubmitLoading: false,
      wiggleEffect: true,
      errorMessage: 'No Mobile Number',
      isSendOtpLoading: false,
      isOtpSending: false,
      countingDown: false,
    };
  } else {
    const data = await getOtpSms(mobileNumber); //send otp request

    if (data && data.otpToken) {
      localStorage.setItem(`${otpName}OtpToken_${id}`, data.otpToken); //save token to local storage
      localStorage.setItem(
        `${otpName}OtpEndTime_${id}`,
        `${format(add(new Date(), { minutes: 5 }), 'yyyy-MM-dd HH:mm:ss')}`
      );
      return {
        countingDown: true,
        isSendOtpLoading: true,
        isOtpSending: false,

        otpFieldError: false,
        isSubmitLoading: false,
        wiggleEffect: false,
        errorMessage: '',
      };
    } else {
      return {
        otpFieldError: true,
        isSubmitLoading: false,
        wiggleEffect: true,
        errorMessage: 'OTP Send Failed',
        isSendOtpLoading: false,
        isOtpSending: false,
        countingDown: false,
      };
    }
  }
}
