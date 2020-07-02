import React from 'react';
import { Message } from 'semantic-ui-react';



export default function Error({ text }) {
    return (
        <Message negative>
            <Message.Header>{text}</Message.Header>
            <h4>Write correct data to go next</h4>
        </Message>
    );
}
