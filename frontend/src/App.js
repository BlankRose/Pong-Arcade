import logo from './assets/logo.svg';
import './styles/App.css';
import apiHandle from './components/API_Access'
import { useState, useEffect } from 'react';
import Login from './components/Login';
import ChatPage from './components/Chat';


function App() {
    const [response, setResponse] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // état de la connexion

    useEffect(() => {
        apiHandle.get("/").then((res) => {
            setResponse(res.data);
        }).catch((err) => {
            setResponse("Failed to connect to API... Please retry later.")
        });
    }, []);

    const onLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const onLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    {response}
                </p>
                {isLoggedIn ? (
                    // Ici, vous pourriez avoir votre composant de messagerie/chat
                    // et vous pouvez lui passer onLogout comme props pour gérer la déconnexion
                    <ChatPage onLogout={onLogout} />
                ) : (
                    <Login onLoginSuccess={onLoginSuccess} />
                )}
            </header>
        </div>
    );
}

export default App;
