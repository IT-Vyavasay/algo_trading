'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coin_modal_data, set_coin_modal_data] = useState({});
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
  const handleShow = coinData => {
    set_coin_modal_data({
      ...coinData,
      targetPrice: coinData.price,
      tradOnLTP: 1,
      quantity: 1,
    });
    setShow(true);
  };

  const handleSubmit = data => {
    console.log(data);
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
        text: `You want to change password for ${`trade_type`}.`,
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
            userId: coin_modal_data,
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
        latestTradedPrice: newPrice,
        tradedQunaty: data.q,
        tradeTime: parseInt(data.T),
      };
      setCryptoData([cryptoObj]);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);
  const getCoinDetails = (symbole, field = 'latestTradedPrice') => {
    try {
      return cryptoData.filter(el => el.symbole == symbole)[0][field];
    } catch (error) {
      return 0;
    }
  };
  useEffect(() => {
    setPageLoader(false);
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
                <div className='row'></div>
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
                                  {d.latestTradedPrice}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.tradedQunaty}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d.tradeTime
                                    ? convert_date_upto_second(d.tradeTime)
                                    : '-'}
                                </td>

                                <td className='text-center text-nowrap'>
                                  <div className='d-flex justify-content-start'>
                                    <div className='actionBtn'>
                                      <button
                                        className='btn btn-success waves-effect waves-light'
                                        onClick={() =>
                                          handleShow({ ...d, tradeType: 'buy' })
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
                                            ...d,
                                            tradeType: 'sell',
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
          <Modal.Title onClick={() => console.log(coin_modal_data)}>
            {coin_modal_data?.tradeType == 'buy' ? 'Buy' : 'Sell'}{' '}
            {coin_modal_data?.symbole}
          </Modal.Title>
          <span className='modalCloseBtn' onClick={handleClose}>
            <i className='mdi mdi-close'></i>
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-2'>
            <div>
              <label className='col-form-label'>LTP</label>
            </div>
            <div className={`inputContainer form-group d-flex w-100`}>
              <div className='input-group'>
                <input
                  name='ltp'
                  value={getCoinDetails(
                    coin_modal_data?.symbole,
                    'latestTradedPrice',
                  )}
                  type='text'
                  className='form-control'
                  disabled
                />
                <div className='input-group-append'>
                  <div className='input-group-text' id='btnGroupAddon'>
                    <i className={`${`   mdi mdi-currency-usd  fs-4`}`}></i>{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='  d-flex justify-content-between align-items-center'>
            <div>
              <label className='col-form-label'>Order on Current Price</label>
            </div>

            <span
              className={coin_modal_data.tradOnLTP == 0 ? 'togggleOff' : ''}
              onClick={() =>
                set_coin_modal_data({
                  ...coin_modal_data,
                  tradOnLTP: coin_modal_data.tradOnLTP == 1 ? 0 : 1,
                })
              }
            >
              <span className='switchery switchery-small'>
                <small></small>
              </span>
              <input
                type='checkbox'
                defaultChecked={false}
                data-plugin='switchery'
                data-color='#ff7aa3'
                className='d-none'
                data-switchery='true'
              />
            </span>
          </div>

          {coin_modal_data.tradOnLTP == 0 && (
            <>
              <div className='mb-2'>
                <div>
                  <label className='col-form-label'>Enter Target Price</label>
                </div>
                <div className={`inputContainer form-group d-flex w-100`}>
                  <div className='input-group'>
                    <input
                      name='ltp'
                      value={coin_modal_data?.targetPrice}
                      type='text'
                      onChange={e =>
                        set_coin_modal_data({
                          ...coin_modal_data,
                          targetPrice: e.target.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1'),
                        })
                      }
                      className='form-control'
                    />
                    <div className='input-group-append'>
                      <div className='input-group-text' id='btnGroupAddon'>
                        <i className={`${`   mdi mdi-currency-usd  fs-4`}`}></i>{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className='mb-2'>
            <div>
              <label className='col-form-label'>Quantity</label>
            </div>
            <div className={`inputContainer form-group d-flex w-100`}>
              <div className='input-group'>
                <input
                  name='ltp'
                  value={coin_modal_data?.quantity}
                  type='text'
                  className='form-control'
                  onChange={e => {
                    set_coin_modal_data({
                      ...coin_modal_data,
                      quantity: e.target.value
                        .replace(/[^0-9.]/g, '')
                        .replace(/(\..*)\./g, '$1'),
                    });
                  }}
                />
                <div className='input-group-append'>
                  <div className='input-group-text' id='btnGroupAddon'>
                    <i
                      className={`${`   mdi mdi-plus-box-multiple  fs-4`}`}
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
            className={`btn btn-bordered-${
              coin_modal_data?.tradeType == 'buy' ? 'success' : 'danger'
            } waves-effect search-btn waves-light loadingButton`}
            onClick={() => handleSubmit(coin_modal_data)}
          >
            {' '}
            {loading && <Loader />}{' '}
            {coin_modal_data?.tradeType == 'buy' ? 'Buy' : 'Sell'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoinList;
