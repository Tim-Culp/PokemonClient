import React, { useState } from 'react';
import {Route, NavLink, Switch, BrowserRouter} from 'react-router-dom';
import {Button, Row, Col, Container as div} from 'reactstrap';
import PokemonGrid from './PokemonGrid';
import PokemonCreate from './PokemonCreate';
import PokemonEdit from './PokemonEdit'
import './PokemonIndex.css';
import LogOut from '../../assets/logout.png';

const PokemonIndex = (props) => {
    const [pokemonToEdit, setPokemonToEdit] = useState({});
    return(
        <div>
                <Col md={{size: 2}} id="sidebarCol">
                    <div id="cornerStyle"></div>
                    <ul className="sidebarList">
                        <li><NavLink id="sidebarPokemon" exact to="/">Pokémon</NavLink></li>
                        <li><NavLink id="sidebarTraining" to="/training">Training</NavLink></li>
                        <li><NavLink id="sidebarFighting" to="/fighting">Fighting</NavLink></li>
                    </ul>

                    <div id="logOutDiv">
                        <img id="logOut" src={LogOut} height="75" onClick={props.clearToken} alt="log out"/>
                    </div>
                
                </Col>
                {/* <Row id="mainRow"> */}
                    <Col id="routerCol" lg={{size: 10, offset:2}} md={{size: 10, offset:2}} sm="12">
                        <div id="gridContainer">
                            <Switch>
                                <Route exact path="/">
                                    <PokemonGrid clearToken={props.clearToken} setPokemonToEdit={setPokemonToEdit} sessionToken={props.sessionToken}/>
                                </Route>
                                <Route exact path="/create">
                                    <PokemonCreate sessionToken={props.sessionToken}/>
                                </Route>
                                <Route path="/edit">
                                    <PokemonEdit pokemonToEdit={pokemonToEdit} sessionToken={props.sessionToken}/>
                                </Route>
                            </Switch>
                            
                        </div>
                    </Col>
                {/* </Row> */}
        </div>
    )
}

export default PokemonIndex;