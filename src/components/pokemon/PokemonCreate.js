import React, { useState, useEffect } from 'react'
import {Form, FormGroup, Input, Button, Col, Row} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import './PokemonCreate.css'
import Unknown from '../../assets/unknown.png'

const PokemonCreate = (props) => {
    const [name, setName] = useState('');
    const [pokemon, setPokemon] = useState('');
    const [sex, setSex] = useState('Male');
    const [image, setImage] = useState(Unknown);
    const [type, setType] = useState([]);
    const [error, setError] = useState('');
    const history = useHistory();
    let timeout;

    useEffect(()=> {
        fetchImage();
    }, [pokemon, sex])

    useEffect(()=> {
        if (error) {
            timeout = setTimeout(()=> setError(''), 2000);
        }
        return (() => {clearTimeout(timeout)})
    }, [error])

    const fetchImage = () => {
        setImage(Unknown);
        setType([]);
        let pkmn = pokemon.toLowerCase();

        fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.sprites) {
                    // console.log(res);
                    if (sex === "Female" && res.sprites.front_female) {
                        setImage(res.sprites.front_female);
                    } else {
                        setImage(res.sprites.front_default);
                    }
                }
                if (res.types) {setType(
                        res.types.map((type, index) => {
                            return (
                                `${type.type.name[0].toUpperCase() + 
                                type.type.name.substring(1, type.type.name.length).toLowerCase()}`
                            )
                        })
                    )}

            })
            .catch()
    }

    const handleSubmit = (e) => {
        // console.log("SUBMITTED")
        e.preventDefault();
        if (!name) {setError("Please enter a name for your Pokémon!")} else if (image === Unknown) {setError("Your Pokémon choice doesn't exist!")} else {
            fetch('http://localhost:3003/api/pokemon/create', {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'authorization': props.sessionToken
                },
                body: JSON.stringify({
                    pokemon: {
                        name: name,
                        pokemon: pokemon[0].toUpperCase() + pokemon.substring(1, pokemon.length).toLowerCase(),
                        type: type.join(),
                        image: image,
                        gender: sex
                    }
                })
                    
            })
            .then(res => res.json())
            .then(res => {
                if (res.code === "badToken") {
                    props.clearToken();
                } else {
                    history.push('/');
                }
                // console.log(res)
                // console.log(type.join());
            })
        }
    }

    return(
        <div>
                <h2 id="createTitle">Create your Pokémon</h2>
                <h4 id="error" style={{display: error ? "block" : "none"}}>{error}</h4>
            <Row>
            <Col md="6">
                <Form id="createForm">
                    <FormGroup>
                        <label htmlFor="name" id="nameLabel">Name: </label>
                        <Input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/>
                    </FormGroup> 
                    <FormGroup>
                        <label htmlFor="pokemon" id="pokemonLabel">Pokémon: </label>
                        <Input type="text" name="pokemon" value={pokemon} onChange={e => setPokemon(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="sex" id="pokemonSex">Sex: </label>
                        <Input type="select" name="sex" value={sex} onChange={e => setSex(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="type">Types: </label>
                        <Input id="pokemonType" className="disabled" disabled value={type.join()}/>
                    </FormGroup>
                    
                </Form>      
            </Col>
            <Col md="6">
                <img id="pokemonImage" src={image}/>
                <Button type="button" onClick={(e) => {handleSubmit(e)}} id="createButton">Create</Button>
            </Col>
            </Row>
        </div>
    )
}

export default PokemonCreate;