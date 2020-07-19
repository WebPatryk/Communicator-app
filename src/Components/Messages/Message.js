import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

export default function Message({ message, user }) {
	function isOwnerMessage(message, user) {
		return message.user.id === user.uid ? 'message_self' : '';
	}

	const timeFromNow = (time) => moment(time).fromNow();

	function isImage(message) {
		return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
	}

	return (
		<Comment>
			<Comment.Avatar src={message.user.avatar} />
			<Comment.Content className={isOwnerMessage(message, user)}>
				<Comment.Author as="a">{message.user.name}</Comment.Author>
				<Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
				{isImage(message) ? (
					<Image src={message.image} className="message__image" />
				) : (
					<Comment.Content>{message.content}</Comment.Content>
				)}
			</Comment.Content>
		</Comment>
	);
}
