import React, { useState, useEffect } from 'react'
import { Form, FormGroup, Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import './PokemonEdit.css'
import Trash from '../../assets/trash.png'
import Unknown from '../../assets/unknown.png';

const PokemonEdit = (props) => {
    const [name, setName] = useState(props.pokemonToEdit.name);
    const [error, setError] = useState('');
    let timeout;
    const history = useHistory();
    // console.log(props);
    // console.log(`"${props.pokemonToEdit.type}"`);

    useEffect(()=> {
        if (error) {
            timeout = setTimeout(()=> setError(''), 2000);
        }
        return (() => {clearTimeout(timeout)})
    }, [error])

    const handleSubmit = (e) => {
        // console.log("SUBMITTED")
        if (!props.pokemonToEdit.id) {
            setError('No Pokémon to edit!');
        } else if (name === props.pokemonToEdit.name) {
            setError("No change made to the name!")
        } else {
            e.preventDefault();
            if (!name) {setError("Please enter a name for your Pokémon!")} else {
                fetch(`http://localhost:3003/api/pokemon/rename/${props.pokemonToEdit.id}`, {
                    method: "PUT",
                    headers: {
                        'content-type': 'application/json',
                        'authorization': props.sessionToken
                    },
                    body: JSON.stringify({
                        pokemon: {
                            name: name
                        }
                    })
                        
                })
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    history.push('/');
                })
            }
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        if (!props.pokemonToEdit.id) {
            setError('No Pokémon to delete!');
        } else {
            fetch(`http://localhost:3003/api/pokemon/delete/${props.pokemonToEdit.id}`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    'authorization': props.sessionToken
                }
            })
                .then(res => res.json())
                .then(res => {
                    // console.log(res);
                    if (res.destroyed > 0) {
                        history.push('/');
                    } else {
                        setError('Something went wrong when deleting.');
                    }
                })
                .catch(() => setError('Something went wrong when deleting.'))
        }
    }


    return (
        // <div>
        //     <Form>
        //         <FormGroup>
        //             <Label htmlFor="name">Name: </Label>
        //             <Input value={name} onChange={e => setName(e.target.value)}/>
        //         </FormGroup>
        //     </Form>
        // </div>
        <div>
                <h2 id="editTitle">Edit your Pokémon</h2>
                <h4 id="error" style={{display: error ? "block" : "none"}}>{error}</h4>
            <Row>
            <Col md="6">
                <Form id="editForm">
                    <FormGroup>
                        <label htmlFor="name">Name: </label>
                        <Input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/>
                    </FormGroup> 
                    <FormGroup>
                        <label htmlFor="pokemon">Pokémon: </label>
                        <Input className="disabled" value={props.pokemonToEdit.pokemon} disabled name="pokemon" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="sex">Sex: </label>
                        <Input name="sex" className="disabled" disabled value={props.pokemonToEdit.gender}/>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="pkmntype">Types: </label>
                        <Input name="pkmntype" className="disabled"  disabled value={props.pokemonToEdit.type}/>
                    </FormGroup>
                    
                </Form>      
            </Col>
            <Col md="6">
                <img id="pokemonImage" src={props.pokemonToEdit.image ? props.pokemonToEdit.image : Unknown}/>
                <div id="editButtonsDiv">
                    <Button type="button" onClick={(e) => {handleSubmit(e)}} id="editButton">Edit</Button>
                    <Button type="button" onClick={(e) => {handleDelete(e)}} id="deleteButton">
                        <img src={Trash} alt=""/>
                    </Button>
                </div>
            </Col>
            </Row>
        </div>
    )
}

export default PokemonEdit;