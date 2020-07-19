import React, { useState, useEffect, useRef } from 'react';
import { Segment, Button, Icon, Input, Grid } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import firebase from '../Firebase/firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import ErrorMsg from '../Error/ErrorMsg';

export default function MessageForm({ messagesFirebase }) {
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);
	const [modal, setModal] = useState(false);
	const setChannelReducer = useSelector((state) => state.channel_reducer);
	const setUserReducer = useSelector((state) => state.user_reducer);

	const [photo, setPhoto] = useState(null);

	const [uploadState, setUploadState] = useState('');
	const [uploadTask, setUploadTask] = useState(null);
	const [storage, setStorage] = useState(firebase.storage().ref());

	const [percentageUpload, setPercentagleUpload] = useState(0);
	const [emojiPicker, setEmojiPicker] = useState(false);

	const InputMessage = useRef();

	const [channel, setChannel] = useState('');
	const [currentUser, setCurrentUser] = useState(null);
	useEffect(() => {
		setChannel(setChannelReducer.currentChannel);
		setCurrentUser(setUserReducer.currentUser);
	}, [setChannelReducer, setUserReducer.currentUser, message]);

	const avilableChannel = channel ? channel.id : null;
	function handleInputChange(e) {
		setMessage(e.target.value);
	}

	function handleTogglePicker() {
		setEmojiPicker(!emojiPicker);
	}

	const createMessage = (fileURl = null) => {
		const newMessage = {
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			user: {
				id: currentUser.uid,
				name: currentUser.displayName,
				avatar: currentUser.photoURL
			},
			content: message
		};

		return newMessage;
	};

	function sendMessage() {
		if (message) {
			setLoading(true);
			messagesFirebase
				.child(avilableChannel)
				.push()
				.set(createMessage())
				.then(() => {
					setLoading(false);
					setMessage('');
					InputMessage.current.focus();
				})
				.catch((err) => {
					setLoading(false);
					setErrors(errors.concat(err));
					return <ErrorMsg error={err} />;
				});
		} else {
			setErrors(errors.concat({ message: 'Add a message' }));
		}
	}
	function handleKeySend(e) {
		if (e.which === 13 || e.keyCode === 13) {
			InputMessage.current.focus();
		}
	}

	function closeModal() {
		setModal(false);
	}
	function openModal() {
		setModal(true);
	}

	function uploadFile(file, metadata) {
		const fullPath = `chat/public/${uuidv4()}.jpg`;
		setUploadState('uploading');
		setUploadTask(storage.child(fullPath).put(file, metadata));
	}

	function handleAddEmoji(emoji) {
		const oldMessage = message;
		const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
		setMessage(newMessage);
		setEmojiPicker(false);
	}

	function colonToUnicode(message) {
		return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
			x = x.replace(/:/g, '');

			let emoji = emojiIndex.emojis[x];
			if (typeof emoji !== 'undefined') {
				let unicode = emoji.native;

				if (typeof unicode !== 'undefined') {
					return unicode;
				}
			}
			x = ':' + x + ':';
			return x;
		});
	}

	useEffect(() => {
		storage
			.child('chat/public/112741f4-509c-4d52-9a4b-2b9e6f5691fe.jpg')
			.getDownloadURL()
			.then((url) => {
				setPhoto(url);
			})
			.catch((err) => {
				return <ErrorMsg error={err} />;
			});
	}, [avilableChannel, createMessage, errors, messagesFirebase, uploadTask]);

	return (
		<>
			{emojiPicker && (
				<Picker
					className="emojipicker"
					emoji="point_up"
					title="Pick your emoji"
					style={{ position: 'absolute', top: '30%', left: '60%' }}
					onSelect={handleAddEmoji}
				/>
			)}

			<div className="message__form" style={{ display: 'flex', alignContent: 'stretch' }}>
				<Button.Group>
					{photo}

					<FileModal modal={modal} closeModal={closeModal} uploadFile={uploadFile} />
				</Button.Group>

				<Input
					icon={<Icon name="smile outline" inverted circular link onClick={handleTogglePicker} />}
					placeholder="Search..."
					style={{ width: '95%' }}
					onChange={handleInputChange}
					className={errors.some((error) => error.message.includes('message')) ? 'error' : ''}
					value={message}
					ref={InputMessage}
					onKeyPress={handleKeySend}
				/>
				<Button onClick={sendMessage} disabled={loading}>
					<Icon name="send" size="large" />
				</Button>
			</div>
		</>
	);
}
