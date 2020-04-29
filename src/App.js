import React, { useState, useEffect } from 'react';
// import logo from './assets/iconball.ico';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Auth from './components/auth/Auth';
import PokemonIndex from './components/pokemon/PokemonIndex';
import {BrowserRouter} from 'react-router-dom';

function App() {
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    if (localStorage.getItem('pokemonSessionToken')) {
      setSessionToken(localStorage.getItem('pokemonSessionToken'));
    }
  }, [])

  const updateToken = (token) => {
    if (token) {
      localStorage.setItem('pokemonSessionToken', token);
      setSessionToken(token);
      console.log("session token updated.");
    }
  }

  const clearToken = () => {
    localStorage.removeItem('pokemonSessionToken');
    setSessionToken('');
    console.log("session token cleared.")
  }

  const protectedViews = () => {
    return (
      sessionToken === localStorage.getItem('pokemonSessionToken') ? <PokemonIndex clearToken={clearToken} sessionToken={sessionToken}/> : <Auth updateToken={updateToken}/>
    )
  }

  return (
    <div>
      <BrowserRouter>
        {protectedViews()}
      </BrowserRouter>
    </div>
  );
}

export default App;
