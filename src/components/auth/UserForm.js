import React, {useState, useEffect} from 'react';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import './UserForm.css';

const UserForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passError, setPassError] = useState('');
    let timeout;

    useEffect(()=>{
        if (userError || passError) {
            setTimeout(()=>{setUserError('');setPassError('')},2000);
        }
        return(()=>clearTimeout(timeout))
    }, [userError, passError])

    const submit = e => {
        e.preventDefault();
        if (username && password) {
            props.takeFields(username, password);
        }
        if (!username) setUserError('Please input a username.');
        if (!password) setPassError('Please input a password.');
    }

    return(
            <Form id="userForm" style={{backgroundColor: props.color}} onSubmit={e => submit(e)}>
                <h2>{props.title}</h2>
                <FormGroup>
                    <Label htmlFor="username">Username: </Label>
                    <Input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
                    <span>{userError}</span>
                </FormGroup>
                <FormGroup>
                    <Label id="passwordLabel" htmlFor="password">Password: </Label>
                    <Input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    <span>{passError}</span>
                </FormGroup>
                <Button type="submit" id="userFormButton">Submit</Button>
            </Form>
    )
}

export default UserForm;