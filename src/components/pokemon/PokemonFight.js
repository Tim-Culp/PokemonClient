import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { Col, Row, Button } from 'reactstrap';

const PokemonFight = (props) => {
    const [fightingPokemon, setFightingPokemon] = useState({});
    const [choseFP, setChoseFP] = useState(false);
    const [pokemonToFight, setPokemonToFight] = useState({});
    const [chosePTF, setChosePTF] = useState(false);
    const [isHosting, setIsHosting] = useState(false);
    const [hasFought, setHasFought] = useState(false);
    const [error, setError] = useState('');
    
    // info variables for after fight
    const [hasWon, setHasWon] = useState('');
    const [oldLvl, setOldLvl] = useState(0);
    const [newLvl, setNewLvl] = useState(0);
    const [opponentOldLvl, setOpponentOldLvl] = useState(0);
    const [opponentNewLvl, setOpponentNewLvl] = useState(0);
    let timeout;

    useEffect(() => {
        timeout = setTimeout(()=> {setError('')}, 2000);

        return (()=> {clearTimeout(timeout)})
    }, [error])

    useEffect(()=>{

        return(() => {
            fetch('http://localhost:3003/api/pokemon/restall', {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "authorization": props.sessionToken
                }
            })
        })
    }, [])

    const hostFight = () => {
        fetch('http://localhost:3003/api/pokemon/hostfight', {
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

    const joinFight = () => {
        // console.log("ID:", pokemonToFight.id)
        // console.log("FID:", fightingPokemon.id)
        if (fightingPokemon.image && pokemonToFight.image) {
            fetch(`http://localhost:3003/api/pokemon/joinfight/${pokemonToFight.id}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'authorization': props.sessionToken
                },
                body: JSON.stringify({pokemon: {id: fightingPokemon.id}})
            })
                .then(res => res.json())
                .then(res => {
                    if (res.code === "notReady") {
                        setError("The opponent's Pokémon is not prepared to fight.")
                    } else {
                        console.log(res);
                        setOldLvl(res.pokemon1.oldLevel);
                        setNewLvl(res.pokemon1.pokemon.level);
                        setOpponentOldLvl(res.pokemon2.oldLevel);
                        setOpponentNewLvl(res.pokemon2.pokemon.level);
                        setHasWon(res.pokemon1.oldLevel < res.pokemon1.pokemon.level);
                        setHasFought(true);
                    }
                })
        } else {
            setError('Something went wrong. Please refresh.')
        }
    }

    const checkFight = () => {
        fetch(`http://localhost:3003/api/pokemon/${fightingPokemon.id}`, {
            method: "get",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            }
        })
            .then(res => res.json())
            .then(myPkmn => {
                console.log(myPkmn);
                if (myPkmn.pokemon.activity.indexOf('fought') === -1) {
                    setError("No one has fought your Pokémon yet!");
                } else {
                    let opponentID = myPkmn.pokemon.activity.substring(7, myPkmn.pokemon.activity.length);
                    console.log("FOUGHT! ID: '" + opponentID + "'");
                    fetch(`http://localhost:3003/api/pokemon/${opponentID}`, {
                        method: "get",
                        headers: {
                            'content-type': 'application/json',
                            'authorization': props.sessionToken
                        }
                    })
                        .then(res => res.json())
                        .then(oppPkmn => {
                            console.log("oppPkmn: ", oppPkmn)
                            setPokemonToFight(oppPkmn.pokemon);
                            setNewLvl(myPkmn.pokemon.level);
                            setOldLvl(fightingPokemon.level);
                            setOpponentNewLvl(oppPkmn.pokemon.level);
                            setOpponentOldLvl(pokemonToFight.level);
                            setHasWon(myPkmn.pokemon.level > fightingPokemon.level);
                            setHasFought(true);
                            setIsHosting(false);
                        })
                }
            })
    }


    return(
        //pokemon select
        !isHosting && !hasFought ? (
            <div>
                {!choseFP ?
                    <Row>
                        <Col>
                            <PokemonList url='http://localhost:3003/api/pokemon' clearToken={props.clearToken} sessionToken={props.sessionToken} selectedPokemon={fightingPokemon} setSelectedPokemon={setFightingPokemon}/>

                            <Button onClick={() => {fightingPokemon.level > 0 ? setChoseFP(true) : !fightingPokemon.image ? setError('Please select your Pokémon first!') : setError('Please select a Pokémon with a level!')}}>
                                Select
                            </Button>
                            <p>{fightingPokemon.name}</p>
                        </Col>
                    </Row> 
                : null }

                {choseFP && !chosePTF ?
                    <Row>
                        <Col md="6">
                            <Button id="hostButton" onClick={hostFight}>Host</Button>
                            
                        </Col>
                        <Col md="6">
                            <PokemonList url='http://localhost:3003/api/pokemon/fight' sessionToken={props.sessionToken} clearToken={props.clearToken} selectedPokemon={pokemonToFight} setSelectedPokemon={setPokemonToFight}/>
                            <Button id="joinButton" onClick={() => pokemonToFight.image ? joinFight() : setError('Please select a Pokémon to fight!')}>Fight</Button>
                            <p>{pokemonToFight.name}</p>
                        </Col>
                    </Row>
                : null }
                {error ? <h3 id="error">{error}</h3> : null }
        </div>
        //host a fight
        ) : isHosting ? (
            <div>
                {/* ping for database will depend on isHosting */}
                <h3>Hosting battle for {`${fightingPokemon.name}`}...</h3>
                <img src={fightingPokemon.image} alt=""/>
                <Button onClick={checkFight}>Check for Opponent</Button>
                {error ? <h3 id="error">{error}</h3> : null }
            </div>

        //join a hosted fight
        ) : hasFought ? (
            <div>
                        <h3>Your Pokémon {hasWon ? "Won!": "Lost!"}</h3>
                        <p>Your pokémon {`${fightingPokemon.name}`} fought its opponent, {`${pokemonToFight.name}`}, valiantly.</p>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={fightingPokemon.image} alt="" style={{float: "left"}}/>
                        <p>{`Old level: ${oldLvl}`} </p> <br/>
                        <p>{`New level: ${newLvl}`} </p>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={pokemonToFight.image} alt=""/>
                        {opponentOldLvl !== undefined ? <p>{`Opponent's Old level: ${opponentOldLvl}`}</p> : null}
                        <p>{`Opponent's New level: ${opponentNewLvl}`}</p>
                    </div>
                {error ? <h3 id="error">{error}</h3> : null }
            </div>

        //literally nothing's happening
        ) : null
    )
}

export default PokemonFight;