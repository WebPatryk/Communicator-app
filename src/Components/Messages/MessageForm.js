import React, { useState, useEffect, useRef } from 'react';
import { Segment, Button, Icon, Input, Grid } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from '../Firebase/firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';


export default function MessageForm({ messagesFirebase }) {

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [modal, setModal] = useState(false);
    const setChannelReducer = useSelector(state => state.channel_reducer);
    const setUserReducer = useSelector(state => state.user_reducer);

    const [photo, setPhoto] = useState(null);

    const [uploadState, setUploadState] = useState('');
    const [uploadTask, setUploadTask] = useState(null);
    const [storage, setStorage] = useState(firebase.storage().ref());

    const [percentageUpload, setPercentagleUpload] = useState(0);

    const InputMessage = useRef();

    const [channel, setChannel] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        setChannel(setChannelReducer.currentChannel);
        setCurrentUser(setUserReducer.currentUser);
    }, [setChannelReducer, setUserReducer.currentUser]);


    const avilableChannel = channel ? channel.id : null;
    function handleInputChange(e) {
        setMessage(e.target.value);
    }

    // function createMessage(fileURl = null) {
    const createMessage = (fileURl = null) => {
        const newMessage = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            },
            content: message,
        };
        console.log(fileURl);
        // if (fileURl !== null) {
        //     message['image'] = fileURl;
        // }
        // else {
        //     message['content'] = message;
        // }



        return newMessage;

    };


    // console.log(channel);
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

                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    setErrors(errors.concat(err));
                });

        }
        else {
            setErrors(errors.concat({ message: "Add a message" }));
        }
    }
    function handleKeySend(e) {
        if (e.which === 13 || e.keyCode === 13) {
            InputMessage.current.focus();
            console.log(InputMessage);
        }
    }

    function closeModal() {
        setModal(false);
    }
    function openModal() {
        setModal(true);
    }

    function uploadFile(file, metadata) {
        console.log(file, metadata);
        const fullPath = `chat/public/${uuidv4()}.jpg`;
        setUploadState('uploading');
        setUploadTask(storage.child(fullPath).put(file, metadata));
    }


    console.log(storage);
    useEffect(() => {


        storage.child('chat/public/112741f4-509c-4d52-9a4b-2b9e6f5691fe.jpg').getDownloadURL().then((url) => {
            setPhoto(url);
        })
            .catch(err => {
                console.log(err);
            });



    }, [avilableChannel, createMessage, errors, messagesFirebase, uploadTask]);


    return (
        <div className="message__form" style={{ display: "flex", alignContent: "stretch" }}>
            <Button.Group>
                {photo}

                <Button icon onClick={openModal}>
                    <Icon name='cloud upload' size='large' />
                </Button>
                <FileModal
                    modal={modal}
                    closeModal={closeModal}
                    uploadFile={uploadFile}
                />

            </Button.Group>

            <Input
                icon={<Icon name='sticker mule'
                    inverted
                    circular
                    link
                />}
                placeholder='Search...'
                style={{ width: '90%' }}
                onChange={handleInputChange}
                className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
                value={message}
                ref={InputMessage}
                onKeyPress={handleKeySend}
            />
            <Button>
                <Icon
                    name='send'
                    size='large'
                    onClick={sendMessage}
                    disabled={loading}
                />
            </Button>
        </div >

    );
}
