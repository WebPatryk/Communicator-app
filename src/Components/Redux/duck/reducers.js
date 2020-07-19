import * as actionTypes from './types';

const userState = {
	currentUser: null,
	isLoading: true
};

export const user_reducer = (state = userState, action) => {
	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				...state,
				currentUser: action.payload.currentUser,
				isLoading: false
			};
		case actionTypes.CLEAR_USER:
			return {
				...state,
				isLoading: false
			};
		default:
			return state;
	}
};

const initialChannel = {
	currentChannel: null
};

export const channel_reducer = (state = initialChannel, action) => {
	switch (action.type) {
		case actionTypes.CURRENT_CHANNEL:
			return {
				...state,
				currentChannel: action.payload.currentChannel
			};
		default:
			return state;
	}
};
