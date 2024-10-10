import { NextResponse } from 'next/server';
import {
  encryption_key,
  validate_string,
  chk_email,
  chk_password,
  passDec,
  passEnc,
} from '../../../../utils/common';
import { sql_query } from '../../../../utils/dbconnect';
import { recaptcha } from '../../../../utils/backend';
import speakeasy from 'speakeasy';
export async function POST(req, res) {
  // const secret = speakeasy.generateSecret({ name: 'admin' });
  // console.log(secret);

  try {
    const abc = passEnc(`Admin@123`, encryption_key('passwordKey'));
    console.log(`abc`, abc);
  } catch (error) {}
  try {
    let { email, password, repchaToken } = await req.json();
    let checkRepcha = await recaptcha(repchaToken);
    if (!checkRepcha) {
      return NextResponse.json(
        { message: 'Something went to wrong, Please refresh page' },
        { status: 500 },
      );
    }
    try {
      validate_string(email, 'Email');
      chk_email(email);
      validate_string(password, 'Password');
      chk_password(password);
    } catch (e) {
      return NextResponse.json({ message: e }, { status: 400 });
    }
    let adm = await sql_query(
      'select email,password,twoOpen from tblslr_admin where email = ? ',
      [email],
    );

    if (
      adm &&
      passDec(adm.password, encryption_key('passwordKey')) === password
    ) {
      return NextResponse.json(
        { message: 'success', data: { twoOpen: adm.twoOpen } },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log('Login==>', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
