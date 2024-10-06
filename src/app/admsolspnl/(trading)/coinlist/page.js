'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import Table_Loader from '../../../../components/include/TableLoader';
import {
  chk_password,
  convert_date,
  convert_date_upto_second,
  validate_string,
} from '../../../../utils/common';
import { fetchApi } from '../../../../utils/frondend';
import Loader from '../../../../components/include/Loader';
import { useAuthContext } from '../../../../context/auth';
import Modal from 'react-bootstrap/Modal';
const CoinList = () => {
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [orderClm, setOrderClm] = useState(7);
  const [loader, setLoader] = useState(false);
  const [searchLdr, setSearchLdr] = useState(false);
  const [userlists, setUserLists] = useState([]);
  const date = moment(new Date()).subtract(process.env.FILTERDAYS, 'days');
  const [startDate, setStartDate] = useState(date['_d']);
  const [endDate, setEndDate] = useState(date['_i']);
  const [status, setStatus] = useState('');
  const [siteType, setSiteType] = useState('');
  const [activationLdr, setActivationLdr] = useState(false);
  const [varificationLdr, setVarificationLdr] = useState(false);
  const [twoFaLdr, setTwoFaLdr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user_id, set_user_id] = useState('');
  const [user_email, set_user_email] = useState('');
  const [listIndex, setListindex] = useState(-1);
  const [showPwd, setShowPwd] = useState({
    admPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fields, setFields] = useState({
    admPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const handleClose = () => {
    setShow(false);
    setFields({
      admPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  const handleShow = ({ user_id, email }) => {
    set_user_id(user_id);
    set_user_email(email);
    setShow(true);
  };

  let st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000;
  let ed = endDate
    ? new Date(
        moment(moment(endDate).format('MM/DD/YYYY'))
          .add(23, 'h')
          .add(59, 'm')
          .add(59, 's'),
      ).getTime() / 1000
    : 0;

  const [verify, setVerify] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState(true);

  const pagginationHandler = page => {
    var p = page.selected;
    setPage(p);
  };

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: '1' },
    { label: 'Deactive', value: '0' },
  ];
  const siteTypeOption = [
    { label: 'All', value: '' },
    { label: 'NFT21', value: '0' },
    { label: 'SOLARES', value: '1' },
  ];
  const verify_Options = [
    { label: 'All', value: '' },
    { label: 'Verified', value: '1' },
    { label: 'Not Verify', value: '0' },
  ];

  const GetUserList = async () => {
    if (!loader) {
      setLoader(true);
      const userData = JSON.stringify({
        page: page,
        order: order,
        orderColumn: orderClm,
        startDate: st,
        endDate: ed,
        status: status,
        search: search,
        verify: verify,
        siteType: siteType,
      });

      const getUserList = await fetchApi('user/userlist', userData, 'GET');
      if (getUserList.statusCode == 200) {
        setLoader(false);
        setTotalPage(getUserList.data.total);
        setUserLists(getUserList.data.data);
        setPageLoader(false);
        setSearchLdr(false);
      } else {
        setLoader(false);
        setSearchLdr(false);
        if (getUserList.data.message == 'Unauthorized') {
          setAuthTkn(getUserList.data.message);
        } else {
          setPageLoader(false);
          toast.error(getUserList.data.message);
        }
      }
    }
  };

  const sortData = (column, sort) => {
    setOrder(sort);
    setOrderClm(column);
    if (sort == 1) {
      $('.fa-sort-down').removeClass('sort-enable');
      $('.fa-sort-up').removeClass('sort-enable');
      $('.fa-sort-up').removeClass('sort-desable');
      $('.fa-sort-down').removeClass('sort-desable');
      $('.asc-' + column).addClass('sort-enable');
    } else {
      $('.fa-sort-down').removeClass('sort-enable');
      $('.fa-sort-up').removeClass('sort-enable');
      $('.desc-' + column).addClass('sort-enable');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      sortData(orderClm, order);
    }, 500);
  }, []);

  const serachList = () => {
    if (!dateRange) {
      toast.error('Please select both start and end dates.');
      return false;
    }
    if (page >= 1) {
      setPage(0);
    } else {
      setSearchLdr(true);
      GetUserList();
    }
  };

  const updateStatus = async (status, userId, email, i) => {
    if (!activationLdr) {
      await Swal.fire({
        title: 'Are you sure?',
        text: `You want to ${status == 0 ? 'active' : 'deactive'} ${email}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#448ec5',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          setActivationLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
            status: status == 1 ? 0 : 1,
          });
          const change_status = await fetchApi(
            'user/change-status',
            ActivationData,
          );
          setActivationLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == 'Unauthorized') {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const updateVerification = async (userId, email, i) => {
    if (!varificationLdr) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to verify ${email}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#448ec5',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          setVarificationLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
          });
          const change_status = await fetchApi(
            'user/change-verification',
            ActivationData,
          );
          setVarificationLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == 'Unauthorized') {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const twoOff = async (userId, email, i) => {
    if (!twoFaLdr) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to disable google authenticator for ${email}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#448ec5',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          setTwoFaLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
          });
          const change_status = await fetchApi('user/two-off', ActivationData);
          setTwoFaLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == 'Unauthorized') {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const checkPass = pass => {
    const v = pass;
    const digit = /[0-9]/;
    const lower = /[a-z]/;
    const cap = /[A-Z]/;
    const spchar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (v == '' || v == undefined) {
      $('#er1').addClass('text-danger').removeClass('text-success');
      $('#er2').addClass('text-danger').removeClass('text-success');
      $('#er3').addClass('text-danger').removeClass('text-success');
      $('#er4').addClass('text-danger').removeClass('text-success');
      $('#er5').addClass('text-danger').removeClass('text-success');
    } else {
      const c = v.length;
      $('#er1')
        .addClass(v.match(digit) ? 'text-success' : 'text-danger')
        .removeClass(v.match(digit) ? 'text-danger' : 'text-success');
      $('#er2')
        .addClass(v.match(lower) ? 'text-success' : 'text-danger')
        .removeClass(v.match(lower) ? 'text-danger' : 'text-success');
      $('#er3')
        .addClass(v.match(spchar) ? 'text-success' : 'text-danger')
        .removeClass(v.match(spchar) ? 'text-danger' : 'text-success');
      $('#er4')
        .addClass(c < 8 || c > 32 ? 'text-danger' : 'text-success')
        .removeClass(c < 8 || c > 32 ? 'text-success' : 'text-danger');
      $('#er5')
        .addClass(v.match(cap) ? 'text-success' : 'text-danger')
        .removeClass(v.match(cap) ? 'text-danger' : 'text-success');
    }
  };
  const ClickOnEye = field => {
    setShowPwd({ ...showPwd, [field]: !showPwd[field] });
  };
  const handleSubmit = () => {
    if (!loading) {
      try {
        validate_string(fields.newPassword, 'new password');
        chk_password(fields.newPassword);
        validate_string(fields.confirmPassword, 'confirm password');
        if (fields.newPassword !== fields.confirmPassword) {
          throw `Password and confirm password doesn't match`;
        }
        validate_string(fields.admPassword, 'admin password');
        chk_password(fields.admPassword);
      } catch (e) {
        toast.error(e);
        return false;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: `You want to change password for ${user_email}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#448ec5',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          setLoading(true);
          let bodyData = {
            admPassword: fields.admPassword,
            newPassword: fields.newPassword,
            userId: user_id,
          };
          const add_user = await fetchApi(
            'user/change-password',
            JSON.stringify(bodyData),
          );
          setLoading(false);
          if (add_user?.statusCode == 200) {
            toast.success(add_user?.data?.message);
            setFields({});
            handleClose();
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
  useEffect(() => {
    GetUserList();
    st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000;
    ed = endDate
      ? new Date(
          moment(moment(endDate).format('MM/DD/YYYY'))
            .add(23, 'h')
            .add(59, 'm')
            .add(59, 's'),
        ).getTime() / 1000
      : 0;
  }, [page, order, orderClm]);
  // Temp

  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    // Listen for messages (price updates) from the WebSocket
    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.p).toFixed(2); // Price of the trade
      const cryptoObj = {
        symbole: data.s,
        price: newPrice,
        tradedQunaty: data.q,
        time: parseInt(data.T),
      };
      setCryptoData([cryptoObj]);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);
  return (
    <div className='content-body btn-page'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='container-fluid p-4'>
        <div className='row'>
          <h3
            className='page-title-main'
            onClick={() => console.log(cryptoData)}
          >
            Manage Coin
          </h3>

          <div className='col-lg-12'>
            <div className='card mt-4 mb-4'>
              <div className='card-header d-block'>
                <div className='row'>
                  <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                    <label className='form-label'>Date</label>
                    <Flatpickr
                      className='form-control'
                      options={{
                        defaultDate: [startDate, endDate],
                        altInput: true,
                        altFormat: 'j, M Y',
                        dateFormat: 'Y-m-d',
                        showMonths: 1,
                        mode: 'range',
                      }}
                      onChange={update => {
                        !update[0] || !update[1]
                          ? setDateRange(false)
                          : setDateRange(true);
                        setStartDate(update[0]);
                        update[1] ? setEndDate(update[1]) : '';
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='card-body'>
                <div className='table-responsive position-relative'>
                  <table
                    className={`table table-striped  ${loader && 'tbl-overly'}`}
                  >
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          #
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          Symbole
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          LTP
                        </th>

                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          Traded Quantity
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          Event Time
                        </th>

                        <th scope='col' className='text-center text-nowrap'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoData?.length > 0
                        ? cryptoData?.map((d, i) => {
                            return (
                              <tr key={i}>
                                <td className='text-center text-nowrap'>
                                  {i + 1}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.symbole}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.price}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.tradedQunaty}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.time
                                    ? convert_date_upto_second(d.time)
                                    : '-'}
                                </td>

                                <td className='text-center text-nowrap'>
                                  <div className='d-flex justify-content-start'>
                                    <div className='actionBtn'>
                                      <button
                                        className='btn btn-success waves-effect waves-light'
                                        onClick={() =>
                                          handleShow({
                                            user_id: d?.id,
                                            email: d?.email,
                                          })
                                        }
                                        data-toggle='modal'
                                        data-target='#myModal'
                                      >
                                        {' '}
                                        <span className='btn-label'>
                                          <i className='mdi mdi-plus-circle-outline'></i>
                                        </span>{' '}
                                        Buy
                                      </button>
                                      <button
                                        className='btn btn-danger waves-effect waves-light'
                                        onClick={() =>
                                          handleShow({
                                            user_id: d?.id,
                                            email: d?.email,
                                          })
                                        }
                                        data-toggle='modal'
                                        data-target='#myModal'
                                      >
                                        {' '}
                                        <span className='btn-label'>
                                          <i className='mdi mdi-minus-circle-outline'></i>
                                        </span>{' '}
                                        Sell
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : ''}

                      {loader || cryptoData?.length <= 0 ? (
                        <tr>
                          <td
                            className={`text-center ${
                              cryptoData?.length <= 0 ? 'tableLoaderBox' : ''
                            }`}
                            colSpan={10}
                          >
                            {loader ? (
                              <div
                                className={`disableTbl m-auto ${
                                  cryptoData?.length <= 0
                                    ? 'disableTblEmptyList'
                                    : ''
                                }`}
                              >
                                <Table_Loader />{' '}
                              </div>
                            ) : (
                              <img
                                src='/assets/images/no-data.png'
                                alt='no data'
                              />
                            )}
                          </td>
                        </tr>
                      ) : (
                        ''
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
          <span className='modalCloseBtn' onClick={handleClose}>
            <i className='mdi mdi-close'></i>
          </span>
        </Modal.Header>
        <Modal.Body>
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
                    setFields({ ...fields, newPassword: e.target.value });
                  }}
                  placeholder={'New password'}
                  className='form-control'
                  onKeyUp={e => {
                    checkPass(e.target.value),
                      e.keyCode == 13 && handleSubmit();
                  }}
                />
                <div className='input-group-append curser-pointer'>
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
                  <i className='fa fa-check-circle' id='er1'></i> 1 Number
                </span>
                <span>
                  <i className='fa fa-check-circle' id='er5'></i> 1 Uppercase
                </span>
                <span>
                  <i className='fa fa-check-circle' id='er2'></i> 1 Lowercase
                </span>
                <span>
                  <i className='fa fa-check-circle' id='er3'></i> 1 Special
                  Character
                </span>
                <span>
                  <i className='fa fa-check-circle' id='er4'></i> Min 8 - 32 Max
                  Character
                </span>
              </span>
            </div>
          </div>
          <div className='mb-2'>
            <div>
              <label className='col-form-label'>Confirm Password</label>
            </div>
            <div className={`inputContainer  form-group d-flex w-100`}>
              <div className='input-group'>
                <input
                  type={showPwd['confirmPassword'] ? 'text' : 'password'}
                  name='confirmPassword'
                  value={fields['confirmPassword']}
                  onChange={e =>
                    setFields({ ...fields, confirmPassword: e.target.value })
                  }
                  placeholder={'Confirm password'}
                  className='form-control'
                  onKeyUp={e => e.keyCode == 13 && handleSubmit()}
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
              <label className='col-form-label'>Admin Password</label>
            </div>
            <div className={`inputContainer form-group d-flex w-100`}>
              <div className='input-group'>
                <input
                  type={showPwd['admPassword'] ? 'text' : 'password'}
                  name='admPassword'
                  value={fields['admPassword']}
                  onChange={e =>
                    setFields({ ...fields, admPassword: e.target.value })
                  }
                  placeholder={'Admin password'}
                  className='form-control'
                  onKeyUp={e => e.keyCode == 13 && handleSubmit()}
                />
                <div className='input-group-append'>
                  <div
                    className='input-group-text'
                    id='btnGroupAddon'
                    onClick={() => ClickOnEye('admPassword')}
                  >
                    {' '}
                    <i
                      className={`${`hideShow   mdi mdi-eye${
                        showPwd['admPassword'] ? '' : '-off'
                      } fs-4`}`}
                    ></i>{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-secondary waves-effect'
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type='submit'
            className='btn btn-bordered-primary waves-effect search-btn waves-light loadingButton'
            onClick={handleSubmit}
          >
            {' '}
            {loading && <Loader />} Submit
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoinList;
