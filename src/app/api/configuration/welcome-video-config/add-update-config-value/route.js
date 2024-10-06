import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../../utils/backend";
import {  chk_otp, encryption_key, passDec, validate_url  } from "../../../../../utils/common";
import { sql_query } from "../../../../../utils/dbconnect";
import speakeasy from "speakeasy"
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        } 
        let {  metaValue,otp } = await req.json()

        try {   
            validate_url(metaValue, "welcome videolink")  
            chk_otp(otp)

        } catch (e) {
            console.log("error",e)
            return NextResponse.json({ message: e }, { status: 400 })
        }

     
        let admin = await sql_query("select twoFaCode from tblslr_admin where slrAdminId = ? ", [adm.data.id])  
            
        
            let twofa = speakeasy.totp.verify({
                secret: passDec(admin.twoFaCode, encryption_key("twofaKey")),
                encoding: "base32",
                token: otp
            })
            if (twofa) { 
                const metaKey = 'welcomeVideoLink'
                let isMetakey = await sql_query("select 1 from tblslr_config where metaKey = ? ", [metaKey])  
                if (isMetakey) {
                    await sql_query(`update tblslr_config set metaValue=? where metaKey =? `, [metaValue, metaKey])
                    return NextResponse.json({ message: 'Welcome video link updated successfully'  }, { status: 200 })
                } else {
                    await sql_query("insert into tblslr_config (metaKey,metaValue) values (?,?)", [metaKey, metaValue]) 
                    return NextResponse.json({ message: 'Welcome video link added successfully'  }, { status: 200 })
                } 
               
            } else {
                return NextResponse.json({ message: 'Google authentication failed' }, { status: 400 })
            } 
         

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}

 