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
      latestTradedPrice,
      tradedQuntity,
      quantity,
      tradeTime,
      tradeType,
      tradOnLTP,
      targetPrice,
    } = await req.json();
    try {
      validate_string(`${symbole}`, 'symbole');
      validate_string(`${latestTradedPrice}`, 'latest tradedP price');
      validate_string(`${quantity}`, 'quantity');
      validate_string(`${tradeTime}`, 'trade time');
      validate_string(`${tradeType}`, 'trade type');
      validate_string(`${tradOnLTP}`, 'tradOnLTP');
      validate_string(`${targetPrice}`, 'target price');
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
      targetPrice =
        targetPrice + (targetPrice * brokerageData?.brokerage) / 100;
    } else if (tradeType == 1) {
      targetPrice =
        targetPrice - (targetPrice * brokerageData?.brokerage) / 100;
    }
    await sql_query(
      'insert into pandingorder (symbole,tradedPrice, targetPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,createdOn) values (?,?,?,?,?,?,?,?,?)',
      [
        symbole,
        latestTradedPrice,
        targetPrice,
        quantity,
        tradOnLTP,
        tradeType,
        tradeTime,
        now,
        now,
      ],
    );

    return NextResponse.json(
      { message: 'Order added in panding list successfully' },
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