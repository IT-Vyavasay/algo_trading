import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../../../utils/backend';
import {
  chk_otp,
  encryption_key,
  passDec,
  validate_string,
} from '../../../../../utils/common';
import { sql_query } from '../../../../../utils/dbconnect';
import speakeasy from 'speakeasy';
export async function POST(req, res) {
  try {
    let adm = await check_admin_login(req);
    if (!adm.status || !adm.data.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    let { wAmount, otp } = await req.json();
    const metaValue = parseFloat(wAmount).toFixed(2);
    try {
      validate_string(metaValue, 'wallet amount');
      chk_otp(otp);
    } catch (e) {
      console.log('error', e);
      return NextResponse.json({ message: e }, { status: 400 });
    }

    let admin = await sql_query(
      'select twoFaCode from tblslr_admin where slrAdminId = ? ',
      [adm.data.id],
    );

    let twofa = speakeasy.totp.verify({
      secret: passDec(admin.twoFaCode, encryption_key('twofaKey')),
      encoding: 'base32',
      token: otp,
    });
    if (twofa) {
      await sql_query(
        `update tbladmin set wallet_balance=? where adminId  =? `,
        [metaValue, adm.data.id],
      );
      return NextResponse.json(
        { message: 'Wallet amount updated successfully' },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Google authentication failed' },
        { status: 400 },
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 400 },
    );
  }
}
