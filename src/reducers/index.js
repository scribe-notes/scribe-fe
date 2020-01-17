import { combineReducers } from 'redux';

import user from './user';
import transcripts from './transcripts';
import history from './history';

export default combineReducers({
  user,
  transcripts,
  history
});