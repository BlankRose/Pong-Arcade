import React from 'react';

function ChatPage({ onLogout }) {
	/*const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [newChannelName, setNewChannelName] = useState('');
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketIo = io(apiBaseURL);
		setSocket(socketIo);

		socketIo.on('newMessage', (message) => {
			if (message.channelId === selectedChannel) {
				setMessages((prevMessages) => [...prevMessages, message]);
			}
		});

		socketIo.on('newChannel', (channel) => {
			setChannels((prevChannels) => [...prevChannels, channel]);
		});

		return () => {
			socketIo.disconnect();
		};
	}, [selectedChannel]);

	useEffect(() => {
		API_Access.get('/channels', withAuth())
			.then(res => {
				console.log(`Return: ${res}`)
			})
			.catch(err => {
				console.error(`Error: ${err}`)
				setChannels([])
			})
		}, []);

	const handleCreateChannel = (e) => {
		e.preventDefault();
		fetch(`${apiBaseURL}/channels`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: newChannelName }),
		})
		.then(response => response.json())
		.then(newChannel => {
			setChannels([...channels, newChannel]);
			setNewChannelName('');
		})
		.catch(console.error);
	};

	const handleJoinChannel = (channelId) => {
		setSelectedChannel(channelId);
		fetch(`${apiBaseURL}/channels/${channelId}/messages`)
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data)) {
					setMessages(data);
				} else {
					console.error('Data from server is not an array:', data);
					setMessages([]); // set messages as an empty array if the data is not an array
				}
			})
			.catch(console.error);
	};

	const handleSubmitMessage = (e) => {
		e.preventDefault();
		if (newMessage.trim() && socket) {
			socket.emit('sendMessage', { content: newMessage, channelId: selectedChannel });
			setNewMessage('');
		}
	};

	return (
		<div className="chatPage">
			<h2>Messagerie</h2>
			<button onClick={onLogout}>Déconnexion</button>

			<div className="chatContainer">
				<div className="channelList">
					{channels ? channels.map(channel => (
						<div
							key={channel.id}
							onClick={() => handleJoinChannel(channel.id)}
							className={channel.id === selectedChannel ? 'selected' : ''}
						>
							{channel.name}
						</div>
					)) : undefined}
					<form onSubmit={handleCreateChannel}>
						<input 
							type="text"
							placeholder="Nom du nouveau salon"
							value={newChannelName}
							onChange={(e) => setNewChannelName(e.target.value)}
						/>
						<button type="submit">Créer</button>
					</form>
				</div>
				<div className="messageContainer">
					<div className="messageList">
						{messages.map((message, index) => (
							<div key={index}>
								<strong>{message.senderName}:</strong> {message.content}
							</div>
						))}
					</div>
					<form className="sendMessageForm" onSubmit={handleSubmitMessage}>
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
	);*/

	return(
		<div>test</div>
	)

}

		

export default ChatPage;
