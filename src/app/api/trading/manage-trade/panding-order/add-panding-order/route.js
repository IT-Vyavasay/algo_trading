import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../../../../utils/backend';
import { get_timestemp, validate_string } from '../../../../../../utils/common';
import { sql_query } from '../../../../../../utils/dbconnect';
export async function POST(req, res) {
  try {
    let adm = await check_admin_login(req);
    if (!adm.status || !adm.data.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    let {
      symbole,
      actualEntryPrice,
      tradedQuntity,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      selectedEntryPrice,
      uniqTradeId,
      tradeMethod,
      targetPrice,
      stopLoss,
    } = await req.json();
    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${actualEntryPrice}`, 'latest tradedP price');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${selectedEntryPrice}`, 'target price');
      validate_string(`${uniqTradeId}`, 'uniq tradeId');
      validate_string(`${tradeMethod}`, 'trade method');
      validate_string(`${targetPrice}`, 'close target');
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
      selectedEntryPrice =
        parseFloat(selectedEntryPrice) +
        (selectedEntryPrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      selectedEntryPrice =
        parseFloat(selectedEntryPrice) -
        (selectedEntryPrice * brokerageData?.brokerage) / 100;
    }
    const isTradExist = await sql_query(
      'select * from pandingorder where uniqTradeId = ?',
      [uniqTradeId],
    );

    if (!isTradExist) {
      await sql_query(
        'insert into pandingorder (symbole,actualEntryPrice,uniqTradeId, selectedEntryPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,tradeMethod,targetPrice,stopLoss,createdOn) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          symbole,
          actualEntryPrice,
          uniqTradeId,
          selectedEntryPrice,
          quantity,
          tradOnLTP,
          tradeType,
          tradeTime,
          now,
          tradeMethod,
          targetPrice,
          stopLoss,
          now,
        ],
      );

      return NextResponse.json(
        { message: 'Order added in panding list successfully' },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { message: 'Order already in panding' },
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
