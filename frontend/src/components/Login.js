import apiHandle from './API_Access';
import '../styles/Login.css';
import React, {  useState } from "react";

function LoginPage({DoRerender}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? '/auth/login' : '/auth/register';


        apiHandle.post(endpoint, { username: username, password: password })
            .then( res => {
                // Si c'est une connexion :
                if (isLogin) {
                    localStorage.setItem('token', res.data.access_token);
                    DoRerender();

                    // Appel de la méthode onLoginSuccess pour signaler la réussite de la connexion
                } else {
                    // L'utilisateur a été enregistré. Switch to login mode.
                    setIsLogin(true);
                    setErrorMessage('Inscription réussie! Vous pouvez maintenant vous connecter.');
                    DoRerender();
                }
            })
            .catch(err => {
                const errorResponse = err.response && err.response.data ? err.response.data.message : err.message;
                console.error(`Login Request Failed: ${endpoint}`)
                setErrorMessage(`Erreur: ${errorResponse}`);
            })
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
            <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Nom d'utilisateur" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                <button type="submit">{isLogin ? 'Connexion' : 'Inscription'}</button>
            </form>
            {isLogin ? (
                <p>
                    Pas encore de compte?{' '}
                    <button  onClick={() => setIsLogin(false)}>
                        S'inscrire
                    </button>
                </p>
            ) : (
                <p>
                    Vous avez déjà un compte?{' '}
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>
                        Connexion
                    </span>
                </p>
            )}
        </div>
    );
}

export default LoginPage;
