'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { fetchApi } from '../../../../utils/frondend';
import { useAuthContext } from '../../../../context/auth';
import {
  chk_otp,
  chk_password,
  compareArrays,
  validate_string,
} from '../../../../utils/common';
import Loader from '../../../../components/include/Loader';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const Configuration = () => {
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [twofaOtp, setTwofaOtp] = useState('');
  const [twofaOtp2, setTwofaOtp2] = useState('');
  const [changePwdLdr, setChangePwdLdr] = useState(false);
  const [showPwd, setShowPwd] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fields, setFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preWalletAmount, setPreWalletAmount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [walletAmtLdr, setWalletAmtLdr] = useState(false);
  const [getWalletAmtLdr, setGetWalletAmtLdr] = useState(false);
  const router = useRouter();
  const logout = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: '/' + process.env.ADMFLDR,
    });
    router.push('/' + process.env.ADMFLDR);
  };

  const checkPass = pass => {
    const v = pass;
    const digit = /[0-9]/;
    const lower = /[a-z]/;
    const cap = /[A-Z]/;
    const spchar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (v == '' || v == undefined) {
      $('#er1, #er2, #er3, #er4, #er5')
        .addClass('text-danger fa-circle-xmark')
        .removeClass('text-success fa-check-circle');
    } else {
      const c = v.length;
      $('#er1')
        .addClass(
          v.match(digit)
            ? 'text-success fa-check-circle'
            : 'text-danger fa-circle-xmark',
        )
        .removeClass(
          v.match(digit)
            ? 'text-danger fa-circle-xmark'
            : 'text-success fa-check-circle',
        );
      $('#er2')
        .addClass(
          v.match(lower)
            ? 'text-success fa-check-circle'
            : 'text-danger fa-circle-xmark',
        )
        .removeClass(
          v.match(lower)
            ? 'text-danger fa-circle-xmark'
            : 'text-success fa-check-circle',
        );
      $('#er3')
        .addClass(
          v.match(spchar)
            ? 'text-success fa-check-circle'
            : 'text-danger fa-circle-xmark',
        )
        .removeClass(
          v.match(spchar)
            ? 'text-danger fa-circle-xmark'
            : 'text-success fa-check-circle',
        );
      $('#er4')
        .addClass(
          c >= 8 && c <= 30
            ? 'text-success fa-check-circle'
            : 'text-danger fa-circle-xmark',
        )
        .removeClass(
          c >= 8 && c <= 30
            ? 'text-danger fa-circle-xmark'
            : 'text-success fa-check-circle',
        );
      $('#er5')
        .addClass(
          v.match(cap)
            ? 'text-success fa-check-circle'
            : 'text-danger fa-circle-xmark',
        )
        .removeClass(
          v.match(cap)
            ? 'text-danger fa-circle-xmark'
            : 'text-success fa-check-circle',
        );
    }
  };
  const ClickOnEye = field => {
    setShowPwd({ ...showPwd, [field]: !showPwd[field] });
  };
  const RemovePasswordValidationAndValue = () => {
    setShowPwd({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTwofaOtp('');
    setFields({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    return null;
  };
  const handleChangePwdSubmit = () => {
    if (!changePwdLdr) {
      try {
        validate_string(fields.currentPassword, 'current password');
        chk_password(fields.currentPassword);
        validate_string(fields.newPassword, 'new password');
        chk_password(fields.newPassword);
        validate_string(fields.confirmPassword, 'confirm password');
        if (fields.newPassword !== fields.confirmPassword) {
          throw `New password and confirm password doesn't match`;
        }
        chk_otp(twofaOtp);
      } catch (e) {
        toast.error(e);
        return false;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: `You want to change password.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#448ec5',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          setChangePwdLdr(true);
          let bodyData = {
            currentPassword: fields.currentPassword,
            newPassword: fields.newPassword,
            otp: twofaOtp,
          };
          const add_user = await fetchApi(
            'configuration/change-password',
            JSON.stringify(bodyData),
          );
          setChangePwdLdr(false);
          if (add_user?.statusCode == 200) {
            toast.success(add_user?.data?.message);
            RemovePasswordValidationAndValue();
            logout();
          } else {
            if (add_user.data.message == 'Unauthorized') {
              setAuthTkn(add_user.data.message);
            } else {
              toast.error(add_user.data.message);
            }
          }
        }
      });
    }
  };

  const GetMatrixConfigData = async () => {
    if (!getWalletAmtLdr) {
      setGetWalletAmtLdr(true);
      const bodyData = JSON.stringify({ a: 0 });
      const get_walletAmountData = await fetchApi(
        'trading/configuration/get-config-value',
        bodyData,
        'GET',
      );

      if (get_walletAmountData.statusCode == 200) {
        setWalletAmount(get_walletAmountData?.data?.wallet_balance);
        setPreWalletAmount(get_walletAmountData?.data?.wallet_balance);
        setGetWalletAmtLdr(false);
      } else {
        setGetWalletAmtLdr(false);
        if (get_walletAmountData.data.message == 'Unauthorized') {
          setAuthTkn(get_walletAmountData.data.message);
        } else {
          toast.error(get_walletAmountData.data.message);
        }
      }
    }
  };

  const submitMatrixRewardConfig = async () => {
    if (!walletAmtLdr) {
      try {
        compareArrays([preWalletAmount], [walletAmount], 'No change made.');
        validate_string(walletAmount, 'wallet amount');

        chk_otp(twofaOtp2);

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to change wallet amount.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#448ec5',
          confirmButtonText: 'Yes',
        }).then(async result => {
          if (result.isConfirmed) {
            setWalletAmtLdr(true);
            const ActivationData = JSON.stringify({
              wAmount: parseFloat(walletAmount).toFixed(2),
              otp: twofaOtp2,
            });
            const change_status = await fetchApi(
              'trading/configuration/update-wallet-amount',
              ActivationData,
            );
            setWalletAmtLdr(false);

            if (change_status.statusCode == 200) {
              setTwofaOtp2('');
              GetMatrixConfigData();
              toast.success(change_status.data.message);
            } else {
              if (change_status.data.message == 'Unauthorized') {
                setAuthTkn(change_status.data.message);
              } else {
                toast.error(change_status?.data?.message);
              }
            }
          }
        });
      } catch (error) {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    // GetMatrixConfigData();
    setPageLoader(false);
  }, []);

  return (
    <div className='content-body btn-page'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='container-fluid p-4'>
        <div className='row'>
          <h3 className='page-title-main'>Configuration</h3>
        </div>
        <div className='row'>
          <div className='col-xl-4 col-lg-6 col-md-6 col-12 col-sm-6  my-1'>
            <div className='card mt-4 mb-4 configuration-card'>
              <div className='card-header d-block '>
                <h3 className='card-title'>Change Password</h3>
                <div className='d-flex flex-column '>
                  <div className='mb-2'>
                    <div>
                      <label className='col-form-label'>Current Password</label>
                    </div>
                    <div className={`inputContainer form-group d-flex w-100`}>
                      <div className='input-group'>
                        <input
                          type={
                            showPwd['currentPassword'] ? 'text' : 'password'
                          }
                          name='currentPassword'
                          value={fields['currentPassword']}
                          onChange={e =>
                            setFields({
                              ...fields,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder={'Current password'}
                          className='form-control'
                          onKeyUp={e =>
                            e.keyCode == 13 && handleChangePwdSubmit()
                          }
                        />
                        <div className='input-group-append'>
                          <div
                            className='input-group-text'
                            id='btnGroupAddon'
                            onClick={() => ClickOnEye('currentPassword')}
                          >
                            {' '}
                            <i
                              className={`${`hideShow   mdi mdi-eye${
                                showPwd['currentPassword'] ? '' : '-off'
                              } fs-4`}`}
                            ></i>{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mb-2'>
                    <div>
                      <label className='col-form-label'>New Password</label>
                    </div>
                    <div
                      className={`inputContainer form-group d-flex w-100 validationBox`}
                    >
                      <div className='input-group'>
                        <input
                          type={showPwd['newPassword'] ? 'text' : 'password'}
                          name='newPassword'
                          value={fields['newPassword']}
                          onChange={e => {
                            setFields({
                              ...fields,
                              newPassword: e.target.value,
                            });
                          }}
                          placeholder={'New password'}
                          className='form-control'
                          onKeyUp={e => {
                            checkPass(e.target.value),
                              e.keyCode == 13 && handleChangePwdSubmit();
                          }}
                        />
                        <div className='input-group-append '>
                          <div
                            className='input-group-text'
                            id='btnGroupAddon'
                            onClick={() => ClickOnEye('newPassword')}
                          >
                            {' '}
                            <i
                              className={`${`hideShow  mdi mdi-eye${
                                showPwd['newPassword'] ? '' : '-off'
                              } fs-4`}`}
                            ></i>{' '}
                          </div>
                        </div>
                      </div>
                      <span className='password-validation-span'>
                        <span>
                          <i className='fa fa-circle-xmark' id='er1'></i> 1
                          Number
                        </span>
                        <span>
                          <i className='fa fa-circle-xmark' id='er5'></i> 1
                          Uppercase
                        </span>
                        <span>
                          <i className='fa fa-circle-xmark' id='er2'></i> 1
                          Lowercase
                        </span>
                        <span>
                          <i className='fa fa-circle-xmark' id='er3'></i> 1
                          Special Character
                        </span>
                        <span>
                          <i className='fa fa-circle-xmark' id='er4'></i> Min 8
                          - 32 Max Character
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='mb-2'>
                    <div>
                      <label className='col-form-label'>Confirm Password</label>
                    </div>
                    <div className={`inputContainer form-group d-flex w-100`}>
                      <div className='input-group'>
                        <input
                          type={
                            showPwd['confirmPassword'] ? 'text' : 'password'
                          }
                          name='confirmPassword'
                          value={fields['confirmPassword']}
                          onChange={e =>
                            setFields({
                              ...fields,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder={'Confirm password'}
                          className='form-control'
                          onKeyUp={e =>
                            e.keyCode == 13 && handleChangePwdSubmit()
                          }
                        />
                        <div className='input-group-append'>
                          <div
                            className='input-group-text'
                            id='btnGroupAddon'
                            onClick={() => ClickOnEye('confirmPassword')}
                          >
                            {' '}
                            <i
                              className={`${`hideShow  mdi mdi-eye${
                                showPwd['confirmPassword'] ? '' : '-off'
                              } fs-4`}`}
                            ></i>{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mb-2'>
                    <div>
                      <label className='col-form-label'>
                        Google authenticator OTP
                      </label>
                    </div>
                    <div className='form-group  '>
                      <input
                        placeholder='Enter google authenticator OTP'
                        type='text'
                        className='form-control'
                        value={twofaOtp}
                        onChange={e => {
                          setTwofaOtp(
                            (e.target.value = e.target.value
                              .replace(/[^0-9]/g, '')
                              .replace(/(\..*)\./g, '$1')),
                          );
                        }}
                        onKeyUp={e =>
                          e.keyCode == 13 && handleChangePwdSubmit()
                        }
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <div className='d-flex justify-content-end'>
                    <button
                      type='button'
                      className='btn btn-bordered-primary waves-effect search-btn waves-light loadingButton'
                      onClick={() => handleChangePwdSubmit()}
                    >
                      {changePwdLdr && <Loader />} Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-4 col-lg-6 col-md-6 col-12 col-sm-6  my-1'>
            <div className='card mt-4 mb-4 configuration-card'>
              <div className='card-header d-block '>
                <h3 className='card-title'>Wallet Amount</h3>
                <div className={getWalletAmtLdr ? 'd-none' : 'row'}>
                  <div className='mb-2 col-12'>
                    <div>
                      <label className='col-form-label'>Amount</label>
                    </div>
                    <div className={`inputContainer form-group d-flex w-100`}>
                      <div className='input-group'>
                        <input
                          type='text'
                          value={walletAmount}
                          onChange={e => {
                            setWalletAmount(
                              e.target.value
                                .replace(/[^0-9.]/g, '')
                                .replace(/(\..*)\./g, '$1'),
                            );
                          }}
                          placeholder={'Wallet Amount'}
                          className='form-control'
                          onKeyUp={e =>
                            e.keyCode == 13 && submitMatrixRewardConfig()
                          }
                        />
                        <div className='input-group-append'>
                          <div className='input-group-text' id='btnGroupAddon'>
                            {' '}
                            <i className='mdi mdi-currency-usd'></i>{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google authenticator */}
                  <div className='mb-2  col-12'>
                    <div>
                      <label className='col-form-label'>
                        Google Authenticator OTP
                      </label>
                    </div>
                    <div className='form-group  '>
                      <input
                        placeholder='Enter google authenticator OTP'
                        type='text'
                        className='form-control'
                        value={twofaOtp2}
                        onChange={e => {
                          setTwofaOtp2(
                            (e.target.value = e.target.value
                              .replace(/[^0-9]/g, '')
                              .replace(/(\..*)\./g, '$1')),
                          );
                        }}
                        onKeyUp={e =>
                          e.keyCode == 13 && submitMatrixRewardConfig()
                        }
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <div className=' mb-2 col-12'>
                    <div className='d-flex justify-content-end w-100'>
                      <button
                        type='button'
                        className='btn btn-bordered-primary waves-effect search-btn waves-light loadingButton'
                        onClick={() => submitMatrixRewardConfig()}
                      >
                        {walletAmtLdr && <Loader />} Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className={getWalletAmtLdr ? 'mb-2 mb-2' : 'd-none'}>
                  <div className='d-flex justify-content-center align-items-center w-100'>
                    <Loader />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
