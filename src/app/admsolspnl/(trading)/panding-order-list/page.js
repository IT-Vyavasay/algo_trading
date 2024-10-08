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
import 'flatpickr/dist/flatpickr.css';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
import ReactPaginate from 'react-paginate';
import Flatpickr from 'react-flatpickr';
const PandingOrderList = ({ option }) => {
  const tempOption = {
    title: '',
    setMultiLoader: {},
    multiLoader: { PandingOrderLoader: true },
  };
  const { title, setMultiLoader, multiLoader } = option ? option : tempOption;
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [orderClm, setOrderClm] = useState(9);
  const [searchLdr, setSearchLdr] = useState(false);
  const [notifyEmailList, setNotifyEmailList] = useState([]);
  const date = moment(new Date()).subtract(process.env.FILTERDAYS, 'days');
  const [startDate, setStartDate] = useState(date['_d']);
  const [endDate, setEndDate] = useState(date['_i']);
  const [search, setSearch] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const [dateRange, setDateRange] = useState(true);
  let st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000;
  let ed = endDate
    ? new Date(
        moment(moment(endDate).format('MM/DD/YYYY'))
          .add(23, 'h')
          .add(59, 'm')
          .add(59, 's'),
      ).getTime() / 1000
    : 0;

  const pagginationHandler = page => {
    var p = page.selected;
    setPage(p);
  };

  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectRecId, setSelectRecId] = useState('');
  const [coin_modal_data, set_coin_modal_data] = useState({});

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = coinData => {
    set_coin_modal_data({
      ...coinData,
      targetPrice: coinData.latestTradedPrice,
      tradOnLTP: 1,
      quantity: 1,
    });
    setShow(true);
  };

  const GetNotifyEmailList = async () => {
    if (!loader) {
      setLoader(true);
      const userData = JSON.stringify({
        page: page,
        order: order,
        orderColumn: orderClm,
        startDate: st,
        endDate: ed,
        search: search,
      });

      const getNotifyEmailList = await fetchApi(
        'trading/manage-trade/panding-order/panding-order-list',
        userData,
        'GET',
      );
      if (getNotifyEmailList.statusCode == 200) {
        setLoader(false);
        setSearchLdr(false);
        setTotalPage(getNotifyEmailList.data.total);
        setNotifyEmailList(getNotifyEmailList.data.data);
        setPageLoader(false);
      } else {
        setLoader(false);
        setSearchLdr(false);
        if (getNotifyEmailList.data.message == 'Unauthorized') {
          setAuthTkn(getNotifyEmailList.data.message);
        } else {
          setPageLoader(false);
          toast.error(getNotifyEmailList.data.message);
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
      GetNotifyEmailList();
    }
  };

  useEffect(() => {
    GetNotifyEmailList();
  }, [page, order, orderClm, multiLoader.PandingOrderLoader]);

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

  const getProfitLossBadge = (
    tradeType,
    targetPrice,
    latestTradedPrice,
    quantity = 1,
  ) => {
    if (tradeType == 0) {
      const total =
        parseFloat(latestTradedPrice - targetPrice) * parseInt(quantity);
      return (
        <span
          className={`badge bg-${total.toFixed(2) > 0 ? 'success' : 'danger'}`}
        >
          {total.toFixed(2)}
        </span>
      );
    } else {
      const total =
        parseFloat(targetPrice - latestTradedPrice) * parseInt(quantity);
      return (
        <span
          className={`badge bg-${total.toFixed(2) > 0 ? 'success' : 'danger'}`}
        >
          {total.toFixed(2)}
        </span>
      );
    }
  };
  const getProfitLoss = (
    tradeType,
    targetPrice,
    latestTradedPrice,
    quantity = 1,
  ) => {
    if (tradeType == 0) {
      const total =
        parseFloat(latestTradedPrice - targetPrice) * parseInt(quantity);
      return total.toFixed(2);
    } else {
      const total =
        parseFloat(targetPrice - latestTradedPrice) * parseInt(quantity);
      return total.toFixed(2);
    }
  };

  const handleSubmit = async data => {
    console.log(`datffffa`, data);
    if (!loading) {
      try {
        validate_string(`${data.symbole}`, 'symbole');
        validate_string(`${data.latestTradedPrice}`, 'latest tradedP price');
        validate_string(`${data.tradedQunaty}`, 'traded qunaty');
        validate_string(`${data.tradeTime}`, 'trade time');
        validate_string(`${data.tradeType}`, 'trade type');
        validate_string(`${data.tradOnLTP}`, 'tradOnLTP');
        validate_string(`${data.quantity}`, 'quantity');
        validate_string(`${data.targetPrice}`, 'target price');
        validate_string(`${data.uniqTradeId}`, 'uniq tradeId');
      } catch (e) {
        toast.error(e);
        return false;
      }

      setLoading(true);
      let bodyData = {
        symbole: data.symbole,
        latestTradedPrice: data.latestTradedPrice,
        tradedQunaty: data.tradedQunaty,
        tradeTime: data.tradeTime,
        tradeType: data.tradeType,
        tradOnLTP: data.tradOnLTP,
        quantity: data.quantity,
        targetPrice: data.targetPrice,
        uniqTradeId: data.uniqTradeId,
        id: data.id,
        executedPrice: getCoinDetails(data?.symbole, 'latestTradedPrice'),
        closedPrice: getCoinDetails(data?.symbole, 'latestTradedPrice'),
        table: 'pandingorder',
      };
      const add_user = await fetchApi(
        'trading/manage-trade/add-trade',
        JSON.stringify(bodyData),
      );
      setLoading(false);
      setSelectRecId('');
      GetNotifyEmailList();
      setMultiLoader({
        ...multiLoader,
        TradeLoader: !multiLoader.TradeLoader,
      });
      if (add_user?.statusCode == 200) {
        toast.success(add_user?.data?.message);
      } else {
        if (add_user.data.message == 'Unauthorized') {
          setAuthTkn(add_user.data.message);
        } else {
          toast.error(add_user.data.message);
        }
      }
    }
  };
  useEffect(() => {
    setPageLoader(false);
  }, []);

  function monitorCryptoPrices(cryptoList, n) {
    if (notifyEmailList?.length > 0) {
      // Check price fluctuation every second
      cryptoList.forEach((crypto, index) => {
        const currentPrice = getCoinDetails(
          crypto?.symbole,
          'latestTradedPrice',
        );

        // Calculate the price range
        const minPrice = currentPrice * (1 - n / 100);
        const maxPrice = currentPrice * (1 + n / 100);

        // Get the latest price of the crypto (You may need to call an API for this)
        const latestPrice = crypto?.targetPrice; // Dummy function for fetching the latest price
        // Check if the latest price is within the range
        if (latestPrice >= minPrice && latestPrice <= maxPrice) {
          // Execute the order if within range
          setCryptoData(cryptoData.filter(el => el.id != crypto.id));
          setSelectRecId(crypto.id);
          handleSubmit(crypto);
        }
      });
    }
    return null;
  }

  useEffect(() => {
    if (notifyEmailList?.length > 0) {
      monitorCryptoPrices(notifyEmailList, 0.1, (crypto, latestPrice) => {
        console.log(crypto);
      });
    }
  }, [cryptoData]);
  return (
    <div className='content-body btn-page'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className={`container-fluid ${title !== 'incard' && 'p-4'}`}>
        <div className='row'>
          {title !== 'incard' && (
            <h3 className='page-title-main' onClick={() => console.log(title)}>
              Panding Order List
            </h3>
          )}

          <div className={`col-lg-12 ${title == 'incard' && 'p-0'}`}>
            <div className={`card ${title !== 'incard' && 'mt-4 mb-4'} `}>
              <div className='card-header d-block'>
                {title == 'incard' && (
                  <div className='d-flex align-items-center '>
                    <span className='mdi mdi-allergy  dashboard-voucher-icon pl-0' />
                    <h3>Panding Order List</h3>
                  </div>
                )}
                <div className='row'>
                  <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                    <label className='form-label'>Ordered On</label>
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

                  <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                    <label className='form-label'>Symbole</label>
                    <input
                      type='text'
                      placeholder='Search'
                      className='form-control search-placeholder'
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div
                    className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6  my-2'
                    style={{ marginTop: '11px' }}
                  >
                    <label className='form-label text-white'>&nbsp;</label>
                    <br />
                    <button
                      className='loaderStyle btn btn-bordered-primary waves-effect search-btn waves-light'
                      onClick={() => {
                        serachList();
                      }}
                    >
                      {searchLdr ? (
                        <Loader />
                      ) : (
                        <i className='bx bx-search'></i>
                      )}{' '}
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className='card-body'>
                <div className='table-responsive position-relative'>
                  <table
                    className={`table table-striped ${
                      loader && 'tbl-overly'
                    }   `}
                  >
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(0, order == 0 ? 1 : 0)}
                        >
                          #
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-0'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-0'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(1, order == 0 ? 1 : 0)}
                        >
                          Symbole
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-1'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-1'></i>
                          </span>
                        </th>

                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Target Price
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                        >
                          Current Price
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Profit/Loss
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(4, order == 0 ? 1 : 0)}
                        >
                          Quantity
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-4'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-4'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(5, order == 0 ? 1 : 0)}
                        >
                          Trade On LTP
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-5'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-5'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(6, order == 0 ? 1 : 0)}
                        >
                          Trade Type
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-6'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-6'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(7, order == 0 ? 1 : 0)}
                        >
                          Trade Time
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-7'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-7'></i>
                          </span>
                        </th>

                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(9, order == 0 ? 1 : 0)}
                        >
                          Trade Executed On
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-9'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-9'></i>
                          </span>
                        </th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifyEmailList?.length > 0
                        ? notifyEmailList?.map((d, i) => {
                            return (
                              <tr key={i}>
                                <td className='text-center text-nowrap'>
                                  {d?.num}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.symbole ? d?.symbole : '-'}{' '}
                                </td>

                                <td className='text-center text-nowrap'>
                                  {d?.targetPrice ? d?.targetPrice : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {getCoinDetails(
                                    d?.symbole,
                                    'latestTradedPrice',
                                  )}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {getProfitLossBadge(
                                    d?.tradeType,
                                    d?.targetPrice,
                                    getCoinDetails(
                                      d?.symbole,
                                      'latestTradedPrice',
                                    ),
                                    d?.quantity,
                                  )}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.quantity ? d?.quantity : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.tradeOnLTP ? (
                                    <span className='badge bg-success'>
                                      Yes
                                    </span>
                                  ) : (
                                    <span className='badge bg-danger'>No</span>
                                  )}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.tradeType == 0 ? (
                                    <span className='badge bg-success'>
                                      Buy
                                    </span>
                                  ) : (
                                    <span className='badge bg-danger'>
                                      Sell
                                    </span>
                                  )}{' '}
                                </td>

                                <td className='text-center text-nowrap'>
                                  {d?.orderExecuteTime
                                    ? convert_date(d?.orderExecuteTime)
                                    : '-'}{' '}
                                </td>

                                <td
                                  className='text-center text-nowrap'
                                  onClick={() => console.log(d)}
                                >
                                  {convert_date(d.createdOn)}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  <div className='d-flex justify-content-start'>
                                    <div className='actionBtn'>
                                      {d?.tradeType == 1 ? (
                                        <button
                                          className='btn btn-success waves-effect waves-light'
                                          onClick={() => {
                                            setSelectRecId(d.id);
                                            handleSubmit(d);
                                          }}
                                          data-toggle='modal'
                                          data-target='#myModal'
                                        >
                                          {' '}
                                          <span className='btn-label'>
                                            {selectRecId == d.id ? (
                                              <i className='fa fa-spinner fa-spin'></i>
                                            ) : (
                                              <i className='mdi mdi-plus-circle-outline'></i>
                                            )}{' '}
                                          </span>{' '}
                                          Buy
                                        </button>
                                      ) : (
                                        <button
                                          className='btn btn-danger waves-effect waves-light'
                                          onClick={() => {
                                            setSelectRecId(d.id);
                                            handleSubmit(d);
                                          }}
                                          data-toggle='modal'
                                          data-target='#myModal'
                                        >
                                          {' '}
                                          <span className='btn-label'>
                                            {selectRecId == d.id ? (
                                              <i className='fa fa-spinner fa-spin'></i>
                                            ) : (
                                              <i className='mdi mdi-plus-circle-outline'></i>
                                            )}{' '}
                                          </span>{' '}
                                          Sell
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : ''}

                      {loader || notifyEmailList?.length <= 0 ? (
                        <tr>
                          <td
                            className={`text-center ${
                              notifyEmailList?.length <= 0
                                ? 'tableLoaderBox'
                                : ''
                            }`}
                            colSpan={12}
                          >
                            {loader ? (
                              <div
                                className={`disableTbl m-auto ${
                                  notifyEmailList?.length <= 0
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
                {notifyEmailList.length ? (
                  <div className='row mt-3 paginationBox'>
                    <ReactPaginate
                      breakLabel={'...'}
                      nextLabel={<i className='fa fa-angle-right'></i>}
                      previousLabel={<i className='fa fa-angle-left'></i>}
                      pageRangeDisplayed={5}
                      renderOnZeroPageCount={null}
                      activeClassName={'active'}
                      containerClassName={
                        'pagination pagination-sm pagination-gutter justify-content-end '
                      }
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      previousClassName={'page-item page-indicator'}
                      previousLinkClassName={'page-link'}
                      nextClassName={'page-item page-indicator'}
                      nextLinkClassName={'page-link'}
                      breakClassName={'page-item'}
                      breakLinkClassName={'page-link'}
                      forcePage={page}
                      pageCount={totalPage}
                      onPageChange={page => pagginationHandler(page)}
                    />
                  </div>
                ) : (
                  ''
                )}
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

export default PandingOrderList;
