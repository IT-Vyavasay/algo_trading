'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../../../../context/auth';
import { fetchApi } from '../../../../utils/frondend';
import Table_Loader from '../../../../components/include/TableLoader';
import CoinList from '../coinlist/page';
import TradeList from '../active-trade-list/page';
import CloseTradeList from '../close-trade-list/page';
import PandingOrderList from '../panding-order-list/page';

export default function Dashboard() {
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [loader, setLoader] = useState(false);
  const [clearLoader, setClearLoader] = useState(false);
  const [multiLoader, setMultiLoader] = useState({
    CoinLoader: false,
    TradeLoader: false,
    PandingOrderLoader: false,
    CloseTradeLoader: false,
  });
  const [dashData, setDashData] = useState({});
  const getDashboardData = async () => {
    if (!loader) {
      setLoader(true);
      const stakingdata = JSON.stringify({ a: 0 });
      // const response = await fetchApi('dashboard', stakingdata, 'GET');
      // setPageLoader(false);
      // if (response.statusCode == 200) {
      //   setPageLoader(false);
      //   setDashData(response.data.data);
      // } else {
      //   if (response.data.message == 'Unauthorized') {
      //     setAuthTkn(response.data.message);
      //   } else {
      //     toast.error(response.data.message);
      //   }
      // }
      setLoader(false);
    }
  };
  const clearTableData = async () => {
    if (!clearLoader) {
      setClearLoader(true);
      const stakingdata = JSON.stringify({ a: 0 });
      const response = await fetchApi(
        'trading/configuration/clear-trading-data',
        stakingdata,
        'GET',
      );
      if (response.statusCode == 200) {
        setMultiLoader({
          CoinLoader: false,
          TradeLoader: !multiLoader.TradeLoader,
          CloseTradeLoader: !multiLoader.CloseTradeLoader,
          PandingOrderLoader: !multiLoader.PandingOrderLoader,
        });
        toast.success(response.data.message);
      } else {
        if (response.data.message == 'Unauthorized') {
          setAuthTkn(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
      setClearLoader(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    setPageLoader(false);
  }, []);
  const scrap = () => {
    const puppeteer = require('puppeteer');

    async function getRelianceSharePrice() {
      // Launch the Puppeteer browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Go to Google Finance Reliance page (or any stock website)
      await page.goto('https://www.google.com/finance/quote/RELIANCE:NSE');

      // Wait for the element that contains the price to load (can be customized)
      await page.waitForSelector('.YMlKec.fxKbKc');

      // Extract the share price text
      const price = await page.$eval('.YMlKec.fxKbKc', el => el.textContent);

      // Output the price to the console
      console.log(`Reliance Share Price: ${price}`);

      // Close the browser
      await browser.close();
    }

    // Call the function
    // getRelianceSharePrice();
  };
  return (
    <>
      <div className='content-body btn-page'>
        <Toaster position='top-right' reverseOrder={false} />
        <div className='container-fluid p-4'>
          <div className='row justify-content-between'>
            <h3 className='page-title-main' onClick={scrap}>
              Dashboard
            </h3>
            <button className='btn btn-primary' onClick={clearTableData}>
              {clearLoader && <i className='fa fa-refresh'></i>}
              {` `}
              Clear Trading Data
            </button>
          </div>
          {loader ? (
            <div className={`disableTbl m-auto`}>
              <Table_Loader />{' '}
            </div>
          ) : (
            <>
              <div className='mt-4 configuration-card'>
                <div className='row'>
                  <div className='col-12 col-xl-4'>
                    <div className='card d p-3 '>
                      <div className='d-flex'>
                        <div className='mr-3'>
                          <span className='fa fa-user dashboard-card-icon ' />
                        </div>
                        <div>
                          <h4>All Users</h4>
                          <h3>{dashData?.usersData?.totalUsers || 0}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-md-6 col-xl-4 '>
                    <div className='card d p-3 '>
                      <div className='d-flex'>
                        <div className='mr-3'>
                          <span className='fa fa-user-check dashboard-card-icon px-1 ' />
                        </div>
                        <div>
                          <h4 className=''>Active Users</h4>
                          <h3 className='text-success'>
                            {dashData?.usersData?.activeUsers || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-md-6 col-xl-4'>
                    <div className='card d p-3 '>
                      <div className='d-flex'>
                        <div className='mr-3'>
                          <span className='fa fa-user-slash dashboard-card-icon px-1' />
                        </div>
                        <div>
                          <h4 className='text-nowrap'>Deactive Users</h4>
                          <h3 className='text-danger'>
                            {dashData?.usersData?.deactiveUsers || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coin list */}

              <CoinList
                option={{
                  title: 'incard',
                  multiLoader: multiLoader,
                  setMultiLoader,
                }}
              />
              <TradeList
                option={{
                  title: 'incard',
                  multiLoader: multiLoader,
                  setMultiLoader,
                }}
              />
              <CloseTradeList
                option={{
                  title: 'incard',
                  multiLoader: multiLoader,
                  setMultiLoader,
                }}
              />
              <PandingOrderList
                option={{
                  title: 'incard',
                  multiLoader: multiLoader,
                  setMultiLoader,
                }}
              />
              <div className='p-4'></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
