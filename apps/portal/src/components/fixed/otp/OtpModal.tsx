import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { OtpContext } from '../../../context/contexts';
import { UndrawMyApp } from '../undraw/MyApp';

type OtpInputProps = {
  digits: number;
  isError: boolean;
};

export const OtpModal = (): JSX.Element => {
  const { otp } = useContext(OtpContext);

  return (
    <>
      <div>
        <header>
          <div className="mb-10 flex justify-center">
            <h1 className="text-3xl font-semibold text-gray-700">OTP Verification</h1>
          </div>
          <div className="mb-5 flex justify-center">
            <UndrawMyApp width={140} height={140} />
          </div>
          <p className="text-center text-gray-600">
            We have just sent a verification code to the mobile number registered under your account:
            <span className="ml-3 font-semibold text-indigo-500">+639***5092</span>
          </p>
        </header>

        <main className="mt-10">
          {/* <h5 className="mb-3 text-sm font-medium text-gray-600">1 out of 5 attempts:</h5> */}

          <OtpInput digits={6} isError={otp.isError} />

          <p className="mt-5 mb-10 text-sm text-gray-500">
            Did not receive the code? <span className="cursor-pointer font-semibold text-indigo-500">Resend</span>
          </p>
        </main>
      </div>
    </>
  );
};

const OtpInput = ({ digits, isError }: OtpInputProps): JSX.Element => {
  // get otp context
  const { otp, setOtp } = useContext(OtpContext);

  // initialize current input id
  const [currentInput, setCurrentInput] = useState(0);

  // intialize input value
  const [inputVal, setInputVal] = useState<Array<number | null>>(new Array(digits).fill(0));

  // initialize number of inputs based on number of digits
  let inputs: Array<number> = [];

  // loop through the array
  for (var i: number = 0; i < digits; i++) inputs.push(i);

  // track the current value of otp code
  useEffect(() => setOtp({ ...otp, value: Number(inputVal.join('')) }), [inputVal]);

  // focus the current input
  useEffect(() => document.getElementById(`${currentInput}`)?.focus(), [currentInput]);

  // check if the user clicked on a specific input
  const handleManualFocus = (inputId: number) => setCurrentInput(inputId);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>, inputId: number) => {
    // create a copy of input val
    const updatedInputVal = [...inputVal];

    // set value on the current index
    updatedInputVal[inputId] = parseInt(event.target.value);

    // set new value
    setInputVal(updatedInputVal);

    // check if the current input is the last digit
    if (currentInput !== digits - 1) setCurrentInput(currentInput + 1);
  };

  const handleKeyPress = (event: React.KeyboardEvent, inputId: number) => {
    // create a copy of input val
    const updatedInputVal = [...inputVal];

    // detect if backspace is pressed
    if (event.key === 'Backspace') {
      // set the current digit to null
      updatedInputVal[inputId] = null;

      // update the input val
      setInputVal(updatedInputVal);

      // go back to previous digit
      currentInput === 1 ? setCurrentInput(0) : setCurrentInput(currentInput - 1);
    }
  };

  return (
    <>
      <div className="flex h-[3.5rem] w-full gap-4">
        {inputs.map((id: number) => {
          return (
            <input
              onClick={() => handleManualFocus(id)}
              autoComplete="off"
              inputMode="numeric"
              pattern="\d{6}"
              onChange={(e) => onInputChange(e, id)}
              onKeyDown={(e) => handleKeyPress(e, id)}
              key={id}
              id={`${id}`}
              type="text"
              maxLength={1}
              className={`h-full w-full rounded-md border-4 text-center text-xl font-semibold text-gray-600 focus:ring-0 ${
                isError ? 'border-rose-300 focus:border-rose-300 ' : 'border-gray-200 focus:border-indigo-400 '
              }`}
            ></input>
          );
        })}
      </div>
    </>
  );
};
