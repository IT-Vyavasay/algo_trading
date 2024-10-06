'use client';

import {
  convertTime,
  formatToTwoDecimals,
  getCurrentTimestamp,
  uniqTransactionId,
} from '@/utils/common';
/*
 type: 1:buy, 2:sell,
 status: 1:close, 2:open,
*/

import { useEffect, useState } from 'react';
const HomePage = () => {
  const [price, setPrice] = useState(0);
  const [limitPrice, setLimitPrice] = useState(price);
  const [profitTarget, setProfitTarget] = useState(5);
  const [algoTrade, setAlgoTrade] = useState(true);
  const [executedOrderList, setExecutedOrderList] = useState([]);
  const [pandingOrderList, setPandingOrderList] = useState([]);
  const [algoOrderList, setAlgoOrderList] = useState([
    {
      type: 1,
      tradeType: 'buy',
      price: '60915.71',
      id: '172667fnss',
      profit: 2,
      status: 2,
      time: 1726677180,
      limit: '60955.71',
    },
  ]);
  const [orderList, setOrderList] = useState([
    {
      type: 2,
      tradeType: 'buy',
      price: 12,
      id: '172666NDWP',
      profit: 2,
      status: 2,
      time: 1726672272,
    },
    {
      type: 1,
      tradeType: 'buy',
      price: 12,
      id: '172666NDWP',
      profit: 112,
      status: 1,
      time: 1726672272,
    },
  ]);
  const OnTrade = ({ type }) => {
    const newTrade = {
      type: type,
      tradeType: type == 2 ? 'sell' : 'buy',
      price: price,
      id: uniqTransactionId(),
      profit: 2,
      status: 2,
      time: getCurrentTimestamp(),
    };
    setOrderList([...orderList, newTrade]);
  };
  const OnAutoOrder = ({ type, limit, id, index = '' }) => {
    const newTrade = {
      type: type,
      tradeType: type == 2 ? 'sell' : 'buy',
      price: price,
      id: uniqTransactionId(index),
      profit: 2,
      status: 2,
      time: getCurrentTimestamp(),
      limit: limit,
    };
    setAlgoOrderList([...algoOrderList, newTrade]);
    setPandingOrderList(pandingOrderList.filter(trade => trade.id !== id));
  };
  const OnPandingOrder = ({ type, limit, index = '' }) => {
    const newTrade = {
      type: type,
      tradeType: type == 2 ? 'sell' : 'buy',
      price: price,
      id: uniqTransactionId(index),
      profit: 2,
      status: 2,
      time: getCurrentTimestamp(),
      limit: limit,
    };
    setPandingOrderList([...pandingOrderList, newTrade]);
  };

  const OnCloseTrade = ({ id }) => {
    const updateTrade = algoOrderList.filter(trade => trade.id == id)[0];
    const updateTrade2 = orderList.filter(trade => trade.id == id)[0];
    console.log(algoTrade, updateTrade);
    if (algoTrade && updateTrade) {
      setExecutedOrderList([
        ...executedOrderList,
        {
          ...updateTrade,
          status: 1,
          executedPrice: price,
          executedTime: getCurrentTimestamp(),
          profit:
            updateTrade.type == 2
              ? updateTrade.price - price
              : price - updateTrade.price,
        },
      ]);
      setAlgoOrderList(algoOrderList.filter(trade => trade.id !== id));
    } else if (updateTrade2) {
      console.log('2nd', orderList, id);
      const updateTrade = orderList.filter(trade => trade.id == id)[0];
      setExecutedOrderList([
        ...executedOrderList,
        {
          ...updateTrade,
          status: 1,
          executedPrice: price,
          executedTime: getCurrentTimestamp(),
          profit:
            updateTrade.type == 2
              ? updateTrade.price - price
              : price - updateTrade.price,
        },
      ]);
      setOrderList(orderList.filter(trade => trade.id !== id));
    }
  };

  useEffect(() => {
    // Create a new WebSocket connection
    const socket = new WebSocket(
      'wss://stream.binance.com:9443/ws/btcusdt@trade',
    );

    // Listen for messages from the server
    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      const currentPrice = parseFloat(data.p).toFixed(2); // Price is in the 'p' field
      setPrice(currentPrice);
    };

    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    if (algoTrade) {
      setLimitPrice(price);
    }
  }, [algoTrade]);
  useEffect(() => {
    if (algoTrade && pandingOrderList.length > 0) {
      for (let index = 0; index < pandingOrderList.length; index++) {
        // const element = array[index];
        const element = pandingOrderList[index];
        if (element.type == 1 && price - element.limit > 0) {
          OnAutoOrder({
            type: element.type,
            limit: element.limit,
            id: element.id,
          });
        } else if (element.type == 2 && element.limit - price > 0) {
          OnAutoOrder({
            type: element.type,
            limit: element.limit,
            id: element.id,
          });
        }
      }
    }
  }, [price]);
  useEffect(() => {
    if (algoTrade && algoOrderList.length > 0) {
      for (let index = 0; index < algoOrderList.length; index++) {
        // const element = array[index];
        const element = algoOrderList[index];
        // save from loss
        if (element.type == 1 && price - element.price < 0) {
          OnCloseTrade({ id: element.id });
        } else if (element.type == 2 && element.price - price < 0) {
          OnCloseTrade({ id: element.id });
        }
        // take profit
        if (element.type == 1 && price - element.price > profitTarget) {
          OnCloseTrade({ id: element.id });
        } else if (element.type == 2 && element.price - price > profitTarget) {
          OnCloseTrade({ id: element.id });
        }
      }
    }
  }, [price]);

  useEffect(() => {
    setLimitPrice(price);
  }, [price]);
  return (
    <>
      <div className='page-body'>
        <div className='container-fluid'>
          <div className='page-title'>
            <div className='row'>
              <div className='col-6'>
                <h4>Crypto</h4>
              </div>
              <div className='col-6'>
                <ol className='breadcrumb'>
                  <li className='breadcrumb-item'>
                    <a href='index.html'>
                      <svg className='stroke-icon'>
                        <use href='/assets/svg/icon-sprite.svg#stroke-home'></use>
                      </svg>
                    </a>
                  </li>
                  <li className='breadcrumb-item'>Dashboard</li>
                  <li className='breadcrumb-item active'>Crypto</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid starts--> */}
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card-header card-no-border'>
                  <div className='header-top'>
                    <h5>My Currencies</h5>
                  </div>
                </div>
                <div className='card-body pt-0'>
                  <div className='recent-table table-responsive currency-table'>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th className='f-light'>Coin Name</th>
                          <th className='f-light'>Price</th>

                          <th className='f-light'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className='d-flex align-items-center gap-2'>
                              <div className='currency-icon warning'>
                                <svg>
                                  <use href='/assets/svg/icon-sprite.svg#beta'></use>
                                </svg>
                              </div>
                              <div>
                                <h6 className='f-14 mb-0 f-w-400'>Bitcoin</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className='priceBox'>
                              ${parseFloat(price).toFixed(4)}
                            </span>
                          </td>

                          <td>
                            <button className='btn button-primary'>
                              Trade
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid Ends--> */}
      </div>
    </>
  );
};

export default HomePage;
