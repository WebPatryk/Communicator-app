import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

export default function Spinner() {
    return (

        <Dimmer active>
            <Loader size="huge">Loading...</Loader>
        </Dimmer>

    );
}
