import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../../../utils/backend';
import {
  convert_date_upto_second,
  get_timestemp,
  validate_string,
} from '../../../../../utils/common';
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
      tradedQuntity,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      tradeOpenPrice,
      table,
      id,
      uniqTradeId,
      tradeMethod,
      tradeClosePrice,
      stopLoss,
    } = await req.json();

    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${latestTradedPrice}`, 'latest tradedP price');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${tradeOpenPrice}`, 'target price');
      validate_string(`${uniqTradeId}`, 'uniq tradeId');
      validate_string(`${tradeMethod}`, 'trade method');
      validate_string(`${tradeClosePrice}`, 'close target');
      validate_string(`${stopLoss}`, 'stopLoss');
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
      tradeOpenPrice =
        tradeOpenPrice + (tradeOpenPrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      tradeOpenPrice =
        tradeOpenPrice - (tradeOpenPrice * brokerageData?.brokerage) / 100;
    }
    console.log({
      tradeTime: `${tradeTime}----------11-------${convert_date_upto_second(
        tradeTime,
      )}`,
      now: `${now}--------11-------${convert_date_upto_second(now)}`,
    });
    const isTradExist = await sql_query(
      'select * from activetrade where uniqTradeId = ?',
      [uniqTradeId],
    );

    if (!isTradExist) {
      await sql_query(
        'insert into activetrade (symbole,tradedPrice, uniqTradeId,tradeOpenPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,tradeMethod,tradeClosePrice,stopLoss,createdOn) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
          tradeMethod,
          tradeClosePrice,
          stopLoss,
          now,
        ],
      );
      if (table == 'pandingorder') {
        await sql_query('delete from pandingorder where activeTradeId = ?', [
          id,
        ]);
      }

      console.log({
        tradeTime: `${tradeTime}------22-----------${convert_date_upto_second(
          tradeTime,
        )}`,
        now: `${now}----22-----------${convert_date_upto_second(now)}`,
      });
      return NextResponse.json(
        { message: 'Order executed successfully' },
        { status: 200 },
      );
    }
    if (table == 'pandingorder') {
      await sql_query('delete from pandingorder where activeTradeId = ?', [id]);
    }
    return NextResponse.json(
      { message: 'Order already executeded' },
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
