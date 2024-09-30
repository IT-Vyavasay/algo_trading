import React from 'react';

const Dashboard = () => {
  return (
    <>
      <div className='page-body'>
        <div className='container-fluid'>
          <div className='page-title'>
            <div className='row'>
              <div className='col-6'>
                <h4>Crypto</h4>
              </div>
              <div className='col-6'>
                <ol className='breadcrumb'>
                  <li className='breadcrumb-item'>
                    <a href='index.html'>
                      <svg className='stroke-icon'>
                        <use href='/assets/svg/icon-sprite.svg#stroke-home'></use>
                      </svg>
                    </a>
                  </li>
                  <li className='breadcrumb-item'>Dashboard</li>
                  <li className='breadcrumb-item active'>Crypto</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid starts--> */}
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-xxl-3 col-xl-4 box-col-4'>
              <div className='row'>
                <div className='col-xl-12 col-sm-6'>
                  <div className='card crypto-main-card'>
                    <div className='card-body'>
                      <div className='deposit-wrap'>
                        <div>
                          <h5>Cryptocurrency just got even better.</h5>
                          <p>Lorem Ipsum is simply dummy text</p>
                          <button className='btn btn-white f-w-500'>
                            Deposit Now
                          </button>
                        </div>
                        <img
                          src='/assets/images/dashboard-4/crypto.png'
                          alt='crypto'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-12 col-sm-6'>
                  <div className='card widget-hover'>
                    <div className='card-body radial-progress-card'>
                      <div>
                        <h6 className='mb-0'>Average Sales Per Day</h6>
                        <div className='sale-details'>
                          <h5 className='font-primary mb-0'>45,908</h5>
                          <span className='f-12 f-light f-w-500'>
                            <i data-feather='arrow-up'></i>+5.7%
                          </span>
                        </div>
                        <p className='f-light'>
                          {' '}
                          The point of using Lorem Ipsum
                        </p>
                      </div>
                      <div className='radial-chart-wrap'>
                        <div id='radial-chart'> </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-12 col-sm-6'>
                  <div className='card widget-hover'>
                    <div className='card-body radial-progress-card'>
                      <div>
                        <h6 className='mb-0'>Average Profit Per Day</h6>
                        <div className='sale-details'>
                          <h5 className='font-secondary mb-0'>89.6%</h5>
                          <span className='f-12 f-light f-w-500'>
                            <i data-feather='arrow-up'></i>+2.7%
                          </span>
                        </div>
                        <p className='f-light'>
                          {' '}
                          The point of using Lorem Ipsum
                        </p>
                      </div>
                      <div className='radial-chart-wrap'>
                        <div id='radial-chart2'></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-12 col-sm-6'>
                  <div className='card widget-hover'>
                    <div className='card-body radial-progress-card'>
                      <div>
                        <h6 className='mb-0'>Average Visits Per Day</h6>
                        <div className='sale-details'>
                          <h5 className='font-success mb-0'>70k</h5>
                          <span className='f-12 f-light f-w-500'>
                            <i data-feather='arrow-up'></i>+1.5%
                          </span>
                        </div>
                        <p className='f-light'>
                          {' '}
                          The point of using Lorem Ipsum
                        </p>
                      </div>
                      <div className='radial-chart-wrap'>
                        <div id='radial-chart3'></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className='card tranaction-card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top'>
                        <h5>Transactions</h5>
                        <ul
                          className='nav nav-tabs custom-tab'
                          id='myTab'
                          role='tablist'
                        >
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link active'
                              id='all-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#all'
                              type='button'
                              role='tab'
                              aria-controls='all'
                              aria-selected='true'
                            >
                              All
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='buy-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#buy'
                              type='button'
                              role='tab'
                              aria-controls='buy'
                              aria-selected='false'
                            >
                              Buy
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='sell-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#sell'
                              type='button'
                              role='tab'
                              aria-controls='sell'
                              aria-selected='false'
                            >
                              Sell
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <div className='tab-content' id='myTabContent'>
                        <div
                          className='tab-pane fade show active'
                          id='all'
                          role='tabpanel'
                          aria-labelledby='all-tab'
                        >
                          <div className='table-responsive recent-table transaction-table'>
                            <table className='table'>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell ETH</h6>
                                        <span className='f-light'>
                                          25 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $116.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          28 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          05 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $29.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell BTC</h6>
                                        <span className='f-light'>
                                          16 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.012 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell ETH</h6>
                                        <span className='f-light'>
                                          25 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $116.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          28 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className='tab-pane fade'
                          id='buy'
                          role='tabpanel'
                          aria-labelledby='buy-tab'
                        >
                          <div className='table-responsive recent-table transaction-table'>
                            <table className='table'>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          30 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.010 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $105.00
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy ETH</h6>
                                        <span className='f-light'>
                                          05 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.075 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $120.74
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          05 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $29.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy BTC</h6>
                                        <span className='f-light'>
                                          17 Sep, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.08 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $380.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy LTC</h6>
                                        <span className='f-light'>
                                          30 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.010 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $105.00
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy ETH</h6>
                                        <span className='f-light'>
                                          05 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.075 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $120.74
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Buy BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className='tab-pane fade'
                          id='sell'
                          role='tabpanel'
                          aria-labelledby='sell-tab'
                        >
                          <div className='table-responsive recent-table transaction-table'>
                            <table className='table'>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell ETH</h6>
                                        <span className='f-light'>
                                          25 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $116.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell LTC</h6>
                                        <span className='f-light'>
                                          28 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell LTC</h6>
                                        <span className='f-light'>
                                          05 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $29.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell BTC</h6>
                                        <span className='f-light'>
                                          16 Apr, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.012 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell BTC</h6>
                                        <span className='f-light'>
                                          14 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 BTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-danger me-2'
                                        data-feather='trending-down'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell ETH</h6>
                                        <span className='f-light'>
                                          25 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.089 ETH
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $116.89
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex'>
                                      {' '}
                                      <i
                                        className='font-success me-2'
                                        data-feather='trending-up'
                                      ></i>
                                      <div>
                                        <h6 className='f-14 mb-0'>Sell LTC</h6>
                                        <span className='f-light'>
                                          28 Mar, 2022
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      0.018 LTC
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span className='f-light f-w-500'>
                                      $236.89
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xxl-6 col-xl-8 box-col-8e'>
              <div className='row'>
                <div className='col-sm-4'>
                  <div className='currency-widget warning'>
                    <div className='d-flex'>
                      <div className='currency-icon-widget'>
                        <svg>
                          <use href='/assets/svg/icon-sprite.svg#beta'></use>
                        </svg>
                      </div>
                      <div>
                        <h6>
                          Bitcoin <span className='f-light'>BTC</span>
                        </h6>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body d-flex'>
                        <div className='currency-chart-wrap'>
                          <div id='currency-chart'> </div>
                        </div>
                        <div className='bg-light-warning text-center'>
                          <h5 className='mb-0'>$21,43</h5>
                          <span className='f-12 f-w-500 font-warning'>
                            <i className='me-1' data-feather='trending-up'></i>
                            +50%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-4'>
                  <div className='currency-widget primary'>
                    <div className='d-flex'>
                      <div className='currency-icon-widget'>
                        <svg>
                          <use href='/assets/svg/icon-sprite.svg#eth'></use>
                        </svg>
                      </div>
                      <div>
                        <h6>
                          Ethereum <span className='f-light'>ETC</span>
                        </h6>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body d-flex'>
                        <div className='currency-chart-wrap'>
                          <div id='currency-chart2'></div>
                        </div>
                        <div className='bg-light-primary text-center'>
                          <h5 className='mb-0'>$7,450</h5>
                          <span className='f-12 f-w-500 font-primary'>
                            <i className='me-1' data-feather='trending-up'>
                              {' '}
                            </i>
                            +35%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-4'>
                  <div className='currency-widget success'>
                    <div className='d-flex'>
                      <div className='currency-icon-widget'>
                        <svg>
                          <use href='/assets/svg/icon-sprite.svg#ltc'></use>
                        </svg>
                      </div>
                      <div>
                        <h6>
                          Leave Travel <span className='f-light'>LTC</span>
                        </h6>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body d-flex'>
                        <div className='currency-chart-wrap'>
                          <div id='currency-chart3'></div>
                        </div>
                        <div className='bg-light-success text-center'>
                          <h5 className='mb-0'>$2,198</h5>
                          <span className='f-12 f-w-500 font-success'>
                            <i className='me-1' data-feather='trending-up'>
                              {' '}
                            </i>
                            +73%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='card market-card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top'>
                        <h5>Market Graph</h5>
                        <ul
                          className='nav nav-tabs custom-tab'
                          id='tabdesign'
                          role='tablist'
                        >
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='hour-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#hour'
                              type='button'
                              role='tab'
                              aria-selected='false'
                            >
                              1H
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='day-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#day'
                              type='button'
                              role='tab'
                              aria-selected='false'
                            >
                              1D
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link active'
                              id='week-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#week'
                              type='button'
                              role='tab'
                              aria-selected='true'
                            >
                              1W
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='month-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#month'
                              type='button'
                              role='tab'
                              aria-selected='false'
                            >
                              1M
                            </button>
                          </li>
                          <li className='nav-item' role='presentation'>
                            <button
                              className='nav-link'
                              id='year-tab'
                              data-bs-toggle='tab'
                              data-bs-target='#year'
                              type='button'
                              role='tab'
                              aria-selected='false'
                            >
                              1Y
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <div className='row m-0 overall-card'>
                        <div className='col-xxl-8 col-xl-7 col-md-8 col-sm-7 p-0 box-col-7 col-ed-7'>
                          <div className='market-chart-container'>
                            <div id='market-chart'></div>
                          </div>
                        </div>
                        <div className='col-xxl-4 col-xl-5 col-md-4 col-sm-5 p-0 box-col-5 col-ed-5'>
                          <div className='row g-sm-3 g-2'>
                            <div className='col-md-12'>
                              <div className='light-card balance-card align-items-center'>
                                <h6 className='f-w-400 f-14 mb-0'>
                                  Coinmarketcap
                                </h6>
                                <div className='ms-auto text-end'>
                                  <span className='badge badge-light-success rounded-pill'>
                                    +11.67%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-12'>
                              <div className='light-card balance-card align-items-center'>
                                <h6 className='f-w-400 f-14 mb-0'>Binance</h6>
                                <div className='ms-auto text-end'>
                                  <span className='badge badge-light-success rounded-pill'>
                                    +10.67%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-12'>
                              <div className='light-card balance-card align-items-center'>
                                <h6 className='f-w-400 f-14 mb-0'>Coinbase</h6>
                                <div className='ms-auto text-end'>
                                  <span className='badge badge-light-secondary rounded-pill'>
                                    -11.67%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-12'>
                              <div className='light-card balance-card align-items-center'>
                                <h6 className='f-w-400 f-14 mb-0'>Yobit</h6>
                                <div className='ms-auto text-end'>
                                  <span className='badge badge-light-success rounded-pill'>
                                    +13.67%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-12'>
                              <button
                                className='btn btn-outline-dark w-100'
                                type='button'
                              >
                                See All Balance
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top'>
                        <h5>My Currencies</h5>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <div className='recent-table table-responsive currency-table'>
                        <table className='table'>
                          <thead>
                            <tr>
                              <th className='f-light'>Coin Name</th>
                              <th className='f-light'>Price</th>
                              <th className='f-light'>24h Change</th>
                              <th className='f-light'>Total Balance</th>
                              <th className='f-light'>Total Coin</th>
                              <th className='f-light'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className='d-flex align-items-center gap-2'>
                                  <div className='currency-icon warning'>
                                    <svg>
                                      <use href='/assets/svg/icon-sprite.svg#beta'></use>
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className='f-14 mb-0 f-w-400'>
                                      Bitcoin
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>$13,098.09</td>
                              <td>
                                <div className='change-currency font-success'>
                                  {' '}
                                  <i
                                    className='me-1'
                                    data-feather='trending-up'
                                  ></i>
                                  5.90
                                </div>
                              </td>
                              <td>$74,871.470</td>
                              <td>1.09634721</td>
                              <td>
                                <button className='btn button-primary'>
                                  Trade
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='d-flex align-items-center gap-2'>
                                  <div className='currency-icon success'>
                                    <svg>
                                      <use href='/assets/svg/icon-sprite.svg#ltc'></use>
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className='f-14 mb-0 f-w-400'>
                                      Litecoin
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>$11,098.04</td>
                              <td>
                                <div className='change-currency font-secondary'>
                                  <i
                                    className='me-1'
                                    data-feather='trending-down'
                                  ></i>
                                  2.90
                                </div>
                              </td>
                              <td>$87,897.098</td>
                              <td>1.09675432</td>
                              <td>
                                <button className='btn button-primary'>
                                  Trade
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='d-flex align-items-center gap-2'>
                                  <div className='currency-icon primary'>
                                    <svg>
                                      <use href='/assets/svg/icon-sprite.svg#eth'></use>
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className='f-14 mb-0 f-w-400'>
                                      Eathereum
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>$45,198.09</td>
                              <td>
                                <div className='change-currency font-success'>
                                  <i
                                    className='me-1'
                                    data-feather='trending-up'
                                  ></i>
                                  0.12
                                </div>
                              </td>
                              <td>$45,178.010</td>
                              <td>1.41557127</td>
                              <td>
                                <button className='btn button-primary'>
                                  Trade
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='d-flex align-items-center gap-2'>
                                  <div className='currency-icon secondary'>
                                    <svg>
                                      <use href='/assets/svg/icon-sprite.svg#bin'></use>
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className='f-14 mb-0 f-w-400'>
                                      Binance
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>$35,098.34</td>
                              <td>
                                <div className='change-currency font-success'>
                                  <i
                                    className='me-1'
                                    data-feather='trending-up'
                                  ></i>
                                  3.56
                                </div>
                              </td>
                              <td>$64,100.066</td>
                              <td>1.78142254</td>
                              <td>
                                <button className='btn badge-light-primary'>
                                  Trade
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='d-flex align-items-center gap-2'>
                                  <div className='currency-icon dark-green'>
                                    <svg>
                                      <use href='/assets/svg/icon-sprite.svg#te'></use>
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className='f-14 mb-0 f-w-400'>
                                      Tether
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>$56,898.91</td>
                              <td>
                                <div className='change-currency font-secondary'>
                                  <i
                                    className='me-1'
                                    data-feather='trending-down'
                                  ></i>
                                  1.23
                                </div>
                              </td>
                              <td>$61,574.218</td>
                              <td>1.574215</td>
                              <td>
                                <button className='btn button-primary'>
                                  Trade
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top gap-1'>
                        <h5>Buy Coins</h5>
                        <div className='dropdown icon-dropdown'>
                          <button
                            className='btn dropdown-toggle'
                            id='buydropdown'
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                          >
                            <i className='icon-more-alt'></i>
                          </button>
                          <div
                            className='dropdown-menu dropdown-menu-end'
                            aria-labelledby='buydropdown'
                          >
                            <a className='dropdown-item' href='#'>
                              Weekly
                            </a>
                            <a className='dropdown-item' href='#'>
                              Monthly
                            </a>
                            <a className='dropdown-item' href='#'>
                              Yearly
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <form className='theme-form crypto-form'>
                        <div className='mb-3'>
                          <label className='form-label f-light' for='money'>
                            Enter your Money
                          </label>
                          <div className='position-relative'>
                            <input
                              className='form-control'
                              id='money'
                              type='number'
                              placeholder='100'
                            />
                            <select className='form-select crypto-select warning'>
                              <option>USD</option>
                              <option>BTC</option>
                              <option>LTC</option>
                              <option>ETH</option>
                            </select>
                          </div>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label f-light' for='coin'>
                            Enter Coins Converted to
                          </label>
                          <div className='position-relative'>
                            <input
                              className='form-control'
                              id='coin'
                              type='number'
                              placeholder='0.0043'
                            />
                            <select className='form-select crypto-select primary'>
                              <option>BTC</option>
                              <option>USD</option>
                              <option>LTC</option>
                              <option>ETH</option>
                            </select>
                          </div>
                        </div>
                        <button
                          className='btn btn-primary btn-hover-effect w-100'
                          type='button'
                        >
                          Buy Coins
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top gap-1'>
                        <h5>Sell Coins</h5>
                        <div className='dropdown icon-dropdown'>
                          <button
                            className='btn dropdown-toggle'
                            id='selldropdown'
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                          >
                            <i className='icon-more-alt'></i>
                          </button>
                          <div
                            className='dropdown-menu dropdown-menu-end'
                            aria-labelledby='selldropdown'
                          >
                            <a className='dropdown-item' href='#'>
                              Weekly
                            </a>
                            <a className='dropdown-item' href='#'>
                              Monthly
                            </a>
                            <a className='dropdown-item' href='#'>
                              Yearly
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <form className='theme-form crypto-form'>
                        <div className='mb-3'>
                          <label
                            className='form-label f-light'
                            for='crypto-coin'
                          >
                            Enter Crypto Coins
                          </label>
                          <div className='position-relative'>
                            <input
                              className='form-control'
                              id='crypto-coin'
                              type='number'
                              placeholder='100'
                            />
                            <select className='form-select crypto-select warning'>
                              <option>USD</option>
                              <option>BTC</option>
                              <option>LTC</option>
                              <option>ETH</option>
                            </select>
                          </div>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label f-light' for='bitcoin'>
                            Enter Money Converted to
                          </label>
                          <div className='position-relative'>
                            <input
                              className='form-control'
                              id='bitcoin'
                              type='number'
                              placeholder='0.0043'
                            />
                            <select className='form-select crypto-select primary'>
                              <option>LTC</option>
                              <option>USD</option>
                              <option>BTC</option>
                              <option>ETH</option>
                            </select>
                          </div>
                        </div>
                        <button
                          className='btn btn-primary btn-hover-effect w-100'
                          type='button'
                        >
                          Sell Coins
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xxl-3 box-col-12'>
              <div className='row box-order'>
                <div className='col-xxl-12 col-sm-6 box-col-6'>
                  <div className='card balance-box'>
                    <div className='card-body'>
                      <div className='balance-profile'>
                        <div className='balance-img'>
                          <img
                            src='/assets/images/dashboard-4/user.png'
                            alt='user vector'
                          />
                          <a className='edit-icon' href='user-profile.html'>
                            <svg>
                              <use href='/assets/svg/icon-sprite.svg#pencil'></use>
                            </svg>
                          </a>
                        </div>
                        <span className='f-light d-block'>Your Balance </span>
                        <h5 className='mt-1'>$768,987.90</h5>
                        <ul>
                          <li>
                            <div className='balance-item danger'>
                              <div className='balance-icon-wrap'>
                                <div className='balance-icon'>
                                  <i data-feather='arrow-down-right'></i>
                                </div>
                              </div>
                              <div>
                                {' '}
                                <span className='f-12 f-light'>
                                  Investment{' '}
                                </span>
                                <h5>78.8K</h5>
                                <span className='badge badge-light-danger rounded-pill'>
                                  -11.67%
                                </span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className='balance-item success'>
                              <div className='balance-icon-wrap'>
                                <div className='balance-icon'>
                                  <i data-feather='arrow-up-right'></i>
                                </div>
                              </div>
                              <div>
                                {' '}
                                <span className='f-12 f-light'>Cash Back</span>
                                <h5>19.7K</h5>
                                <span className='badge badge-light-success rounded-pill'>
                                  +10.67%
                                </span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-12 order-xxl-0 order-1'>
                  <div className='card portfolio-card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top'>
                        <h5 className='m-0'>My Portfolio</h5>
                        <div className='card-header-right-icon'>
                          <div className='dropdown'>
                            <button
                              className='btn dropdown-toggle'
                              id='portfolioButton'
                              type='button'
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              BTC
                            </button>
                            <div
                              className='dropdown-menu dropdown-menu-end'
                              aria-labelledby='portfolioButton'
                            >
                              <a className='dropdown-item' href='#'>
                                ETH
                              </a>
                              <a className='dropdown-item' href='#'>
                                USD
                              </a>
                              <a className='dropdown-item' href='#'>
                                LTC
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-xxl-12 col-xl-7 col-sm-6 box-col-6'>
                          <div className='portfolio-chart-container'>
                            <div id='portfolio-chart'> </div>
                          </div>
                        </div>
                        <div className='col-xxl-12 col-xl-5 col-sm-6 box-col-6'>
                          <div className='portfolio-table recent-table table-responsive'>
                            <table className='table'>
                              <tr>
                                <td>
                                  <div className='d-flex align-items-center gap-2'>
                                    <div className='currency-icon warning'>
                                      <svg>
                                        <use href='/assets/svg/icon-sprite.svg#beta'></use>
                                      </svg>
                                    </div>
                                    <div>
                                      <h6 className='f-14 mb-1'>Bitcoin</h6>
                                      <div className='d-flex align-items-center gap-1'>
                                        <span className='status bg-success'></span>
                                        <span className='f-light'>BTC</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className='text-end'>
                                  <h6 className='f-14 f-w-400 mb-1'>
                                    BTC 0.00876543
                                  </h6>
                                  <span className='font-success'>
                                    $14,987.13
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='d-flex align-items-center gap-2'>
                                    <div className='currency-icon success'>
                                      <svg>
                                        <use href='/assets/svg/icon-sprite.svg#ltc'></use>
                                      </svg>
                                    </div>
                                    <div>
                                      <h6 className='f-14 mb-1'>Ethereum</h6>
                                      <div className='d-flex align-items-center gap-1'>
                                        <span className='status bg-danger'></span>
                                        <span className='f-light'>ETH</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className='text-end'>
                                  <h6 className='f-14 f-w-400 mb-1'>
                                    ETC 1.60876543
                                  </h6>
                                  <span className='font-danger'>
                                    $49,987.13
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='d-flex align-items-center gap-2'>
                                    <div className='currency-icon primary'>
                                      <svg>
                                        <use href='/assets/svg/icon-sprite.svg#eth'></use>
                                      </svg>
                                    </div>
                                    <div>
                                      <h6 className='f-14 mb-1'>Litecoin</h6>
                                      <div className='d-flex align-items-center gap-1'>
                                        <span className='status bg-success'></span>
                                        <span className='f-light'>LTC</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className='text-end'>
                                  <h6 className='f-14 f-w-400 mb-1'>
                                    LTC 1.60876543
                                  </h6>
                                  <span className='font-success'>
                                    $35,571.25
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='d-flex align-items-center gap-2'>
                                    <div className='currency-icon light-blue'>
                                      <svg>
                                        <use href='/assets/svg/icon-sprite.svg#dash'></use>
                                      </svg>
                                    </div>
                                    <div>
                                      <h6 className='f-14 mb-1'>Dash</h6>
                                      <div className='d-flex align-items-center gap-1'>
                                        <span className='status bg-success'></span>
                                        <span className='f-light'>DSH</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className='text-end'>
                                  <h6 className='f-14 f-w-400 mb-1'>
                                    DSH 1.80741510
                                  </h6>
                                  <span className='font-success'>
                                    $17,047.30
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-12 col-sm-6 box-col-6'>
                  <div className='card'>
                    <div className='card-header card-no-border'>
                      <div className='header-top'>
                        <h5 className='m-0'>Activities</h5>
                        <div className='card-header-right-icon'>
                          <div className='dropdown icon-dropdown'>
                            <button
                              className='btn dropdown-toggle'
                              id='activitiesButton'
                              type='button'
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              <i className='icon-more-alt'></i>
                            </button>
                            <div
                              className='dropdown-menu dropdown-menu-end'
                              aria-labelledby='activitiesButton'
                            >
                              <a className='dropdown-item' href='#'>
                                Weekly
                              </a>
                              <a className='dropdown-item' href='#'>
                                Yearly
                              </a>
                              <a className='dropdown-item' href='#'>
                                Monthly
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-body pt-0 activity-card'>
                      <div className='appointment-table customer-table table-responsive'>
                        <table className='table table-bordernone'>
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/3.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Anna K.
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-success'>+0.3BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/12.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Guy Hawkins
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-success'>+0.3BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/10.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Jenny Wilson
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-danger'>-0.1BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/11.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Jacob B.
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-success'>+0.3BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/13.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Esther Howard
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-danger'>-0.2BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className='img-fluid img-40 rounded-circle me-2'
                                  src='/assets/images/dashboard/user/5.jpg'
                                  alt='user'
                                />
                              </td>
                              <td className='img-content-box'>
                                <a
                                  className='d-block f-w-500'
                                  href='user-profile.html'
                                >
                                  Leslie Alexander
                                </a>
                                <span className='f-light'>
                                  To : 0x187...12bb
                                </span>
                              </td>
                              <td className='text-end'>
                                {' '}
                                <span className='font-success'>+0.3BNB</span>
                                <span className='d-block f-light'>
                                  29.09.22
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid Ends--> */}
      </div>
    </>
  );
};

export default Dashboard;
