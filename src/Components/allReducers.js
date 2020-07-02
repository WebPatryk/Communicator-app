import { combineReducers } from 'redux';
import { user_reducer, channel_reducer } from './Redux/duck/reducers';

export const rootReducers = combineReducers({
    user_reducer,
    channel_reducer,
});