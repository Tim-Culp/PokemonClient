import React, { useState, useEffect } from 'react';
import {Col, Row, Form, Input, Button, Label, FormGroup} from 'reactstrap'
import UserForm from './UserForm';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import APIURL from '../../helpers/environment';


const Auth = (props) => {
    const [loggingIn, setLoggingIn] = useState(true);
    const [error, setError] = useState('');
    const history = useHistory();
    let timeout;

    useEffect(()=>{
        if (error) {
            timeout = setTimeout(() => setError(''), 2000);
        }
        return(()=>clearTimeout(timeout))
    }, [error])

    const sendInfo = (username, password) => {
        let url;
        console.log("URL IS", APIURL);
        loggingIn ? url = `${APIURL}/api/users/login` : url = `${APIURL}/api/users/create`
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'authorization': props.sessionToken
            },
            body: JSON.stringify({user: {username: username, password: password}})
        })
            .then(res => res.json())
            .then(res => {
                if (res.sessiontoken) {
                    props.updateToken(res.sessiontoken);
                    history.push('/');
                } else {
                    console.log(res);
                    
                    if (res.code === "usernameTaken") {
                        setError("That user already exists.")
                    } else if(res.code === "wrongPassword") {
                        setError("Password was incorrect.")
                    } else if(res.code === "wrongUsername") {
                        setError("No user found by that name.")
                    } else {
                        setError("Transaction failed.")
                    }
                }
            })
            .catch(err => console.log(err));
    }

    return(
        <div>
            <Row>
                <Col sm="12" md={{size: 4, offset: 4}} maxLength="4">
                    <UserForm title={loggingIn ? "Login" : "Signup"} color={loggingIn ? "rgb(150, 150, 255)" : "rgb(130, 255, 130)"} takeFields={sendInfo}  />
                    <Button id="sendInfoButton" onClick={() => setLoggingIn(!loggingIn)}>Toggle Login/Signup</Button>
                    <h4 id="sendInfoError" style={{display: error ? "block" : "none"}}>{error ? error : null}</h4>
                </Col>
            </Row>

        </div>
    )
}

export default Auth;