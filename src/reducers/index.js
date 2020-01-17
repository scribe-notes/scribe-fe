import { combineReducers } from 'redux';

import user from './user';
import transcripts from './transcripts';

export default combineReducers({
  user,
  transcripts
});