'use client';

/*
 type: 1:buy, 2:sell,
 status: 1:close, 2:open,
*/
import {
  convertTime,
  formatToTwoDecimals,
  getCurrentTimestamp,
  uniqTransactionId,
} from '@/app/utils/common';
import { useEffect, useState } from 'react';

const LiveBTCPrice = () => {
  const [price, setPrice] = useState(0);
  const [limitPrice, setLimitPrice] = useState(price);
  const [algoTrade, setAlgoTrade] = useState(false);
  const [executedOrderList, setExecutedOrderList] = useState([]);
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
  const OnAutoOrder = ({ type, limit }) => {
    const newTrade = {
      type: type,
      tradeType: type == 2 ? 'sell' : 'buy',
      price: price,
      id: uniqTransactionId(),
      profit: 2,
      status: 2,
      time: getCurrentTimestamp(),
      limit: limit,
    };
    setAlgoOrderList([...algoOrderList, newTrade]);
  };

  const OnCloseTrade = ({ id }) => {
    if (algoTrade) {
      const updateTrade = algoOrderList.filter(trade => trade.id == id)[0];
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
    } else {
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

  return (
    <div class='container mt-5'>
      <div className='d-flex justify-content-between'>
        <div className='d-flex flex-column'>
          <h1>Live BTC/USDT Price</h1>
          {price ? <h2>{price} USDT</h2> : <p>Loading...</p>}
        </div>
        <div>
          <div class='form-check form-switch'>
            <input
              class='form-check-input'
              type='checkbox'
              onChange={() => setAlgoTrade(!algoTrade)}
              id='flexSwitchCheckChecked'
              defaultChecked={algoTrade}
            />
            <label class='form-check-label' for='flexSwitchCheckChecked'>
              {algoTrade ? 'Auto Trade' : 'Manual Trade'}{' '}
            </label>
          </div>
          <input
            className={algoTrade ? 'form-control' : 'd-none'}
            type='text'
            placeholder='Limit Price'
            value={limitPrice}
            onChange={e => setLimitPrice(e.target.value)}
          />
          <br />
          <button
            class='btn btn-success '
            onClick={() =>
              algoTrade
                ? OnAutoOrder({ type: 1, limit: limitPrice })
                : OnTrade({ type: 1 })
            }
          >
            Buy
          </button>
          &nbsp;&nbsp;
          <button
            class='btn btn-danger '
            onClick={() =>
              algoTrade
                ? OnAutoOrder({ type: 2, limit: limitPrice })
                : OnTrade({ type: 2 })
            }
          >
            Sell
          </button>
        </div>
      </div>
      <div>
        <h3 class='text-center mb-4'>Trade Records</h3>
        <div class='table-responsive'>
          <table class='table table-striped table-hover table-bordered text-center align-middle'>
            <thead class='table-dark'>
              <tr>
                <th scope='col'>Sr No.</th>
                <th scope='col'>Trade Type</th>
                <th scope='col'>LTP</th>
                <th scope='col'>Profit/Loss</th>
                <th scope='col'>Time</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((trade, index) => (
                <tr key={index}>
                  <td onClick={() => console.log(trade)}>{index + 1}</td>
                  <td>{trade.tradeType}</td>
                  <td>{formatToTwoDecimals(trade.price)}</td>
                  <td>
                    {formatToTwoDecimals(
                      trade.type == 1
                        ? price - trade.price
                        : trade.price - price,
                    )}
                  </td>
                  <td>{convertTime(trade.time)}</td>
                  <td>
                    {trade.status == 2 ? (
                      <button
                        class={`btn btn-sm ${algoTrade && 'd-none'} ${
                          trade.type !== 2 ? 'btn-danger' : 'btn-success'
                        }`}
                        onClick={() => OnCloseTrade({ id: trade.id })}
                      >
                        {trade.type == 2 ? 'Buy' : 'Sele'}
                      </button>
                    ) : (
                      formatToTwoDecimals(trade?.profit)
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colspan={6}>Auto trades</td>
              </tr>
              {algoOrderList.map((trade, index) => (
                <tr key={index}>
                  <td onClick={() => console.log(trade)}>{index + 1}</td>
                  <td>{trade.tradeType}</td>
                  <td>{formatToTwoDecimals(trade.price)}</td>
                  <td>
                    {formatToTwoDecimals(
                      trade.type == 1
                        ? price - trade.price
                        : trade.price - price,
                    )}
                  </td>
                  <td>{convertTime(trade.time)}</td>
                  <td>
                    {trade.status == 2 ? (
                      <button
                        class={`btn btn-sm ${!algoTrade && 'd-none'} ${
                          trade.type !== 2 ? 'btn-danger' : 'btn-success'
                        }`}
                        onClick={() => OnCloseTrade({ id: trade.id })}
                      >
                        {trade.type == 2 ? 'Buy' : 'Sele'}
                      </button>
                    ) : (
                      formatToTwoDecimals(trade?.profit)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 class='text-center mb-4'>Exacuted Trades</h3>
        <div class='table-responsive'>
          <table class='table table-striped table-hover table-bordered text-center align-middle'>
            <thead class='table-dark'>
              <tr>
                <th scope='col'>Sr No.</th>
                <th scope='col'>Trade Type</th>
                <th scope='col'>LTP</th>
                <th scope='col'>Executed Price</th>
                <th scope='col'>Time</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {executedOrderList.map((trade, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{trade.tradeType}</td>
                  <td>{formatToTwoDecimals(trade.price)}</td>
                  <td>{formatToTwoDecimals(trade.executedPrice)}</td>
                  <td>{convertTime(trade.time)}</td>
                  <td>{formatToTwoDecimals(trade?.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveBTCPrice;
