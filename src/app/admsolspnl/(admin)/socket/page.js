'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import WebSocketApp from '../../../../components/page/socket/Socket';
import { useAuthContext } from '../../../../context/auth';
const socket = io(); // Connects to the same server as Next.js (http://localhost:3000)

const WebSocketApp = () => {
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('12');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const Login = () => {
    try {
      socket.emit('login', roomId);
      socket.on('user_connected', data => {
        console.log('Login===========>', data);
      });
    } catch (error) {
      console.log('Error in Login Event', error);
    }
    return;
  };
  // Functionality for send message to all user
  const MessageToAll = () => {
    socket.emit('messageToAll', message);
  };

  useEffect(() => {
    // Set up the event listener
    socket.on('messageToAll', data => {
      // Handle the received data
      console.log(data);
      setReceivedMessages(prevMessages => [...prevMessages, data]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('messageToAll');
    };
  }, []);
  // Functionality for send message to only room member>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const MessageToRoom = () => {
    socket.emit('messageToRoomMember', { senderID: roomId, data: message });
  };

  useEffect(() => {
    // Set up the event listener
    socket.on('messageToRoomMember', data => {
      // Handle the received data
      console.log(data);
      setReceivedMessages(prevMessages => [...prevMessages, data]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('messageToRoomMember');
    };
  }, []);

  useEffect(() => {
    console.log(receivedMessages);
  }, [receivedMessages]);

  useEffect(() => {
    setPageLoader(false);
  }, []);
  return (
    <div className='page-body'>
      <div className='container-fluid'>
        <div className='container mt-5'>
          <h1 className='text-center mb-4'>Socket.IO Chat</h1>

          <div className='alert alert-info text-center'>
            If you want to send or get messages from a room, you have to submit
            the room ID.
          </div>

          <div className='row justify-content-center mb-4'>
            <div className='col-md-6'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter Room ID'
                  onChange={e => setRoomId(e.target.value)}
                />
                <button className='btn btn-primary' onClick={Login}>
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className='row justify-content-center mb-4'>
            <div className='col-md-6'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter your message'
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='row justify-content-center mb-4'>
            <div className='col-md-6 text-center'>
              <button className='btn btn-success me-2' onClick={MessageToAll}>
                Send to All
              </button>
              <button className='btn btn-warning' onClick={MessageToRoom}>
                Send to Room
              </button>
            </div>
          </div>

          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <ul className='list-group'>
                {receivedMessages.map((msg, index) => (
                  <li key={index} className='list-group-item'>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>{' '}
      </div>{' '}
    </div>
  );
};

export default WebSocketApp;
