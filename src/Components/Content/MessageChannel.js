import React, { useState, useEffect, useRef } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageHeader from '../Messages/MessagesHeader';
import MessageForm from '../Messages/MessageForm';
import firebase from '../Firebase/firebase';
import { useSelector } from 'react-redux';
import Message from '../Messages/Message';
import Skeleton from '../Messages/Skeleton';

export default function MessageChannel() {
	const setChannelReducer = useSelector((state) => state.channel_reducer);
	const setUserReducer = useSelector((state) => state.user_reducer);
	const [channelFirebase, setChannelFirebase] = useState(firebase.database().ref('messages'));

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [numUniqeUsers, setNumUniqeUsers] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [searchingLoading, setSearchLoading] = useState(false);
	const [searchResult, setSearchResult] = useState([]);

	const channel = setChannelReducer.currentChannel;
	const user = setUserReducer.currentUser;

	const messageEnd = useRef();

	useEffect(() => {
		if (channel && user && channel.id) {
			let allMessages = [];
			const id = channel && channel.id;

			const unsubscribe = channelFirebase.child(id).on('child_added', (snap) => {
				allMessages.push(snap.val());
				setMessages(allMessages);
				setLoading(false);
				userCount(allMessages);
				return () => unsubscribe;
			});
		}
		if (messageEnd) {
			scrollToBottom();
		}
	}, [loading, setUserReducer, channel, channelFirebase, user, setChannelReducer, messageEnd]);

	function scrollToBottom() {
		messageEnd.current.scrollIntoView({ behavior: 'smooth' });
	}

	function userCount(messages) {
		const users = messages.reduce((acc, messages) => {
			if (!acc.includes(messages.user.name)) {
				acc.push(messages.user.name);
			}
			return acc;
		}, []);

		const plural = users.length > 1 || users.length === 0;
		const uniqeUser = `${users.length} user${plural ? 's' : ''}`;
		setNumUniqeUsers(uniqeUser);
	}

	let displayMessages = (messages) =>
		messages.length > 0 &&
		messages.map((message) => <Message key={message.timestamp} message={message} user={user} />);

	const channelName = (channel) => (channel ? `🐻${channel.name}` : null);

	function handleMessageSearch(e) {
		setSearchTerm(e.target.value);
		setSearchLoading(true);
		handleSearchMessages();
	}

	function displaySkeleton(loading) {
		return loading ? Array.from({ length: 10 }, (_, index) => <Skeleton key={index} />) : null;
	}

	function handleSearchMessages() {
		const messagesCopy = [...messages];
		const regex = new RegExp(searchTerm, 'gi');
		const searchResult = messagesCopy.reduce((acc, message) => {
			if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
				acc.push(message);
			}
			return acc;
		}, []);
		setSearchResult(searchResult);
		setTimeout(() => setSearchLoading(false), 1000);
	}

	return (
		<>
			<MessageHeader
				channelName={channelName(channel)}
				numUniqeUsers={numUniqeUsers}
				handleMessageSearch={handleMessageSearch}
				searchingLoading={searchingLoading}
			/>

			<Segment className="message">
				<Comment.Group>
					{displaySkeleton(loading)}
					{searchTerm ? displayMessages(searchResult) : displayMessages(messages)}
					<div ref={messageEnd}></div>
				</Comment.Group>
			</Segment>
			<MessageForm messagesFirebase={channelFirebase} />
		</>
	);
}
