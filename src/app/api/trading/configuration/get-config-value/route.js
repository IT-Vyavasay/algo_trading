import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../../../utils/backend';
import { sql_query } from '../../../../../utils/dbconnect';
import { draftMode } from 'next/headers';
export async function GET(req, res) {
  draftMode().enable();
  try {
    let adm = await check_admin_login(req);
    if (!adm.status || !adm.data.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    let wallet_data = await sql_query(
      'select wallet_balance from tblslr_admin where adminId = ? ',
      [adm.data.id],
    );

    return NextResponse.json(wallet_data, { status: 200 });
  } catch (e) {
    console.log('Error=>', e);
  }
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 },
  );
}
