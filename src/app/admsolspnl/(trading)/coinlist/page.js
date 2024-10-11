'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import Table_Loader from '../../../../components/include/TableLoader';
import {
  chk_password,
  convert_date,
  convert_date_upto_second,
  generateTradeId,
  validate_string,
} from '../../../../utils/common';
import { fetchApi } from '../../../../utils/frondend';
import Loader from '../../../../components/include/Loader';
import { useAuthContext } from '../../../../context/auth';
import Modal from 'react-bootstrap/Modal';
const CoinList = ({ option }) => {
  const tempOption = {
    title: '',
    setMultiLoader: {},
    multiLoader: { TradeLoader: true },
  };
  const { title, setMultiLoader, multiLoader } = option ? option : tempOption;
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
  const [orderExeutionPrice, setOrderExeutionPrice] = useState({
    stopLoss: 0,
    tradeClosePrice: 0,
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
      tradeOpenPrice: coinData.latestTradedPrice,
      tradOnLTP: 1,
      quantity: 1,
      tradeMethod: 1,
      tradeClosePrice: coinData.latestTradedPrice,
      stopLoss: coinData.latestTradedPrice,
    });
    setOrderExeutionPrice({
      stopLoss: 0,
      tradeClosePrice: 0,
    });
    setShow(true);
  };
  useEffect(() => {
    const currentPrice = parseFloat(
      getCoinDetails(coin_modal_data?.symbole, 'latestTradedPrice'),
    );

    const stopLosssFloat = parseFloat(
      orderExeutionPrice.stopLoss != '' ? orderExeutionPrice.stopLoss : 0,
    );

    const tradeClosePriceFloat = parseFloat(
      orderExeutionPrice.tradeClosePrice != ''
        ? orderExeutionPrice.tradeClosePrice
        : 0,
    );
    console.log(
      currentPrice,
      parseFloat(
        orderExeutionPrice.stopLoss != '' ? orderExeutionPrice.stopLoss : 0,
      ),
    );

    set_coin_modal_data({
      ...coin_modal_data,
      stopLoss: parseFloat(
        currentPrice - (currentPrice * stopLosssFloat) / 100,
      ).toFixed(2),

      tradeClosePrice: parseFloat(
        currentPrice + (currentPrice * tradeClosePriceFloat) / 100,
      ).toFixed(2),
    });
  }, [orderExeutionPrice]);
  const handleSubmit = async data => {
    if (!loading) {
      try {
        validate_string(`${data.symbole}`, 'symbole');
        validate_string(`${data.latestTradedPrice}`, 'latest tradedP price');
        validate_string(`${data.tradeTime}`, 'trade time');
        validate_string(`${data.tradeType}`, 'trade type');
        validate_string(`${data.tradOnLTP}`, 'tradOnLTP');
        validate_string(`${data.quantity}`, 'quantity');
        validate_string(`${data.tradeOpenPrice}`, 'target price');
        validate_string(`${data.tradeMethod}`, 'trade method');
        validate_string(`${data.tradeClosePrice}`, 'close target');
        validate_string(`${data.stopLoss}`, 'stopLoss');
      } catch (e) {
        toast.error(e);
        return false;
      }

      setLoading(true);
      let bodyData = {
        symbole: data.symbole,
        latestTradedPrice: data.latestTradedPrice,
        quantity: data.quantity,
        tradeTime: data.tradeTime,
        tradeType: data.tradeType == 'buy' ? 0 : 1,
        tradOnLTP: data.tradOnLTP,
        tradeOpenPrice: getCoinDetails(
          coin_modal_data?.symbole,
          'latestTradedPrice',
        ),
        uniqTradeId: generateTradeId(data.latestTradedPrice),
        tradeMethod: data.tradeMethod,
        tradeClosePrice: data.tradeClosePrice,
        stopLoss: data.tradeMethod == 0 ? 0 : data.stopLoss,
      };
      const add_user = await fetchApi(
        data.tradOnLTP == 1
          ? 'trading/manage-trade/add-trade'
          : 'trading/manage-trade/panding-order/add-panding-order',
        JSON.stringify(bodyData),
      );
      setLoading(false);
      if (add_user?.statusCode == 200) {
        toast.success(add_user?.data?.message);
        set_coin_modal_data({});
        const loadeData =
          data.tradOnLTP == 1 ? 'TradeLoader' : 'PandingOrderLoader';
        setMultiLoader({
          ...multiLoader,
          [loadeData]: !multiLoader[loadeData],
        });
        handleClose();
      } else {
        if (add_user.data.message == 'Unauthorized') {
          setAuthTkn(add_user.data.message);
        } else {
          toast.error(add_user.data.message);
        }
      }
    }
  };

  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
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
      <div className={`container-fluid ${title !== 'incard' && 'p-4'}`}>
        <div className='row'>
          {title !== 'incard' && (
            <h3 className='page-title-main' onClick={() => console.log(title)}>
              Manage Coin
            </h3>
          )}

          <div className={`col-lg-12 ${title == 'incard' && 'p-0'}`}>
            <div className={`card ${title !== 'incard' && 'mt-4 mb-4'} `}>
              {title == 'incard' && (
                <div className='card-header d-flex align-items-center '>
                  <span className='mdi mdi-bitcoin  dashboard-voucher-icon' />
                  <h3> Manage Coin</h3>
                </div>
              )}
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
                                      <button
                                        className='btn btn-secondary waves-effect waves-light'
                                        onClick={() =>
                                          handleShow({
                                            ...d,
                                            tradeType: 'combo',
                                          })
                                        }
                                        data-toggle='modal'
                                        data-target='#myModal'
                                      >
                                        {' '}
                                        <span className='btn-label'>
                                          <i className='mdi mdi-plus-box-multiple'></i>
                                        </span>{' '}
                                        Combo
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
            {coin_modal_data?.tradeType == 'buy'
              ? 'Buy'
              : coin_modal_data?.tradeType == 'combo'
              ? 'Combo'
              : 'Sell'}{' '}
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
                      value={coin_modal_data?.tradeOpenPrice}
                      type='text'
                      onChange={e =>
                        set_coin_modal_data({
                          ...coin_modal_data,
                          tradeOpenPrice: e.target.value
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

          <div className='  d-flex justify-content-between align-items-center'>
            <div>
              <label className='col-form-label'>Is this algoTrade?</label>
            </div>

            <span
              className={coin_modal_data.tradeMethod == 0 ? 'togggleOff' : ''}
              onClick={() =>
                set_coin_modal_data({
                  ...coin_modal_data,
                  tradeMethod: coin_modal_data.tradeMethod == 1 ? 0 : 1,
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
          {coin_modal_data.tradeMethod == 1 && (
            <>
              <div className='mb-2'>
                <div>
                  <label className='col-form-label'>
                    Enter Close Target Price
                  </label>
                </div>
                <div className={`inputContainer form-group d-flex w-100`}>
                  <div className='input-group'>
                    <input
                      name='ltp'
                      value={coin_modal_data?.tradeClosePrice}
                      type='text'
                      onChange={e =>
                        set_coin_modal_data({
                          ...coin_modal_data,
                          tradeClosePrice: e.target.value
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
              <div className='mb-2'>
                <div>
                  <label className='col-form-label'>Enter Stoploss Price</label>
                </div>
                <div className={`inputContainer form-group d-flex w-100`}>
                  <div className='input-group'>
                    <input
                      name='ltp'
                      value={coin_modal_data?.stopLoss}
                      type='text'
                      onChange={e =>
                        set_coin_modal_data({
                          ...coin_modal_data,
                          stopLoss: e.target.value
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
              <div className='mb-2'>
                <div>
                  <label className='col-form-label'>
                    Stoploss/Target in prc
                  </label>
                </div>

                <div className={`inputContainer form-group d-flex w-100`}>
                  <div className='input-group'>
                    <input
                      name='stoploss in prc'
                      value={orderExeutionPrice.stopLoss}
                      type='text'
                      onChange={e =>
                        setOrderExeutionPrice({
                          ...orderExeutionPrice,
                          stopLoss: e.target.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1'),
                        })
                      }
                      className='form-control'
                    />
                    <input
                      name='close target in prc'
                      value={orderExeutionPrice.tradeClosePrice}
                      type='text'
                      onChange={e =>
                        setOrderExeutionPrice({
                          ...orderExeutionPrice,
                          tradeClosePrice: e.target.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1'),
                        })
                      }
                      className='form-control'
                    />

                    <div className='input-group-append'>
                      <div className='input-group-text' id='btnGroupAddon'>
                        <i className={`${`   mdi mdi-percent  fs-4`}`}></i>{' '}
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
            onClick={() => {
              coin_modal_data?.tradeType == 'combo'
                ? handleSubmit({ ...coin_modal_data, tradeType: 'buy' }) &&
                  handleSubmit({ ...coin_modal_data, tradeType: 'sell' })
                : handleSubmit(coin_modal_data);
            }}
          >
            {' '}
            {loading && <Loader />}{' '}
            {coin_modal_data?.tradeType == 'buy'
              ? 'Buy'
              : coin_modal_data?.tradeType == 'combo'
              ? 'Combo Trade'
              : 'Sell'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoinList;
