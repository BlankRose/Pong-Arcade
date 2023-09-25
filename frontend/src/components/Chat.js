import React, { useEffect, useState } from 'react';
import '../styles/ChatPage.css';

function ChatPage({ onLogout }) {
    const [channels, setChannels] = useState([{ id: 1, name: "Channel 1" }, { id: 2, name: "Channel 2" }]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Charger les messages lorsqu'un canal est sélectionné
    useEffect(() => {
        if (selectedChannel) {
            // Remplacez par une requête fetch appropriée pour obtenir les messages du channel sélectionné
            setMessages([
                { id: 1, senderName: "User1", content: "Bonjour!" },
                { id: 2, senderName: "User2", content: "Salut!" },
            ]);
        }
    }, [selectedChannel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            // Remplacez par une requête fetch appropriée pour envoyer un nouveau message
            setMessages([...messages, { id: messages.length + 1, senderName: "Moi", content: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="chatPage">
            <h2>Messagerie</h2>
            <button onClick={onLogout}>Déconnexion</button>

            <div className="chatContainer">
                <div className="channelList">
                    {channels.map(channel => (
                        <div
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel.id)}
                            className={channel.id === selectedChannel ? 'selected' : ''}
                        >
                            {channel.name}
                        </div>
                    ))}
                </div>
                <div className="messageContainer">
                    <div className="messageList">
                        {messages.map(message => (
                            <div key={message.id}>
                                <strong>{message.senderName}:</strong> {message.content}
                            </div>
                        ))}
                    </div>
                    <form className="sendMessageForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Tapez votre message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;