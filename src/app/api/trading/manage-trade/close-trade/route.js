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
      tradeClosePrice,
      executedPrice,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      tradeOpenPrice,
      id,
      table,
      uniqTradeId,
      stopLoss,
    } = await req.json();
    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${latestTradedPrice}`, 'latest tradedP price');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${profit}`, 'profit');
      validate_string(`${tradeClosePrice}`, 'closed price');
      validate_string(`${executedPrice}`, 'executed price');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${uniqTradeId}`, 'uniqTrade Id');
      validate_string(`${tradeOpenPrice}`, 'target price');
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
      tradeClosePrice =
        tradeClosePrice - (tradeClosePrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      tradeClosePrice =
        tradeClosePrice + (tradeClosePrice * brokerageData?.brokerage) / 100;
    }
    const isTradExist = await sql_query(
      'select * from closetrade where uniqTradeId = ?',
      [uniqTradeId],
    );

    if (!isTradExist) {
      await sql_query(
        'insert into closetrade (symbole,tradedPrice, uniqTradeId,tradeOpenPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,createdOn, profit, tradeClosePrice, executedPrice,stopLoss) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          symbole,
          latestTradedPrice,
          uniqTradeId,
          tradeOpenPrice,
          quantity,
          tradOnLTP,
          tradeType,
          tradeTime,
          now,
          now,
          profit,
          tradeClosePrice,
          executedPrice,
          stopLoss,
        ],
      );
      console.log('pand================================ingorder', table);
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
        { message: 'Order closed successfully' },
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
