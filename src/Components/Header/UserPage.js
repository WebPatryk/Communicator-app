import React, { useState, useEffect } from 'react';
import { Label, Image, Dropdown, Button, Header } from 'semantic-ui-react';
import firebase from '../Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';


export default function UserPage() {

    const dispatch = useDispatch();
    const setUserReducer = useSelector(state => state.user_reducer);


    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        setCurrentUser(setUserReducer.currentUser);
    }, [setUserReducer.currentUser]);

    console.log(setUserReducer);

    const UserOptions = [
        {
            key: 'User',
            text: (<span>You are <strong>{currentUser && currentUser.displayName}</strong></span>),
            icon: 'user',
            value: 'User',
            disabled: true
        },
        {
            key: 'Avatar',
            text: 'Change avatar',
            value: 'Change avatar',
            icon: 'user md'
        },
        {
            key: 'Sign out',
            text: <span onClick={handleSignOut}>Sign out </span>,
            value: 'Sign out',
            icon: 'sign out'
        },
    ];

    function handleSignOut() {
        firebase.auth().signOut()
            .then(() => console.log('Sign out'));
    }




    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

            <Header as='h2' >
                <Image circular src={currentUser && currentUser.photoURL} />
            </Header>

            <Dropdown
                inline
                options={UserOptions}
                defaultValue={UserOptions[0].value}
                style={{ marginBottom: "1rem" }}
            />
        </div>
    );
}
