import { useState } from 'react';
import { Stack, Typography, Divider, TextField, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/iconify';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello', sender: 'user' },
    { id: 2, text: 'Hi!', sender: 'other' },
  ]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'user' }]);
      setMessage('');
    }
  };

  const handleInputEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Stack direction="column" spacing={3} sx={{ p: 4, height: '100vh' }}>
      <Typography variant="h4">Chatty Chat</Typography>
      <Paper sx={{ p: 2, height: '60vh', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
      </Paper>
      <Divider />
      <Stack direction="row" alignItems="center" spacing={1}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onKeyDown={handleInputEnter}
          onChange={(event) => setMessage(event.target.value)}
        />
        <LoadingButton variant="contained" onClick={handleSendMessage}>
          Send
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

function Message({ text, sender }) {
  const isUser = sender === 'user';
  const alignment = isUser ? 'flex-end' : 'flex-start';
  const bgColor = isUser ? '#DCF8C6' : '#F1F0F0';

  return (
    <Stack direction="column" alignItems={alignment} sx={{ my: 1 }}>
      <Paper
        sx={{
          maxWidth: '70%',
          p: 1,
          borderRadius: 1,
          backgroundColor: bgColor,
        }}
      >
        <Typography variant="body2">{text}</Typography>
      </Paper>
    </Stack>
  );
}