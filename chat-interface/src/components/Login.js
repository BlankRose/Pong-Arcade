import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'http://localhost:4000/login' : 'http://localhost:4000/register';

    try {
      const response = await axios.post(endpoint, { username, password });

      // Si c'est une connexion :
      if (isLogin) {
        localStorage.setItem('token', response.data.access_token);
        // Redirigez vers la page principale
      } else {
        // L'utilisateur a été enregistré. Switch to login mode.
        setIsLogin(true);
        setErrorMessage('Inscription réussie! Vous pouvez maintenant vous connecter.');
      }

    } catch (error) {
      const errorResponse = error.response && error.response.data ? error.response.data : error.message;
      setErrorMessage(`Erreur: ${errorResponse}`);
    }
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
          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>
            S'inscrire
          </span>
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