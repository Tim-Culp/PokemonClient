import React, { useState, useEffect } from 'react';
// import logo from './assets/iconball.ico';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Auth from './components/auth/Auth';
import PokemonIndex from './components/pokemon/PokemonIndex';
import {BrowserRouter} from 'react-router-dom';
import Splash from './components/auxiliary/Splash'

function App() {
  const [sessionToken, setSessionToken] = useState('');

  const [onSplash, setOnSplash] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pokemonSessionToken')) {
      setSessionToken(localStorage.getItem('pokemonSessionToken'));
    }
  }, [])

  const updateToken = (token) => {
    if (token) {
      localStorage.setItem('pokemonSessionToken', token);
      setSessionToken(token);
      //console.log("session token updated.");
    }
  }

  const clearToken = () => {
    localStorage.removeItem('pokemonSessionToken');
    setSessionToken('');
    //console.log("session token cleared.")
  }

  const protectedViews = () => {
    return (
      sessionToken === localStorage.getItem('pokemonSessionToken') ? <PokemonIndex clearToken={clearToken} loadSplash={() => setOnSplash(true)} sessionToken={sessionToken}/> : <Auth updateToken={updateToken}/>
    )
  }

  return (
    <div>
      <BrowserRouter>
        {!onSplash ? protectedViews() : <Splash/>}
      </BrowserRouter>
    </div>
  );
}

export default App;
