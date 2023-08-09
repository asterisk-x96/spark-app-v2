import React, { useEffect, useState } from 'react';
import { Stack, Typography, Divider, TextField, Paper, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/iconify';

import { useUserContext } from '../UserContext';

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({}); // Store messages for different friends

  const { user } = useUserContext();
  const [userFriends, setUserFriends] = useState([]);
  const [friendDetails, setFriendDetails] = useState([]);

  // Fetch user's friend details and messages on initial load
  useEffect(() => {
    const fetchFriendDetails = async (friendId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-details/${friendId}`);
        const data = await response.json();
        return { [friendId]: data };
      } catch (error) {
        console.error('Error fetching friend details:', error);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get-friends/${user.id}`);
        const data = await response.json();
        setUserFriends(data.friends);

        const friendDetailsPromises = data.friends.map((friend) => fetchFriendDetails(friend));

        const friendDetailsArray = await Promise.all(friendDetailsPromises);

        const updatedFriendDetails = friendDetailsArray
          .map((friendDetail, index) => {
            if (friendDetail) {
              const friendId = data.friends[index];
              return { id: friendId, ...friendDetail[friendId] };
            }
            return null;
          })
          .filter(Boolean);

        setFriendDetails(updatedFriendDetails);

        // Initialize empty messages for each friend
        const initialMessages = {};
        updatedFriendDetails.forEach((friend) => {
          initialMessages[friend.id] = [];
        });
        setMessages(initialMessages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { id: messages[selectedFriend.id].length + 1, text: message, sender: 'user' };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedFriend.id]: [...prevMessages[selectedFriend.id], newMessage],
      }));
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
    <Stack direction="row" spacing={0}>
      <Sidebar friendDetails={friendDetails} setSelectedFriend={setSelectedFriend} />
      {selectedFriend ? (
        <ChatArea
          selectedFriend={selectedFriend}
          messages={messages[selectedFriend.id]}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handleInputEnter={handleInputEnter}
        />
      ) : (
        <Typography variant="body1" sx={{ p: 4 }}>
          Select a friend to start chatting
        </Typography>
      )}
    </Stack>
  );
}

function Sidebar({ friendDetails, setSelectedFriend }) {
  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <Stack
      sx={{
        width: '20%',
        p: 4,
        height: '100vh',
        borderRight: '1px solid #E0E0E0',
        overflowY: 'auto',
        backgroundColor: '#F5F5F5',
      }}
    >
      <Typography variant="h6">Friends</Typography>
      {friendDetails?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} onClick={() => handleFriendClick(friend)} />
      ))}
    </Stack>
  );
}

function FriendCard({ friend, onClick }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ mt: 3, p: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { backgroundColor: '#F5F5F5' } }}
      onClick={onClick}
    >
      <Avatar src={friend.avatar} alt={`${friend.firstName} ${friend.lastName}`} />
      <Typography>{`${friend.firstName}`}</Typography>
    </Stack>
  );
}

function ChatArea({ selectedFriend, messages, message, setMessage, handleSendMessage, handleInputEnter }) {
  return (
    <Stack direction="column" spacing={3} sx={{ p: 4, height: '80vh', width: '80%' }}>
      <Typography variant="h5">Chatty Chat</Typography>
      <Paper sx={{ p: 2, height: '60vh', overflowY: 'scroll', display: 'flex', flexDirection: 'column', borderRadius: 1, backgroundColor: 'transparent' }}>
        {messages?.map((msg) => (
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
