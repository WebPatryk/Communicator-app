import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageHeader from '../Messages/MessagesHeader';
import MessageForm from '../Messages/MessageForm';
import firebase from '../Firebase/firebase';
import { useSelector } from 'react-redux';
import Message from '../Messages/Message';
import { setUser } from '../Redux/duck/actions';
export default function MessageChannel() {



    const setChannelReducer = useSelector(state => state.channel_reducer);
    const setUserReducer = useSelector(state => state.user_reducer);
    const [channelFirebase, setChannelFirebase] = useState(firebase.database().ref('messages'));

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const channel = setChannelReducer.currentChannel;
    const user = setUserReducer.currentUser;


    useEffect(() => {
        if (channel && user) {


            let allMessages = [];
            channelFirebase.child(channel.id).on('child_added', snap => {
                allMessages.push(snap.val());
                setMessages(allMessages);
                setLoading(false);

            });
        }


    }, [channel, channelFirebase, user]);

    let displayMessages = messages => (

        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={user}
            />
        ))
    );



    return (
        <>
            <MessageHeader />

            <Segment className="message">
                <Comment.Group >
                    {displayMessages(messages)}
                </Comment.Group>

            </Segment>
            <MessageForm messagesFirebase={channelFirebase} />
        </>
    );
}
