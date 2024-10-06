'use client';
import WebSocketApp from '../../../../components/page/socket/Socket';
import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../../context/auth';
const WebSocket = () => {
  const { setAuthTkn, setPageLoader } = useAuthContext();
  useEffect(() => {
    setPageLoader(false);
  }, []);

  return (
    <>
      <div className='page-body'>
        <div className='container-fluid'>
          <WebSocketApp />
        </div>{' '}
      </div>
    </>
  );
};

export default WebSocket;
