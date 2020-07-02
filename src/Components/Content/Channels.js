import React, { useState, useEffect } from 'react';
import { Icon, Input, Menu, Label, Header, Modal, Button, Form, Item, Image as ImageComponent, Image } from 'semantic-ui-react';
import firebase from '../Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { currentChannel } from '../Redux/duck/actions';

;

export default function Channels() {

    const [channels, setChanels] = useState([]);
    const [search, setSearch] = useState("");
    const [activeItem, setActiveItem] = useState(null);

    const [channel, setChannel] = useState({
        channelName: "",
        channelDesc: ""
    });
    const [modal, setModal] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [activeNowChannel, setActiveNowChannel] = useState(true);
    const [channelFirebase, setChannelFirebase] = useState(firebase.database().ref('channels'));

    const dispatch = useDispatch();

    const setUserReducer = useSelector(state => state.user_reducer);


    const [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        setCurrentUser(setUserReducer.currentUser);

        loadChannels();
    }, [channels.length]);


    function loadChannels() {
        let myChannels = [];
        channelFirebase.on('child_added', snap => {
            myChannels.push(snap.val());
            setChanels(myChannels);

            firstChannel();
        });
    }

    function firstChannel() {

        const firstChannel = channels[0];
        if (firstLoad && channels.length > 0) {
            dispatch(currentChannel(firstChannel));
            setActiveChannel(firstChannel);
        }
        setFirstLoad(false);
    }

    function handleChannel(e) {
        setChannel({
            ...channel,
            [e.target.name]: e.target.value
        });
    }

    function handleCloseModal() {
        setModal(false);
    }
    function handleOpenModal() {
        setModal(true);
    }

    const { channelName, channelDesc } = channel;

    function handleChannelSubmit(e) {
        e.preventDefault();
        if (channelValidation(channelName, channelDesc)) {
            console.log('You added new channel');
            addNewChannel();
        }
    }


    function channelValidation(channelName, channelDesc) {
        if (channelName.length >= 5 && channelDesc.length >= 5) {
            return channelName, channelDesc;
        }
    }

    function addNewChannel() {

        const key = channelFirebase.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            describtion: channelDesc,
            createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            }
        };

        channelFirebase.child(key)
            .update(newChannel)
            .then(() => {
                setChannel({
                    channelName: "",
                    channelDesc: ""
                });
                handleCloseModal();
                console.log('channel Added');
            })
            .catch(err => {
                console.log(err);
            });

    }
    function handleItemClick(channel) {
        setActiveItem(channel.name);
        dispatch(currentChannel(channel));
        setActiveChannel(channel);
    }
    function setActiveChannel(channel) {
        setActiveNowChannel(channel.id);
    }

    const filterChannels = channels.filter(channel => channel.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);

    const displayChannels = (channels) =>
        channels.length > 0 && filterChannels.map(channel => (

            <Menu.Item
                name={channel.name}
                style={{ display: "flex" }}
                active={channel.id === activeNowChannel}
                onClick={() => handleItemClick(channel)}
                key={channel.id}
            >
                <Image circular src={channel.createdBy.avatar} size="small" verticalAlign="middle" wrapped />
                <div>
                    <Header as='h3' sub>{channel.name}</Header>
                    <Header.Subheader as="h6">
                        {channel.describtion}
                    </Header.Subheader>
                </div>

            </Menu.Item >

        ));


    return (
        <Menu
            vertical
            style={{ backgroundColor: "#C0A5A5", fontSize: '1.4rem' }}
            size="large"
            fixed="left"
        >
            <Menu.Item>
                <Input placeholder='Search group...' size="mini" value={search} onChange={e => setSearch(e.target.value)} />

            </Menu.Item>

            <Menu.Item
                style={{ fontSize: '1.1rem' }}
                name='channels'
                active

            >
                <Label color='brown'>{channels.length}</Label>
          Channels


            </Menu.Item>
            {displayChannels(channels)}

            <Modal trigger={<Button ><Icon name="add" /></Button>} closeIcon open={modal} onOpen={handleOpenModal} onClose={handleCloseModal}>
                <Header icon='add circle' content='Add new Channel' />
                <Modal.Content>
                    <p>
                        In this field you can in easly way add new Channel. Write correct data to go next.
                    </p>

                    <Form onSubmit={handleChannelSubmit}>
                        <Form.Field>
                            <label>Channel Name</label>
                            <input
                                placeholder='Channel Name'
                                name="channelName"
                                onChange={handleChannel}
                                value={channel.channelName}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Channel Describtion</label>
                            <input
                                placeholder='Channel Describtion'
                                name="channelDesc"
                                onChange={handleChannel}
                                value={channel.channelDesc}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={handleCloseModal}>
                        <Icon name='remove' /> Cancal
                    </Button>
                    <Button color='green' onClick={handleChannelSubmit} >
                        <Icon name='checkmark' /> Add
                    </Button>
                </Modal.Actions>
            </Modal>



        </Menu>
    );
};
