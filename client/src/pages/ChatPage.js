import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container} from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// ----------------------------------------------------------------------

export default function Chat({ messages }) {
  return (
    <>
    <div className="chat-container">
      {messages.map((message, index) => (
        <div key={index} className="message">
          <p className="message-sender">{message.sender}</p>
          <p className="message-content">{message.content}</p>
        </div>
      ))}
    </div>
    </>
  );
};

