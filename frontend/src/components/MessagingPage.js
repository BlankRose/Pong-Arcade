// frontend/src/components/MessagingPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assurez-vous d'installer axios avec npm install axios si vous ne l'avez pas déjà fait.

import APIHandle from './API_Access';

function MessagingPage() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Chargez les channels lors de la première renderisation
    APIHandle.get('/api/channels') // Remplacez par l'URL de votre API
      .then(response => {
        setChannels(response.data);
      })
      .catch(error => {
        console.error('Error loading channels', error);
      });
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      // Chargez les messages pour le channel sélectionné
      APIHandle.get(`/api/channels/${selectedChannel.id}/messages`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error loading messages', error);
        });
    }
  }, [selectedChannel]);

  const sendMessage = () => {
    if (newMessage.trim() !== '' && selectedChannel) {
      // Envoyez le nouveau message à l'API
      APIHandle.post(`/api/channels/${selectedChannel.id}/messages`, { content: newMessage })
        .then(response => {
          setMessages([...messages, response.data]);
          setNewMessage('');
        })
        .catch(error => {
          console.error('Error sending message', error);
        });
    }
  };

  return (
    <div>
      <div>
        <h2>Channels</h2>
        <ul>
          {channels.map(channel => (
            <li key={channel.id} onClick={() => setSelectedChannel(channel)}>
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map(message => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}></textarea>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessagingPage;
