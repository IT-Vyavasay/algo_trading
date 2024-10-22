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
const CloseTradeList = ({ option }) => {
  const tempOption = {
    title: '',
    setMultiLoader: {},
    multiLoader: { CloseTradeLoader: true },
  };
  const { title, setMultiLoader, multiLoader } = option ? option : tempOption;

  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [orderClm, setOrderClm] = useState(0);
  const [searchLdr, setSearchLdr] = useState(false);
  const [notifyEmailList, setNotifyEmailList] = useState([]);
  const date = moment(new Date()).subtract(process.env.FILTERDAYS, 'days');
  const [startDate, setStartDate] = useState(date['_d']);
  const [endDate, setEndDate] = useState(date['_i']);
  const [search, setSearch] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const [dateRange, setDateRange] = useState(true);
  let st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime();
  let ed = endDate
    ? new Date(
        moment(moment(endDate).format('MM/DD/YYYY'))
          .add(23, 'h')
          .add(59, 'm')
          .add(59, 's'),
      ).getTime()
    : 0;

  const pagginationHandler = page => {
    var p = page.selected;
    setPage(p);
  };

  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coin_modal_data, set_coin_modal_data] = useState({});

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async data => {
    console.log(data);
    if (!loading) {
      try {
        validate_string(`${coin_modal_data.symbole}`, 'symbole');
        validate_string(
          `${coin_modal_data.latestTradedPrice}`,
          'latest tradedP price',
        );
        validate_string(`${coin_modal_data.tradedQunaty}`, 'traded qunaty');
        validate_string(`${coin_modal_data.tradeTime}`, 'trade time');
        validate_string(`${coin_modal_data.tradeType}`, 'trade type');
        validate_string(`${coin_modal_data.tradOnLTP}`, 'tradOnLTP');
        validate_string(`${coin_modal_data.quantity}`, 'quantity');
        validate_string(
          `${coin_modal_data.selectedEntryPrice}`,
          'target price',
        );
      } catch (e) {
        toast.error(e);
        return false;
      }

      setLoading(true);
      let bodyData = {
        symbole: coin_modal_data.symbole,
        latestTradedPrice: coin_modal_data.latestTradedPrice,
        tradedQunaty: coin_modal_data.tradedQunaty,
        tradeTime: coin_modal_data.tradeTime,
        tradeType: coin_modal_data.tradeType,
        tradOnLTP: coin_modal_data.tradOnLTP,
        quantity: coin_modal_data.quantity,
        selectedEntryPrice: coin_modal_data.selectedEntryPrice,
      };
      const add_user = await fetchApi(
        'trading/manage-trade/add-trade',
        JSON.stringify(bodyData),
      );
      setLoading(false);
      if (add_user?.statusCode == 200) {
        toast.success(add_user?.data?.message);
        set_coin_modal_data({});
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
        'trading/manage-trade/close-trade/close-trade-list',
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
  }, [page, order, orderClm, multiLoader.CloseTradeLoader]);

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

  const getProfitLoss = (
    tradeType,
    selectedEntryPrice,
    latestTradedPrice,
    quantity = 1,
  ) => {
    if (tradeType == 0) {
      const total =
        parseFloat(latestTradedPrice - selectedEntryPrice) * parseInt(quantity);
      return total.toFixed(2);
    } else {
      const total =
        parseFloat(selectedEntryPrice - latestTradedPrice) * parseInt(quantity);
      return total.toFixed(2);
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
              Closed Trade List
            </h3>
          )}
          <div className={`col-lg-12 ${title == 'incard' && 'p-0'}`}>
            <div className={`card ${title !== 'incard' && 'mt-4 mb-4'} `}>
              <div className='card-header d-block'>
                {title == 'incard' && (
                  <div className='d-flex align-items-center '>
                    <span className='mdi mdi-lock  dashboard-voucher-icon pl-0' />
                    <h3> Closed Trade List</h3>
                  </div>
                )}
                <div className='row'>
                  <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                    <label className='form-label'>Subscribe On</label>
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
                        >
                          Current Price
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Selected Entry Price
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Actual Entry Price
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          closedPrice
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Target
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
                        </th>
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Stop Loss
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3'></i>
                          </span>
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
                          onClick={() => sortData(3, order == 0 ? 1 : 0)}
                        >
                          Profit/Loss
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
                        <th
                          scope='col'
                          className='text-center cursor-pointer text-nowrap'
                          onClick={() => sortData(6, order == 0 ? 1 : 0)}
                        >
                          Trade Method
                          <span className='iconPosition'>
                            <i className='fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-6'></i>
                            <i className='fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-6'></i>
                          </span>
                        </th>
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
                                  {getCoinDetails(
                                    d?.symbole,
                                    'latestTradedPrice',
                                  )}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.selectedEntryPrice
                                    ? d?.selectedEntryPrice
                                    : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.actualEntryPrice
                                    ? d?.actualEntryPrice
                                    : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.closedPrice ? d?.closedPrice : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.targetPrice ? d?.targetPrice : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.stopLoss ? d?.stopLoss : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.quantity ? d?.quantity : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  <span
                                    className={`badge bg-${
                                      d?.profit < 0 ? 'danger' : 'success'
                                    }`}
                                  >
                                    {d?.profit}
                                  </span>
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
                                  {d?.tradeTime
                                    ? convert_date_upto_second(d?.tradeTime)
                                    : '-'}{' '}
                                </td>
                                <td className='text-center text-nowrap'>
                                  {d?.orderExecuteTime
                                    ? convert_date_upto_second(
                                        d?.orderExecuteTime,
                                      )
                                    : '-'}{' '}
                                </td>

                                <td className='text-center text-nowrap'>
                                  {d?.tradeMethod == 0 ? (
                                    <span className='badge bg-success'>
                                      Normal
                                    </span>
                                  ) : (
                                    <span className='badge bg-danger'>
                                      Algo
                                    </span>
                                  )}{' '}
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
                            colSpan={13}
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
                      value={coin_modal_data?.selectedEntryPrice}
                      type='text'
                      onChange={e =>
                        set_coin_modal_data({
                          ...coin_modal_data,
                          selectedEntryPrice: e.target.value
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

export default CloseTradeList;
