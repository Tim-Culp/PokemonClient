import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { Col, Row, Button } from 'reactstrap';
import Training from '../../assets/training.png'
import './PokemonTrain.css'
import APIURL from '../../helpers/environment';


const PokemonTrain = (props) => {
    const [pokemonToTrain, setPokemonToTrain] = useState({});
    const [error, setError] = useState('');
    let timeout;

    useEffect(()=> {
        if (error) {
            timeout = setTimeout(()=> setError(''), 2000);
        }
        return (() => {clearTimeout(timeout)})
    }, [error])

    //rest all pokemon on page load
    useEffect(()=>{

        return(() => {
            fetch(`${APIURL}/api/pokemon/restall`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "authorization": props.sessionToken
                }
            })
        })
    }, [])

    const levelUp = () => {
        if (!pokemonToTrain.image) {
            setError(`You haven't selected a Pokémon to train!`);
        } else {
            fetch(`${APIURL}/api/pokemon/train/${pokemonToTrain.id}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'authorization': props.sessionToken
                }
            })
                .then(res => res.json())
                .then(res => {
                    //console.log(res);
                    setPokemonToTrain(res.pokemon);
                })
        }
    }

    return(
        <div>
            <Row>
                <Col md="7" sm="12">
                    <h2 id="trainingTitle">Training: {pokemonToTrain.image ? `"${pokemonToTrain.name}"`: ""}</h2>
                    <div id="trainingDiv">
                        <img id="pokemonTrainingBG"src={Training} alt=""/>
                        <img id="pokemonTrainImage" src={pokemonToTrain.image} alt=""/>
                    </div>
                    <div id="trainingControlsDiv">
                        <Row>
                            <Col md="6">
                                {pokemonToTrain.image ? <h1 id="pokemonTrainLevel">LVL. {pokemonToTrain.level}</h1> : null}
                            </Col>
                            <Col md="6">
                                <Button type="button" id="trainButton" onClick={levelUp}>Train!</Button>
                            </Col>

                        </Row>
                    </div>
                    {error ? <h3 id="error">{error}</h3> : null}
                </Col>
                <Col md="5" sm="12">
                    <PokemonList clearToken={props.clearToken} url={`${APIURL}/api/pokemon`} sessionToken={props.sessionToken} selectedPokemon={pokemonToTrain} setSelectedPokemon={setPokemonToTrain}/>
                </Col>

            </Row>
        </div>
    )
}

export default PokemonTrain;