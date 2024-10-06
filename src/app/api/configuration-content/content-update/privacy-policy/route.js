import { NextResponse } from 'next/server';  
import { check_admin_login } from '../../../../../utils/backend';
import { sql_query } from '../../../../../utils/dbconnect';
import { validate_string } from '../../../../../utils/common';
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        }
        let { newContent } = await req.json()

        try {  
            validate_string(newContent, "privacy policy")

        } catch (e) {
            console.log("error",e)
            return NextResponse.json({ message: e }, { status: 400 }) 
        }

        let isMetakey = await sql_query("select 1 from tblslr_config where metaKey = ? ", ["privacy_policy"])
        if (isMetakey) {
            await sql_query(`update tblslr_config set metaValue=? where metaKey =? `, [JSON.stringify(newContent), 'privacy_policy'])
            return NextResponse.json({ message: 'Privacy policy updated successfully' }, { status: 200 })
        } else {
            await sql_query("insert into tblslr_config (metaKey,metaValue) values (?,?)", ['privacy_policy', JSON.stringify(newContent)])
            return NextResponse.json({ message: 'Privacy policy added successfully' }, { status: 200 })
        } 

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}

