/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { patchPortal, postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useChangePasswordStore } from 'apps/portal/src/store/change-password.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  userEmail: string;
};

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export const ChangePasswordModal = ({ modalState, setModalState, closeModalAction, userEmail }: ModalProps) => {
  const {
    responseVerifyCurrentPassword,
    responseChangePassword,
    loadingVerifyCurrentPassword,
    loadingChangePassword,
    errorVerifyCurrentPassword,
    errorChangePassword,
    postVerifyCurrentPassword,
    postVerifyCurrentPasswordSuccess,
    postVerifyCurrentPasswordFail,
    patchChangePassword,
    patchChangePasswordSuccess,
    patchChangePasswordFail,
    emptyResponseAndError,
  } = useChangePasswordStore((state) => ({
    responseVerifyCurrentPassword: state.response.responseVerifyCurrentPassword,
    responseChangePassword: state.response.responseChangePassword,
    loadingVerifyCurrentPassword: state.loading.loadingVerifyCurrentPassword,
    loadingChangePassword: state.loading.loadingChangePassword,
    errorVerifyCurrentPassword: state.error.errorVerifyCurrentPassword,
    errorChangePassword: state.error.errorChangePassword,
    postVerifyCurrentPassword: state.postVerifyCurrentPassword,
    postVerifyCurrentPasswordSuccess: state.postVerifyCurrentPasswordSuccess,
    postVerifyCurrentPasswordFail: state.postVerifyCurrentPasswordFail,
    patchChangePassword: state.patchChangePassword,
    patchChangePasswordSuccess: state.patchChangePasswordSuccess,
    patchChangePasswordFail: state.patchChangePasswordFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const { windowWidth } = UseWindowDimensions();
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordModalPage, setPasswordModalPage] = useState<number>(1);

  const { reset, register, handleSubmit, watch, setValue } = useForm<ChangePasswordForm>({
    mode: 'onChange',
    defaultValues: {
      currentPassword: null,
      newPassword: null,
      repeatNewPassword: null,
    },
  });

  const verifyCurrentPassword = async (email: string, password: string) => {
    const { error, result } = await postPortal(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/verify-password`, {
      email,
      password,
    });
    if (error) {
      postVerifyCurrentPasswordFail(result);
      setPasswordModalPage(1);
    } else {
      postVerifyCurrentPasswordSuccess(result);
      setPasswordModalPage(2);
    }
  };

  const handleChangePassword = async (email: string, oldPassword: string, newPassword: string) => {
    const { error, result } = await patchPortal(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/change-password`, {
      email,
      oldPassword,
      newPassword,
    });
    if (error) {
      patchChangePasswordFail(result);
      setPasswordModalPage(2);
    } else {
      patchChangePasswordSuccess(result);
      closeModalAction();
      setPasswordModalPage(1);
    }
  };

  const onSubmit: SubmitHandler<ChangePasswordForm> = (data: ChangePasswordForm) => {
    if (passwordModalPage === 1) {
      postVerifyCurrentPassword();
      verifyCurrentPassword(userEmail, watch('currentPassword'));
    } else if (passwordModalPage === 2) {
      if (watch('newPassword') != watch('repeatNewPassword')) {
        setPasswordError('New Password and Repeat New Password mismatch');
      } else if (watch('newPassword').includes(' ') || watch('repeatNewPassword').includes(' ')) {
        setPasswordError('New Password cannot have spaces');
      } else {
        patchChangePassword();
        handleChangePassword(userEmail, watch('currentPassword'), watch('newPassword'));
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(passwordError)) {
      setTimeout(() => {
        setPasswordError('');
      }, 3000);
    }
  }, [passwordError]);

  useEffect(() => {
    if (errorVerifyCurrentPassword) {
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [errorVerifyCurrentPassword]);

  useEffect(() => {
    setPasswordModalPage(1);
    reset();
  }, [modalState]);

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Change Password</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {!userEmail ? (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                /> */}
            </div>
          ) : (
            <form id="ChangePasswordForm" onSubmit={handleSubmit(onSubmit)}>
              {loadingVerifyCurrentPassword || loadingChangePassword ? (
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting request"
                  dismissible={false}
                />
              ) : null}

              {!isEmpty(errorVerifyCurrentPassword) ? (
                <AlertNotification
                  alertType="error"
                  notifMessage={errorVerifyCurrentPassword}
                  dismissible={false}
                  className="mb-1"
                />
              ) : null}

              {!isEmpty(errorChangePassword) ? (
                <AlertNotification
                  alertType="error"
                  notifMessage={errorChangePassword}
                  dismissible={false}
                  className="mb-1"
                />
              ) : null}

              {!isEmpty(passwordError) ? (
                <AlertNotification
                  alertType="error"
                  notifMessage={passwordError}
                  dismissible={false}
                  className="mb-1"
                />
              ) : null}

              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-3 px-4 rounded">
                  <div className="flex flex-col gap-2">
                    {passwordModalPage === 1 ? (
                      <div
                        className={`lg:flex-row lg:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}
                      >
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Current Password:
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="w-full lg:w-60">
                          <LabelInput
                            id=""
                            label=""
                            type="password"
                            controller={{
                              ...register('currentPassword', {
                                onChange: (e) => {
                                  setValue('currentPassword', e.target.value, {
                                    shouldValidate: true,
                                  });
                                },
                              }),
                            }}
                            isError={errorVerifyCurrentPassword ? true : false}
                            errorMessage={''}
                            className="border-slate-300 text-slate-500 h-12 text-md w-full rounded"
                          />
                        </div>
                      </div>
                    ) : passwordModalPage === 2 ? (
                      <>
                        <div
                          className={`lg:flex-row lg:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}
                        >
                          <div className="text-slate-500 text-md font-medium w-full lg:w-1/2">
                            New Password:
                            <span className="text-red-600">*</span>
                          </div>
                          <div className="w-full lg:w-auto">
                            <input
                              type="password"
                              className="border-slate-300 text-slate-500 h-12 text-md w-full rounded"
                              placeholder="Enter New Password"
                              required
                              minLength={6}
                              maxLength={20}
                              {...register('newPassword')}
                            />
                          </div>
                        </div>
                        <div
                          className={`lg:flex-row lg:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}
                        >
                          <div className="text-slate-500 text-md font-medium w-full lg:w-1/2">
                            Repeat Password:
                            <span className="text-red-600">*</span>
                          </div>
                          <div className="w-full lg:w-auto">
                            <input
                              type="password"
                              className="border-slate-300 text-slate-500 h-12 text-md w-full rounded"
                              placeholder="Repeat New Password"
                              required
                              minLength={6}
                              maxLength={20}
                              {...register('repeatNewPassword')}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="flex justify-end gap-2 text-md">
              {passwordModalPage === 1 ? (
                <Button variant={'primary'} size={'md'} loading={false} form="ChangePasswordForm" type="submit">
                  Verify
                </Button>
              ) : passwordModalPage === 2 ? (
                <Button variant={'primary'} size={'md'} loading={false} form="ChangePasswordForm" type="submit">
                  Change Password
                </Button>
              ) : (
                <Button
                  variant={'default'}
                  size={'md'}
                  loading={false}
                  type="submit"
                  onClick={(e) => closeModalAction()}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
