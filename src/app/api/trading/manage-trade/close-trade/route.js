import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../../../utils/backend';
import { get_timestemp, validate_string } from '../../../../../utils/common';
import { sql_query } from '../../../../../utils/dbconnect';
export async function POST(req, res) {
  try {
    let adm = await check_admin_login(req);
    if (!adm.status || !adm.data.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    let {
      symbole,
      latestTradedPrice,
      profit,
      executedPrice,
      closedPrice,
      targetPrice,
      actualEntryPrice,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      selectedEntryPrice,
      id,
      table,
      uniqTradeId,
      stopLoss,
      message,
    } = await req.json();

    const parseData = JSON.stringify({
      symbole,
      latestTradedPrice,
      profit,
      executedPrice,
      closedPrice,
      targetPrice,
      actualEntryPrice,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      selectedEntryPrice,
      id,
      table,
      uniqTradeId,
      stopLoss,
      message,
    });
    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${latestTradedPrice}`, 'latest tradedP price');
      validate_string(`${executedPrice}`, 'executedPrice');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${closedPrice}`, 'closedPrice');
      validate_string(`${profit}`, 'profit');
      validate_string(`${targetPrice}`, 'closed price');
      validate_string(`${actualEntryPrice}`, 'actual Entry Price');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${message}`, 'message');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${uniqTradeId}`, 'uniqTrade Id');
      validate_string(`${selectedEntryPrice}`, 'selected Entry Price');
      validate_string(`${stopLoss}`, 'stopLoss');
      validate_string(id ? `${id}` : '', 'record id');
    } catch (e) {
      console.log('first', e);
      return NextResponse.json({ message: e }, { status: 400 });
    }
    let now = get_timestemp();
    const brokerageData = await sql_query(
      'select brokerage from tblslr_admin where slrAdminId = ? ',
      [adm.data.id],
    );

    if (tradeType == 0) {
      targetPrice =
        targetPrice - (targetPrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      targetPrice =
        targetPrice + (targetPrice * brokerageData?.brokerage) / 100;
    }
    const isTradExist = await sql_query(
      'select * from closetrade where uniqTradeId = ?',
      [uniqTradeId],
    );

    if (!isTradExist) {
      await sql_query(
        'insert into closetrade (symbole,executedPrice,closedPrice, tradedPrice, uniqTradeId,selectedEntryPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,createdOn, profit, targetPrice, actualEntryPrice,stopLoss) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          symbole,
          executedPrice,
          closedPrice,
          latestTradedPrice,
          uniqTradeId,
          selectedEntryPrice,
          quantity,
          tradOnLTP,
          tradeType,
          tradeTime,
          now,
          now,
          profit,
          targetPrice,
          actualEntryPrice,
          stopLoss,
        ],
      );
      if (table == 'pandingorder') {
        await sql_query('delete from pandingorder where activeTradeId = ?', [
          id,
        ]);
        console.log('order deleted from pandingorder');
      } else {
        await sql_query('delete from activetrade where activeTradeId = ?', [
          id,
        ]);
        console.log('order deleted from activetrade');
      }
      return NextResponse.json(
        { message: message ?? 'Order closed successfully', parseData },
        { status: 200 },
      );
    }
    if (table == 'pandingorder') {
      await sql_query('delete from pandingorder where activeTradeId = ?', [id]);
      console.log('order deleted from pandingorder');
    } else {
      await sql_query('delete from activetrade where activeTradeId = ?', [id]);
      console.log('order deleted from activetrade');
    }
    return NextResponse.json(
      { message: 'Order already in colsed' },
      { status: 400 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 400 },
    );
  }
}
