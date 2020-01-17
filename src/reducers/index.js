import { combineReducers } from 'redux';

import userReducer from './userReducer';
import transcriptReducer from './transcriptReducer';

export default combineReducers({
  user: userReducer,
  transcripts: transcriptReducer
});