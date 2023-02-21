import axios from 'axios';

export async function getOtpSms(msisdn: string) {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_PORTAL_URL}/otp/`,
      { msisdn, content: '' },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.log(error);

    return error;
  }
}

//confirm otp
export async function confirmOtpSms(otpToken: string, otpCode: string) {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_PORTAL_URL}/otp/verify`,
      { otpToken, otpCode },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    // console.log(error.response.data);
    return error;
  }
}
