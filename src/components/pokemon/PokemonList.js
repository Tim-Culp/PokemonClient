import React, { useState, useEffect } from 'react'
import './PokemonList.css'

const PokemonList = (props) => {
    const [pokemon, setPokemon] = useState([]);

    const fetchPokemon = () => {
        let url = props.url;
        fetch(url, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            }
        })
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                setPokemon(res.pokemon);
            })
    }

    const displayPokemon = () => {
        if (pokemon) {
            return pokemon.map((pkmn, i) => {
                return (
                        <div key={i} id="pokemonCard" onClick={() => props.setSelectedPokemon(pkmn)} style = {{backgroundColor: props.selectedPokemon.id === pkmn.id ? "rgb(170, 255, 170)" : "white"}}>
                            <p style={{color: pkmn.gender === "Male" ? "#7687FF" : "#FF70AE", fontSize: pkmn.name.length > 8 ? "1.5vw" : "2vw"}}>"{pkmn.name}"</p>
                            <img src={pkmn.image} alt=""/>
                        </div>
                )
            }) 
        }
    }

    useEffect(fetchPokemon, [props.selectedPokemon]);

    return(
        <div>
            <div id="pokemonList">
                {displayPokemon()}
            </div>
        </div>
    )
}


export default PokemonList;