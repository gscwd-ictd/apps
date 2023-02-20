import { confirmOtpSms } from '../../../http-requests/sms-requests';

export async function confirmOtpCode(otpCode: string, id: any, employeeId: string) {
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
    if (!localStorage.getItem(`prfOtpToken_${id}`)) {
      return {
        otpComplete: false,
        otpFieldError: true,
        isSubmitLoading: false,
        wiggleEffect: true,
        errorMessage: 'No code sent yet',
      };
    } else {
      let otpTokenLocal: any = localStorage.getItem(`prfOtpToken_${id}`);
      const data = await confirmOtpSms(otpTokenLocal, otpCode);
      if (data) {
        if (data.status && data.status === 200) {
          //otp good
          try {
            localStorage.removeItem(`prfOtpToken_${data.id}`);
            localStorage.removeItem(`prfOtpEndTime_${data.id}`);
            return {
              otpComplete: true,
              otpFieldError: false,
              isSubmitLoading: false,
              wiggleEffect: false,
              errorMessage: '',
            };
          } catch (error: any) {
            console.log(error);
            if (error.response.data) {
              let errorData = error.response.data;
              return {
                otpComplete: false,
                otpFieldError: true,
                isSubmitLoading: false,
                wiggleEffect: true,
                errorMessage: errorData,
              };
            } else {
              let errorData = 'Server Error';
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
            let errorData = `Error Code ${data.status}`;
            return {
              otpComplete: false,
              otpFieldError: true,
              isSubmitLoading: false,
              wiggleEffect: true,
              errorMessage: errorData,
            };
          } else {
            let errorData = `Server Error`;
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
