import { confirmOtpSms } from '../../../../utils/helpers/http-requests/sms-requests';

export async function confirmOtpCode(otpCode: string, id: any) {
  //check first if otp field is not empty
  if (otpCode === null || !otpCode || otpCode === '') {
    return {
      otpComplete: false,
      otpFieldError: true,
      isSubmitLoading: false,
      wiggleEffect: true,
      errorMessage: 'Enter Code',
    };
  } else {
    //check if otp token exists
    if (!localStorage.getItem(`passSlipOtpToken_${id}`)) {
      return {
        otpComplete: false,
        otpFieldError: true,
        isSubmitLoading: false,
        wiggleEffect: true,
        errorMessage: 'No code sent yet',
      };
    } else {
      const otpTokenLocal: string = localStorage.getItem(
        `passSlipOtpToken_${id}`
      );
      const data = await confirmOtpSms(otpTokenLocal, otpCode);
      if (data) {
        if (data.status && data.status === 200) {
          //otp good
          try {
            localStorage.removeItem(`passSlipOtpToken_${data.id}`);
            localStorage.removeItem(`passSlipOtpEndTime_${data.id}`);
            return {
              otpComplete: true,
              otpFieldError: false,
              isSubmitLoading: false,
              wiggleEffect: false,
              errorMessage: '',
            };
          } catch (error: any) {
            // console.log(error);
            if (error.response.data) {
              const errorData = error.response.data;
              return {
                otpComplete: false,
                otpFieldError: true,
                isSubmitLoading: false,
                wiggleEffect: true,
                errorMessage: errorData,
              };
            } else {
              const errorData = 'Server Error';
              return {
                otpComplete: false,
                otpFieldError: true,
                isSubmitLoading: false,
                wiggleEffect: true,
                errorMessage: errorData,
              };
            }
          }
        } else {
          if (data.status) {
            const errorData = `Error Code ${data.status}`;
            return {
              otpComplete: false,
              otpFieldError: true,
              isSubmitLoading: false,
              wiggleEffect: true,
              errorMessage: errorData,
            };
          } else {
            const errorData = `Server Error`;
            return {
              otpComplete: false,
              otpFieldError: true,
              isSubmitLoading: false,
              wiggleEffect: true,
              errorMessage: errorData,
            };
          }
        }
      } else {
        return {
          otpComplete: false,
          otpFieldError: true,
          isSubmitLoading: false,
          wiggleEffect: true,
          errorMessage: 'Invalid Code',
        };
      }
    }
  }
}
