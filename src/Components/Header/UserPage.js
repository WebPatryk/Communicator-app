import React, { useState, useEffect, useRef } from 'react';
import { Input, Image, Dropdown, Button, Header, Modal, Icon } from 'semantic-ui-react';
import firebase from '../Firebase/firebase';
import { useSelector } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import ErrorMsg from '../Error/ErrorMsg';

export default function UserPage() {
	const setUserReducer = useSelector((state) => state.user_reducer);

	const [currentUser, setCurrentUser] = useState(null);
	const [modal, setModal] = useState(false);
	const [uploadCroppedImage, setUploadCroppedImage] = useState('');
	const [metaData, setMetaData] = useState({
		contentType: 'image/jpeg'
	});
	const [prevImage, setPrevImage] = useState('');
	const [storageImage, setStorageImage] = useState(firebase.storage().ref());
	const [userRef, setUserRef] = useState(firebase.auth().currentUser);
	const [usersRef, setUsersRef] = useState(firebase.database().ref('users'));
	const [croppedImage, setCroppedImage] = useState('');
	const [blob, setBlob] = useState('');

	useEffect(() => {
		setCurrentUser(setUserReducer.currentUser);
	}, [setUserReducer.currentUser]);

	let avatarRef = useRef();

	function openModal() {
		setModal(true);
	}
	function closeModal() {
		setModal(false);
	}

	const UserOptions = [
		{
			key: 'User',
			text: (
				<span>
					You are <strong>{currentUser && currentUser.displayName}</strong>
				</span>
			),
			icon: 'user',
			value: 'User',
			disabled: true
		},
		{
			key: 'Avatar',
			text: <span onClick={openModal}>Change Avatar </span>,
			value: 'Change avatar',
			icon: 'user md'
		},
		{
			key: 'Sign out',
			text: <span onClick={handleSignOut}>Sign out </span>,
			value: 'Sign out',
			icon: 'sign out'
		}
	];

	function handleSignOut() {
		firebase
			.auth()
			.signOut()
			.then(() => console.log('Sign out'));
	}

	function handleChangeAvatar(e) {
		const file = e.target.files[0];
		const reader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.addEventListener('load', () => {
				setPrevImage(reader.result);
			});
		}
	}

	function uploadChangeAvatar() {
		storageImage
			.child(`avatars/user-${userRef.uid}`)
			.put(blob, metaData)
			.then((snap) => {
				snap.ref.getDownloadURL().then((downloadURL) => {
					setUploadCroppedImage(downloadURL);

					changeAvatar();
				});
			});
	}

	function changeAvatar() {
		uploadCroppedImage &&
			userRef
				.updateProfile({
					photoURL: uploadCroppedImage
				})
				.then(() => {
					closeModal();
				})
				.catch((err) => {
					return <ErrorMsg error={err} />;
				});

		usersRef
			.child(setUserReducer.currentUser.uid)
			.update({ avatar: uploadCroppedImage })
			.then(() => {
				console.log('user avatar changed');
			})
			.catch((err) => {
				return <ErrorMsg error={err} />;
			});
	}

	function handleCroppImage() {
		if (avatarRef) {
			avatarRef.getImageScaledToCanvas().toBlob((blob) => {
				let imageURl = URL.createObjectURL(blob);
				setCroppedImage(imageURl);

				setBlob(blob);
			});
		}
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Header as="h2">
				<Image circular src={currentUser && currentUser.photoURL} />
			</Header>

			<Dropdown
				inline
				options={UserOptions}
				defaultValue={UserOptions[0].value}
				style={{ marginBottom: '1rem' }}
			/>
			<Modal basic open={modal} onClose={closeModal}>
				<Header icon="avatar" content="Change Avatar" />
				<Modal.Content>
					<p>In this part you'll able to change your avatar</p>
					<Input fluid type="file" label="Change avatar" name="avatar" onChange={handleChangeAvatar} />
					{prevImage && (
						<AvatarEditor
							image={prevImage}
							width={120}
							height={120}
							border={50}
							scale={1.2}
							ref={(node) => (avatarRef = node)}
						/>
					)}

					{croppedImage && (
						<Image style={{ margin: '3rem auto' }} width={100} height={100} src={croppedImage} />
					)}
				</Modal.Content>
				<Modal.Actions>
					{croppedImage && (
						<Button color="green" onClick={uploadChangeAvatar}>
							<Icon name="checkmark" /> Change avatar
						</Button>
					)}
					<Button color="green" onClick={handleCroppImage}>
						<Icon name="checkmark" /> Preview
					</Button>
					<Button color="red" onClick={closeModal}>
						<Icon name="remove" /> Cancel
					</Button>
				</Modal.Actions>
			</Modal>
		</div>
	);
}
