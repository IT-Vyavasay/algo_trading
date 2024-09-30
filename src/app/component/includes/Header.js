import React from 'react';

const Header = () => {
  return (
    <>
      {/* <!-- Page Header Start--> */}
      <div className='page-header'>
        <div className='header-wrapper row m-0'>
          <form className='form-inline search-full col' action='#' method='get'>
            <div className='form-group w-100'>
              <div className='Typeahead Typeahead--twitterUsers'>
                <div className='u-posRelative'>
                  <input
                    className='demo-input Typeahead-input form-control-plaintext w-100'
                    type='text'
                    placeholder='Search Cuba ..'
                    name='q'
                    title=''
                    autofocus
                  />
                  <div
                    className='spinner-border Typeahead-spinner'
                    role='status'
                  >
                    <span className='sr-only'>Loading...</span>
                  </div>
                  <i className='close-search' data-feather='x'></i>
                </div>
                <div className='Typeahead-menu'></div>
              </div>
            </div>
          </form>
          <div className='header-logo-wrapper col-auto p-0'>
            <div className='logo-wrapper'>
              <a href='index.html'>
                <img
                  className='img-fluid'
                  src='/assets/images/logo/logo.png'
                  alt=''
                />
              </a>
            </div>
            <div className='toggle-sidebar'>
              <i
                className='status_toggle middle sidebar-toggle'
                data-feather='align-center'
              ></i>
            </div>
          </div>
          <div className='left-header col-xxl-5 col-xl-6 col-lg-5 col-md-4 col-sm-3 p-0'>
            <div className='notification-slider'>
              <div className='d-flex h-100'>
                {' '}
                <img src='/assets/images/giftools.gif' alt='gif' />
                <h6 className='mb-0 f-w-400'>
                  <span className='font-primary'>Don't Miss Out! </span>
                  <span className='f-light'>
                    Out new update has been release.
                  </span>
                </h6>
                <i className='icon-arrow-top-right f-light'></i>
              </div>
              <div className='d-flex h-100'>
                <img src='/assets/images/giftools.gif' alt='gif' />
                <h6 className='mb-0 f-w-400'>
                  <span className='f-light'>
                    Something you love is now on sale!{' '}
                  </span>
                </h6>
                <a
                  className='ms-1'
                  href='https://1.envato.market/3GVzd'
                  target='_blank'
                >
                  Buy now !
                </a>
              </div>
            </div>
          </div>
          <div className='nav-right col-xxl-7 col-xl-6 col-md-7 col-8 pull-right right-header p-0 ms-auto'>
            <ul className='nav-menus'>
              <li className='language-nav'>
                <div className='translate_wrapper'>
                  <div className='current_lang'>
                    <div className='lang'>
                      <i className='flag-icon flag-icon-us'></i>
                      <span className='lang-txt'>EN </span>
                    </div>
                  </div>
                  <div className='more_lang'>
                    <div className='lang selected' data-value='en'>
                      <i className='flag-icon flag-icon-us'></i>
                      <span className='lang-txt'>
                        English<span> (US)</span>
                      </span>
                    </div>
                    <div className='lang' data-value='de'>
                      <i className='flag-icon flag-icon-de'></i>
                      <span className='lang-txt'>Deutsch</span>
                    </div>
                    <div className='lang' data-value='es'>
                      <i className='flag-icon flag-icon-es'></i>
                      <span className='lang-txt'>Español</span>
                    </div>
                    <div className='lang' data-value='fr'>
                      <i className='flag-icon flag-icon-fr'></i>
                      <span className='lang-txt'>Français</span>
                    </div>
                    <div className='lang' data-value='pt'>
                      <i className='flag-icon flag-icon-pt'></i>
                      <span className='lang-txt'>
                        Português<span> (BR)</span>
                      </span>
                    </div>
                    <div className='lang' data-value='cn'>
                      <i className='flag-icon flag-icon-cn'></i>
                      <span className='lang-txt'>简体中文</span>
                    </div>
                    <div className='lang' data-value='ae'>
                      <i className='flag-icon flag-icon-ae'></i>
                      <span className='lang-txt'>
                        لعربية <span> (ae)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                {' '}
                <span className='header-search'>
                  <svg>
                    <use href='/assets/svg/icon-sprite.svg#search'></use>
                  </svg>
                </span>
              </li>
              <li className='onhover-dropdown'>
                <svg>
                  <use href='/assets/svg/icon-sprite.svg#star'></use>
                </svg>
                <div className='onhover-show-div bookmark-flip'>
                  <div className='flip-card'>
                    <div className='flip-card-inner'>
                      <div className='front'>
                        <h6 className='f-18 mb-0 dropdown-title'>Bookmark</h6>
                        <ul className='bookmark-dropdown'>
                          <li>
                            <div className='row'>
                              <div className='col-4 text-center'>
                                <div className='bookmark-content'>
                                  <div className='bookmark-icon'>
                                    <i data-feather='file-text'></i>
                                  </div>
                                  <span>Forms</span>
                                </div>
                              </div>
                              <div className='col-4 text-center'>
                                <div className='bookmark-content'>
                                  <div className='bookmark-icon'>
                                    <i data-feather='user'></i>
                                  </div>
                                  <span>Profile</span>
                                </div>
                              </div>
                              <div className='col-4 text-center'>
                                <div className='bookmark-content'>
                                  <div className='bookmark-icon'>
                                    <i data-feather='server'></i>
                                  </div>
                                  <span>Tables</span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className='text-center'>
                            <a
                              className='flip-btn f-w-700'
                              id='flip-btn'
                              href='javascript:void(0)'
                            >
                              Add New Bookmark
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className='back'>
                        <ul>
                          <li>
                            <div className='bookmark-dropdown flip-back-content'>
                              <input type='text' placeholder='search...' />
                            </div>
                          </li>
                          <li>
                            <a
                              className='f-w-700 d-block flip-back'
                              id='flip-back'
                              href='javascript:void(0)'
                            >
                              Back
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className='mode'>
                  <svg>
                    <use href='/assets/svg/icon-sprite.svg#moon'></use>
                  </svg>
                </div>
              </li>
              <li className='cart-nav onhover-dropdown'>
                <div className='cart-box'>
                  <svg>
                    <use href='/assets/svg/icon-sprite.svg#stroke-ecommerce'></use>
                  </svg>
                  <span className='badge rounded-pill badge-success'>2</span>
                </div>
                <div className='cart-dropdown onhover-show-div'>
                  <h6 className='f-18 mb-0 dropdown-title'>Cart</h6>
                  <ul>
                    <li>
                      <div className='media'>
                        <img
                          className='img-fluid b-r-5 me-3 img-60'
                          src='/assets/images/other-images/cart-img.jpg'
                          alt=''
                        />
                        <div className='media-body'>
                          <span>Furniture Chair for Home</span>
                          <div className='qty-box'>
                            <div className='input-group'>
                              <span className='input-group-prepend'>
                                <button
                                  className='btn quantity-left-minus'
                                  type='button'
                                  data-type='minus'
                                  data-field=''
                                >
                                  -
                                </button>
                              </span>
                              <input
                                className='form-control input-number'
                                type='text'
                                name='quantity'
                                value='1'
                              />
                              <span className='input-group-prepend'>
                                <button
                                  className='btn quantity-right-plus'
                                  type='button'
                                  data-type='plus'
                                  data-field=''
                                >
                                  +
                                </button>
                              </span>
                            </div>
                          </div>
                          <h6 className='font-primary'>$500</h6>
                        </div>
                        <div className='close-circle'>
                          <a className='bg-danger' href='#'>
                            <i data-feather='x'></i>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='media'>
                        <img
                          className='img-fluid b-r-5 me-3 img-60'
                          src='/assets/images/other-images/cart-img.jpg'
                          alt=''
                        />
                        <div className='media-body'>
                          <span>Furniture Chair for Home</span>
                          <div className='qty-box'>
                            <div className='input-group'>
                              <span className='input-group-prepend'>
                                <button
                                  className='btn quantity-left-minus'
                                  type='button'
                                  data-type='minus'
                                  data-field=''
                                >
                                  -
                                </button>
                              </span>
                              <input
                                className='form-control input-number'
                                type='text'
                                name='quantity'
                                value='1'
                              />
                              <span className='input-group-prepend'>
                                <button
                                  className='btn quantity-right-plus'
                                  type='button'
                                  data-type='plus'
                                  data-field=''
                                >
                                  +
                                </button>
                              </span>
                            </div>
                          </div>
                          <h6 className='font-primary'>$500.00</h6>
                        </div>
                        <div className='close-circle'>
                          <a className='bg-danger' href='#'>
                            <i data-feather='x'></i>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className='total'>
                      <h6 className='mb-0'>
                        Order Total : <span className='f-right'>$1000.00</span>
                      </h6>
                    </li>
                    <li className='text-center'>
                      <a
                        className='d-block mb-3 view-cart f-w-700'
                        href='cart.html'
                      >
                        Go to your cart
                      </a>
                      <a
                        className='btn btn-primary view-checkout'
                        href='checkout.html'
                      >
                        Checkout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className='onhover-dropdown'>
                <div className='notification-box'>
                  <svg>
                    <use href='/assets/svg/icon-sprite.svg#notification'></use>
                  </svg>
                  <span className='badge rounded-pill badge-secondary'>4 </span>
                </div>
                <div className='onhover-show-div notification-dropdown'>
                  <h6 className='f-18 mb-0 dropdown-title'>Notitications </h6>
                  <ul>
                    <li className='b-l-primary border-4'>
                      <p>
                        Delivery processing{' '}
                        <span className='font-danger'>10 min.</span>
                      </p>
                    </li>
                    <li className='b-l-success border-4'>
                      <p>
                        Order Complete
                        <span className='font-success'>1 hr</span>
                      </p>
                    </li>
                    <li className='b-l-secondary border-4'>
                      <p>
                        Tickets Generated
                        <span className='font-secondary'>3 hr</span>
                      </p>
                    </li>
                    <li className='b-l-warning border-4'>
                      <p>
                        Delivery Complete
                        <span className='font-warning'>6 hr</span>
                      </p>
                    </li>
                    <li>
                      <a className='f-w-700' href='#'>
                        Check all
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className='profile-nav onhover-dropdown pe-0 py-0'>
                <div className='media profile-media'>
                  <img
                    className='b-r-10'
                    src='/assets/images/dashboard/profile.png'
                    alt=''
                  />
                  <div className='media-body'>
                    <span>Emay Walter</span>
                    <p className='mb-0'>
                      Admin <i className='middle fa fa-angle-down'></i>
                    </p>
                  </div>
                </div>
                <ul className='profile-dropdown onhover-show-div'>
                  <li>
                    <a href='#'>
                      <i data-feather='user'></i>
                      <span>Account </span>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i data-feather='mail'></i>
                      <span>Inbox</span>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i data-feather='file-text'></i>
                      <span>Taskboard</span>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i data-feather='settings'></i>
                      <span>Settings</span>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i data-feather='log-in'> </i>
                      <span>Log in</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <script className='result-template' type='text/x-handlebars-template'>
            <div className='ProfileCard u-cf'>
              <div className='ProfileCard-avatar'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='feather feather-airplay m-0'
                >
                  <path d='M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1'></path>
                  <polygon points='12 15 17 21 7 21 12 15'></polygon>
                </svg>
              </div>
              <div className='ProfileCard-details'>
                <div className='ProfileCard-realName'>{'Sagar'}</div>
              </div>
            </div>
          </script>
          <script className='empty-template' type='text/x-handlebars-template'>
            <div className='EmptyMessage'>
              Your search turned up 0 results. This most likely means the
              backend is down, yikes!
            </div>
          </script>
        </div>
      </div>
      {/* <!-- Page Header Ends                              --> */}
    </>
  );
};

export default Header;
