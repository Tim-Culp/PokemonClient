import React, { useState, useEffect } from 'react'
import {Table as table, Card, CardImg, Col as div, CardBody, CardHeader, Container, Row} from 'reactstrap';
import {Route, Router, Link, Switch, useHistory} from 'react-router-dom'
import './PokemonGrid.css';
import Ball from '../../assets/ball.png'

const PokemonGrid = (props) => {
    const [pokemon, setPokemon] = useState([]);
    
    const history = useHistory();

    let fetchPokemon = () => {
    fetch('http://localhost:3003/api/pokemon', {
        method: "GET",
        headers: {
            'content-type': 'application/json',
            'authorization': props.sessionToken
        }
    })
        .then(res => res.json())
        .then(res => {
            // console.log(res);
            if (res.pokemon) {
                setPokemon(res.pokemon);
            } else if (res.code === "badToken") {
                props.clearToken();
            }
        })
    }

    const editPokemon = (pkmn) => {
        props.setPokemonToEdit(pkmn);
        history.push('/edit');
        
    }

    const displayPokemon = () => {
        let count = 0;
        return pokemon.map((pkmn, i) => {
            let base = (
                    <div style={{display: "block", float: "left"}}>
                        <Card onClick={() => editPokemon(pkmn)} className="pokemonCard" style={{color: pkmn.gender === "Male" ? "#7687FF" : "#FF70AE", cursor: "pointer"}}>
                            <div className="pokemonImageDiv">
                                <CardImg src={pkmn.image} alt={pkmn.pokemon}/>
                                <p className="pokemonLevel">lvl. {pkmn.level}</p>
                            </div>
                            <CardHeader>
                                <h4>"{pkmn.name}"</h4>
                            </CardHeader>
                            <CardBody>
                                <p>{pkmn.pokemon}</p>
                            </CardBody>
                        </Card>
                    </div>
            )
            return base;
        });
    }

    useEffect(fetchPokemon, []);

    
    return(
        
        <div id="pokemonTableDiv">
            <div>
                <div id="pokemonTable" style={{overflow: pokemon && pokemon.length > 10 ? "scroll" : "visible"}}>
                    {pokemon ? displayPokemon() : null}
                </div>
                    <div id="createLinkDiv">
                        <Link id="link" to="/create">
                            <img id="createPokemonLink"src={Ball}/>
                        </Link>
                </div>

            </div>
        </div>
    )
}

export default PokemonGrid;