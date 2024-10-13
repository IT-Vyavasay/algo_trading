// pages/api/scrape.js
import puppeteer from 'puppeteer';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import { NseIndia } from 'stock-nse-india';
export async function GET(req, res) {
  draftMode().enable();
  try {
    const params = Object.fromEntries(
      new URLSearchParams(req.nextUrl.search).entries(),
    );
    // const { startDate, endDate, orderColumn, order, search } = params;

    const nseIndia = new NseIndia();
    // To get all symbols from NSE
    // nseIndia.getAllStockSymbols().then(symbols => {
    //   console.log(symbols);
    // });

    // To get equity details for specific symbol
    let data = '';
    await nseIndia.getEquityDetails('IRCTC').then(details => {
      console.log(details.priceInfo.lastPrice);
      data = details.priceInfo;
      // return NextResponse.json({ details }, { status: 200 });
    });

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.log('Error==>', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
