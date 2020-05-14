import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { Col, Row, Button } from 'reactstrap';
import APIURL from '../../helpers/environment';
import './PokemonFight.css'
import Loading from '../../assets/loading.png';


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
    let loadAnimInterval;
    const [loadAnimRot, setLoadAnimRot] = useState(15);
    let checkFightTimeout;

    //recursive checkfighttimoutset function which periodically pings the database for changes to pokemon
    const checkFightTimeoutSet = () => {
        checkFightTimeout = setTimeout(() => {
            checkFight();
            checkFightTimeoutSet();
        }, 10000)
    }

    const loadAnimIntervalSet = () => {
        if (isHosting) {
            clearTimeout(loadAnimInterval);
            loadAnimInterval = setTimeout(()=> {
                loadAnimRot > 360 ? setLoadAnimRot(1) : setLoadAnimRot(loadAnimRot + 4);
                console.log(loadAnimRot);
                // console.log('hi')
            }, 80)
        }
    }

    //once we start hosting, start the recursive checkfighttimoutset function
    useEffect(()=> {
        if (isHosting) {
            checkFightTimeoutSet();
            loadAnimIntervalSet();

        return (() => {clearTimeout(checkFightTimeout); clearTimeout(loadAnimInterval)});
        }
    }, [isHosting])

    useEffect(()=> {
        if (loadAnimRot > 0) {
            loadAnimIntervalSet();
        }
    }, [loadAnimRot])
    

    useEffect(() => {
        timeout = setTimeout(()=> {setError('')}, 2000);

        return (()=> {clearTimeout(timeout)});
    }, [error])

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

    const hostFight = () => {
        fetch(`${APIURL}/api/pokemon/hostfight`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            },
            body: JSON.stringify({ pokemon: { id: fightingPokemon.id } })
        })
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            setIsHosting(true);
            setFightingPokemon(res.pokemon);
            setPokemonToFight({});
        })
    }

    const joinFight = () => {
        // //console.log("ID:", pokemonToFight.id)
        // //console.log("FID:", fightingPokemon.id)
        if (fightingPokemon.image && pokemonToFight.image) {
            fetch(`${APIURL}/api/pokemon/joinfight/${pokemonToFight.id}`, {
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
                        //console.log(res);
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
        fetch(`${APIURL}/api/pokemon/${fightingPokemon.id}`, {
            method: "get",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            }
        })
            .then(res => res.json())
            .then(myPkmn => {
                //console.log(myPkmn);
                if (myPkmn.pokemon.activity.indexOf('fought') === -1) {
                    setError("No one has fought your Pokémon just yet!");
                } else {
                    let opponentID = myPkmn.pokemon.activity.substring(7, myPkmn.pokemon.activity.length);
                    //console.log("FOUGHT! ID: '" + opponentID + "'");
                    fetch(`${APIURL}/api/pokemon/${opponentID}`, {
                        method: "get",
                        headers: {
                            'content-type': 'application/json',
                            'authorization': props.sessionToken
                        }
                    })
                        .then(res => res.json())
                        .then(oppPkmn => {
                            //console.log("oppPkmn: ", oppPkmn)
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
                            <h3 style={{fontSize:"2vw"}}>Select your Pokémon</h3>
                            <PokemonList url={`${APIURL}/api/pokemon`} clearToken={props.clearToken} sessionToken={props.sessionToken} selectedPokemon={fightingPokemon} setSelectedPokemon={setFightingPokemon}/>

                            <Button style={{marginTop:"0.5vw"}} id="joinButton" onClick={() => {fightingPokemon.level > 0 ? setChoseFP(true) : !fightingPokemon.image ? setError('Please select your Pokémon first!') : setError('Please select a Pokémon with a level!')}}>
                                Select
                            </Button>
                        </Col>
                    </Row> 
                : null }

                {choseFP && !chosePTF ?
                    <Row>
                        <Col md="6">
                            <Button id="hostButton" onClick={hostFight}>Host Battle</Button>
                            
                        </Col>
                        <Col md="6">
                            <h4 id="joinFightTitle">Or, battle a Pokémon who is already hosting.</h4>
                            <PokemonList url={`${APIURL}/api/pokemon/fight`} sessionToken={props.sessionToken} clearToken={props.clearToken} selectedPokemon={pokemonToFight} setSelectedPokemon={setPokemonToFight}/>
                            <Button id="joinButton" onClick={() => pokemonToFight.image ? joinFight() : setError('Please select a Pokémon to fight!')}>Fight</Button>
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
                <img src={Loading} alt="" style={{transform: `rotate(${loadAnimRot}deg)`}}/>
                {/* <Button onClick={checkFight}>Check for Opponent</Button> */}
                {error ? <h3 id="error">{error}</h3> : null }
            </div>

        //join a hosted fight
        ) : hasFought ? (
            <div id="hasFoughtDiv">
                        <h3>Your Pokémon {hasWon ? "Won!": "Lost!"}</h3>
                        <p>Your pokémon {`${fightingPokemon.name}`} fought its opponent, {`${pokemonToFight.name}`}, valiantly.</p>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={fightingPokemon.image} alt="" />
                        <div>
                            <p>{`${fightingPokemon.name}'s old level: ${oldLvl}`} </p> <br/>
                            <p>{`${fightingPokemon.name}'s new level: ${newLvl}`} </p>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={pokemonToFight.image} alt=""/>
                        <div>
                            {opponentOldLvl !== undefined ? <p>{`${pokemonToFight.name}'s Old level: ${opponentOldLvl}`}</p> : null} <br/>
                            <p>{`${pokemonToFight.name}'s New level: ${opponentNewLvl}`}</p>
                        </div>
                    </div>
                    <Button onClick={()=>{window.location.reload()}}>Fight again?</Button>
                {error ? <h3 id="error">{error}</h3> : null }
            </div>

        //literally nothing's happening
        ) : null
    )
}

export default PokemonFight;