import React, { useState, useEffect } from 'react'
import { Col, Row, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const Splash = () => {
    return(
        <div>
            <Row style={{marginTop: "40px"}}>
                <Col md={{size: 8, offset: 2}} style={{backgroundColor:"white",padding:"25px", borderRadius:"25px"}}>
                    <h2>Pokemon App React Project</h2>
                    <h4>by Tim Culp</h4>
                    <p>
                        This is a Pokémon app built in React to gain experience in full stack web design. It was not comissioned, encouraged, or endorsed by Nintendo in any way at all. Pokémon is not my property, but I used it for this project for simplicity. I also made use of the <a href="https://pokeapi.co" target="blank_">PokeAPI</a> for conveniently organizing Pokémon images and type data. The database was established with Postgres and the server was made in Node.js using Express.
                    </p>
                    <Button onClick={()=>{window.location.reload()}}>Back to App</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Splash;