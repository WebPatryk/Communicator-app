import React from 'react';
import { Header, Input, Grid } from 'semantic-ui-react';

export default function MessagesHeader({ channelName, numUniqeUsers, handleMessageSearch, searchingLoading }) {
	return (
		<Grid columns={2} padded="horizontally">
			<Grid.Row>
				<Grid.Column>
					<Header as="h2" fluid color="brown">
						{channelName}
						<Header.Subheader>{numUniqeUsers}</Header.Subheader>
					</Header>
				</Grid.Column>
				<Grid.Column textAlign="right">
					<Input
						size="mini"
						icon="search"
						placeholder="Search message"
						name="searchMessage"
						onChange={handleMessageSearch}
						loading={searchingLoading}
					/>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
