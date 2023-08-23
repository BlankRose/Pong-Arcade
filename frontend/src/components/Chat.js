import React from 'react';

function ChatPage({ onLogout }) {
    return (
        <div>
            <h2>Messagerie</h2>
            {/* ... (Votre composant de messagerie) */}
            <button onClick={onLogout}>Déconnexion</button>
        </div>
    );
}

export default ChatPage;
