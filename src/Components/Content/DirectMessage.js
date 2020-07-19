import React, { useState, useEffect } from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import firebase from '../Firebase/firebase';
import ErrorMsg from '../Error/ErrorMsg';

export default function DirectMessage({ currentUser }) {
	const [users, setUsers] = useState([]);
	const [currentUserUI, setCurrentUserUI] = useState(currentUser);
	const [userFirebase, setUserFirebase] = useState(firebase.database().ref('users'));
	const [connectedUser, setConnectedUser] = useState(firebase.database().ref('/info/connected'));
	const [presenceRef, setPresenceRef] = useState(firebase.database().ref('/info/presence'));

	useEffect(() => {
		if (currentUserUI) {
			addListeners(currentUserUI.uid);
		}
	}, [currentUserUI]);

	function addListeners(currentUserUI) {
		let loadUser = [];
		userFirebase.on('child_added', (snap) => {
			if (currentUserUI !== snap.key) {
				let user = snap.val();
				user['uid'] = snap.key;
				user['status'] = 'offline';
				loadUser.push(user);
				setUsers(loadUser);
			}
		});

		connectedUser.on('value', (snap) => {
			if (snap.val() === true) {
				const ref = presenceRef.child(currentUserUI);
				ref.set(true);
				ref.onDisconnect().remove((err) => {
					if (err !== null) {
						return <ErrorMsg error={err} />;
					}
				});
			}
		});
	}

	presenceRef.on('child_added', (snap) => {
		if (currentUserUI !== snap.key) {
			addStatus(snap.key);
		}
	});

	presenceRef.on('child_removed', (snap) => {
		if (currentUserUI !== snap.key) {
			addStatus(snap.key, false);
		}
	});

	function addStatus(userID, connected = true) {
		const updateUser = users.reduce((acc, user) => {
			if (user.uid === userID) {
				user['status'] = `${connected ? 'online' : 'offline'}`;
				return acc.concat(user);
			}
		}, []);
		setUsers(updateUser);
	}
	function isUserOnline(user) {
		return user.status === 'online';
	}

	return (
		<Segment.Group style={{ backgroundColor: '#936c6c', fontSize: '1.4rem' }}>
			<span>
				<Icon name="user" />
				Direct User:
			</span>{' '}
			{users.length}
			{users.map((user) => (
				<Segment key={user.uid}>
					<Icon name="circle" color={isUserOnline(user) ? 'green' : 'red'} />@{user.name}
				</Segment>
			))}
		</Segment.Group>
	);
}
