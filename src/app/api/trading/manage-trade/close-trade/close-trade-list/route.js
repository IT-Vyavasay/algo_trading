import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  validate_filter_numbers,
  validate_filter_strings,
} from '../../../../../../utils/common';
import { check_admin_login } from '../../../../../../utils/backend';
import { sql_query } from '../../../../../../utils/dbconnect';

export async function GET(req, res) {
  draftMode().enable();
  try {
    const params = Object.fromEntries(
      new URLSearchParams(req.nextUrl.search).entries(),
    );
    const { startDate, endDate, orderColumn, order, page, search } = params;

    let adm = await check_admin_login(req);
    if (!adm.status || !adm.data.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    let query = '',
      filter = [],
      limit = process.env.PAGELIMIT;
    query += `SELECT symbole,closedPrice,executedPrice, selectedEntryPrice,quantity,tradeOnLTP,tradeType,tradeTime, orderExecuteTime,profit,stopLoss,targetPrice,actualEntryPrice,createdOn FROM closetrade`;

    let fields = [
      'createdOn',
      'symbole',
      'closedPrice',
      'profit',
      'executedPrice',
      'quantity',
      'tradeOnLTP',
      'tradeType',
      'tradeTime',
      'orderExecuteTime',
      'createdOn',
    ];
    if (validate_filter_numbers([startDate, endDate])) {
      query += ` WHERE createdOn >= ? AND createdOn<= ?`;
      filter.push(startDate);
      filter.push(endDate);
    }

    if (validate_filter_strings([search])) {
      query += ' AND (symbole like ? )';
      filter.push('%' + search.trim() + '%');
    }
    if (validate_filter_numbers([orderColumn, order])) {
      query +=
        ' order by ' +
        fields[orderColumn] +
        ' ' +
        (order == 0 ? 'asc' : 'desc');
    }
    let countData = await sql_query(query, filter, 'Count');
    query += '  limit ? , ?';

    filter.push(page * limit);
    filter.push(parseInt(limit));

    let tradeDataList = await sql_query(query, filter, 'multi');
    let count = Math.ceil(countData / limit),
      allData = [],
      ascNum = page * limit,
      descNum = countData - page * limit;

    const tradeLists = JSON.parse(JSON.stringify(tradeDataList));

    if (tradeLists.length > 0) {
      allData = tradeLists.map((j, k) => {
        return {
          num: order == 1 ? ++ascNum : descNum--,
          symbole: j.symbole ? j.symbole : '',
          closedPrice: j.closedPrice ? j.closedPrice : '',
          executedPrice: j?.executedPrice ? j?.executedPrice : '',
          selectedEntryPrice: j.selectedEntryPrice ? j.selectedEntryPrice : '',
          quantity: j.quantity ? j.quantity : '',
          tradeOnLTP: j.tradeOnLTP ? j.tradeOnLTP : '',
          tradeType: j.tradeType,
          tradeTime: j.tradeTime ? j.tradeTime : '',
          orderExecuteTime: j.orderExecuteTime ? j.orderExecuteTime : '',
          createdOn: j.createdOn ? j.createdOn : '',
          profit: j.profit ? j.profit : '',
          stopLoss: j.stopLoss ? j.stopLoss : '',
          actualEntryPrice: j.actualEntryPrice ? j.actualEntryPrice : '',
          targetPrice: j.targetPrice ? j.targetPrice : '',
        };
      });
    }

    return NextResponse.json(
      { data: allData ? allData : [], total: count ? count : 0 },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error==>', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
