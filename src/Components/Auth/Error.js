import React from 'react';
import { Segment } from 'semantic-ui-react';

export default function Error({ text }) {
	return (
		<div>
			<Segment negative size="tiny" textAlign="center">
				<h1>{text}</h1>
				<h4>Write correct data to go next</h4>
			</Segment>
		</div>
	);
}
