import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { Col, Row, Button } from 'reactstrap';

const PokemonFight = (props) => {
    const [fightingPokemon, setFightingPokemon] = useState({});
    const [pokemonToFight, setPokemonToFight] = useState({});
    const [isHosting, setIsHosting] = useState(false);

    // useEffect(()=>{

    //     return(() => {
    //         fetch('http://localhost:3003/api/pokemon/restall', {
    //             method: "PUT",
    //             headers: {
    //                 "content-type": "application/json",
    //                 "authorization": props.sessionToken
    //             }
    //         })
    //     })
    // }, [])

    const hostFight = () => {
        fetch('http://localhost:3003/api/pokemon/fight', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            },
            body: JSON.stringify({ pokemon: { id: fightingPokemon.id } })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setIsHosting(true);
            setFightingPokemon(res.pokemon);
            setPokemonToFight({});
        })
    }




    return(
        <div>
            <Row>
                <Col md="6">
                    <PokemonList url='http://localhost:3003/api/pokemon' sessionToken={props.sessionToken} selectedPokemon={fightingPokemon} setSelectedPokemon={setFightingPokemon}/>
                </Col>
                <Col md="6">
                    <PokemonList url='http://localhost:3003/api/pokemon/fight' sessionToken={props.sessionToken} selectedPokemon={pokemonToFight} setSelectedPokemon={setPokemonToFight}/>
                    
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Button id="hostButton" onClick={hostFight}>Host</Button>
                    <p>{fightingPokemon.name}</p>
                </Col>
                <Col md="6">
                    <Button id="joinButton">Fight</Button>
                    <p>{pokemonToFight.name}</p>
                </Col>
            </Row>
        </div>
    )
}

export default PokemonFight;