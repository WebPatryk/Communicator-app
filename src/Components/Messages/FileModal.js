import React, { useState } from 'react';
import { Button, Header, Icon, Modal, Input } from 'semantic-ui-react';
import mime from 'mime-types';
export default function FileModal({ closeModal, modal, uploadFile }) {

    const [file, setFile] = useState(null);
    const [authorised, setAuthorised] = useState(['image/jpeg', 'image/png']);

    function addFile(e) {
        const file = e.target.files[0];
        console.log(file.name);
        if (file) {
            setFile(file);
        }
    }

    function sendFile() {
        if (file !== null) {
            if (isCorrectFileType(file.name)) {
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata);
                closeModal();
                setFile(null);

            }
        }
    }



    function isCorrectFileType(filename) {
        return authorised.includes(mime.lookup(filename));

    }



    return (

        <Modal open={modal} onClose={closeModal} closeIcon>
            <Header icon='archive' content='Choose your picture' />
            <Modal.Content>
                <Input
                    fluid
                    label="File types: jpeg, png"
                    name="file"
                    type="file"
                    onChange={addFile}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color='red'
                    onClick={closeModal}>
                    <Icon name='remove' /> No
      </Button>
                <Button
                    color='green'
                    onClick={sendFile}
                >
                    <Icon name='checkmark' /> Yes
      </Button>
            </Modal.Actions>
        </Modal>
    );


}
