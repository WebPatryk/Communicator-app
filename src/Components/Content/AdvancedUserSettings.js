import React from 'react';
import { Grid, Header, Segment, Image, Label, Table, Container } from 'semantic-ui-react';
import jenny from '../Images/jenny.jpg';
import lindsay from '../Images/lindsay.png';
import matthew from '../Images/matthew.png';
import rachel from '../Images/rachel.png';
import tom from '../Images/tom.jpg';
export default function AdvancedUserSettings() {
	return (
		<Grid columns="1" divided>
			<Grid.Row textAlign="center" className="aside-row">
				<Grid.Column>
					<Header as="h2" attached="top">
						Happy customers
					</Header>
					<Segment attached>
						This application has made many people happy. The biggest companies and famous people use
						"Communicator" every day. That makes us more noticable.
					</Segment>
				</Grid.Column>
				<Grid.Column>
					<Table basic="very" celled collapsing>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Customers</Table.HeaderCell>
								<Table.HeaderCell>Numer of them</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<Header as="h4" image>
										<Image src={jenny} rounded size="mini" />
										<Header.Content>
											Lena
											<Header.Subheader>Human Resources</Header.Subheader>
										</Header.Content>
									</Header>
								</Table.Cell>
								<Table.Cell>22</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<Header as="h4" image>
										<Image src={lindsay} rounded size="mini" />
										<Header.Content>
											Matthew
											<Header.Subheader>Fabric Design</Header.Subheader>
										</Header.Content>
									</Header>
								</Table.Cell>
								<Table.Cell>15</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<Header as="h4" image>
										<Image src={tom} rounded size="mini" />
										<Header.Content>
											Lindsay
											<Header.Subheader>Entertainment</Header.Subheader>
										</Header.Content>
									</Header>
								</Table.Cell>
								<Table.Cell>12</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<Header as="h4" image>
										<Image src={rachel} rounded size="mini" />
										<Header.Content>
											Mark
											<Header.Subheader>Executive</Header.Subheader>
										</Header.Content>
									</Header>
								</Table.Cell>
								<Table.Cell>11</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</Grid.Column>
				<Grid.Column>
					<Container>
						Author of the page:{' '}
						<Label as="a" href="http://github.com/WebPatryk" image style={{ margin: 10 }}>
							<img src={matthew} />
							Patryk
						</Label>
					</Container>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
