import { types } from '../actions/transcripts';

const initialState = {
  isLoading: false,
  error: null,
  data: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case types.POST_TRANSCRIPT.START: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case types.POST_TRANSCRIPT.SUCCESS: {
      return addOneTranscript(action.payload, state);
    }
    case types.POST_TRANSCRIPT.FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    case types.GET_TRANSCRIPT_DATA.START: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case types.GET_TRANSCRIPT_DATA.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload
      }
    }
    case types.GET_TRANSCRIPT_DATA.FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    case types.UPDATE_TRANSCRIPT.START: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case types.UPDATE_TRANSCRIPT.SUCCESS: {
      return updateOneTranscript(action.payload, state);
    }
    case types.UPDATE_TRANSCRIPT.FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    case types.DELETE_TRANSCRIPT.START: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case types.DELETE_TRANSCRIPT.SUCCESS: {
      // Do nothing, wait for second action dispatch
      // to remove deleted transcript from state
      return state;
    }
    case types.DELETE_TRANSCRIPT.FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    case types.REMOVE_FROM_STATE: {
      return updateOneTranscript({_id: action.payload}, state);
    }
    case types.DRAFT_NEW_FOLDER: {
      return addOneTranscript(action.payload, state);
    }
    default: return state;
  }
}

// Helper functions

const updateOneTranscript = (transcript, state) => {
  const data = state.data;
  const target = data.isGroup ? data.children : data;
  const targetIndex = target.findIndex(t => t._id === transcript._id);

  // If transcript object does not have a title,
  // it cannot be a valid transcript and is to
  // be removed from state
  if(targetIndex === -1) { /* Do Nothing */ }
  else if(!transcript.title) target.splice(targetIndex, 1);
  else target[targetIndex] = transcript;

  return {
    ...state,
    isLoading: false,
    data
  }
}

const addOneTranscript = (transcript, state) => {
  const data = state.data;
  const target = data.isGroup ? data.children : data;
  target.push(transcript);

  return {
    ...state,
    isLoading: false,
    data
  }
}