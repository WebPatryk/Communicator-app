import React from 'react';
import { Grid } from 'semantic-ui-react';
import UserPage from '../Components/Header/UserPage';
import HomePage from '../Components/Header/HomePage';
import AdvancedUserSettings from '../Components/Content/AdvancedUserSettings';
import Channels from '../Components/Content/Channels';
import MessageChannel from '../Components/Content/MessageChannel';

export default function MainPage() {
	return (
		<Grid columns={3} padded>
			<Grid.Row columns="13" style={{ height: '10vh', backgroundColor: '#8c7373 ' }}>
				<Grid.Column width={3} />
				<Grid.Column width={10}>
					<HomePage />
				</Grid.Column>
				<Grid.Column width={3}>
					<UserPage />
				</Grid.Column>
			</Grid.Row>

			<Grid.Row columns="13">
				<Grid.Column width={3}>
					<Channels />
				</Grid.Column>
				<Grid.Column width={10}>
					<MessageChannel />
				</Grid.Column>
				<Grid.Column width={3}>
					<AdvancedUserSettings />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
