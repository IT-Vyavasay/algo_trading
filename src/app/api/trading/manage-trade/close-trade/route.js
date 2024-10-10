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
      closedPrice,
      executedPrice,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      targetPrice,
      id,
      table,
    } = await req.json();
    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${latestTradedPrice}`, 'latest tradedP price');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${profit}`, 'profit');
      validate_string(`${closedPrice}`, 'closed price');
      validate_string(`${executedPrice}`, 'executed price');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${targetPrice}`, 'target price');
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
    console.log('brokerage', brokerageData?.brokerage);

    if (tradeType == 0) {
      closedPrice =
        closedPrice - (closedPrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      closedPrice =
        closedPrice + (closedPrice * brokerageData?.brokerage) / 100;
    }

    await sql_query(
      'insert into closetrade (symbole,tradedPrice, uniqTradeId,targetPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,createdOn, profit, closedPrice, executedPrice) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        symbole,
        latestTradedPrice,
        uniqTradeId,
        targetPrice,
        quantity,
        tradOnLTP,
        tradeType,
        tradeTime,
        now,
        now,
        profit,
        closedPrice,
        executedPrice,
      ],
    );
    if (table == 'pandingorder') {
      await sql_query('delete from pandingorder where activeTradeId = ?', [id]);
    } else {
      await sql_query('delete from activetrade where activeTradeId = ?', [id]);
    }
    return NextResponse.json(
      { message: 'Order closed successfully' },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 400 },
    );
  }
}
