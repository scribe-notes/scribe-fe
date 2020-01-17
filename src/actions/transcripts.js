import { request } from "./";

// Action Types

export const types = {
  GET_TRANSCRIPT_DATA: {
    START: "GET_ROOT_TRANSCRIPTS_START",
    SUCCESS: "GET_ROOT_TRANSCRIPTS_SUCCESS",
    FAILURE: "GET_ROOT_TRANSCRIPTS_FAILURE"
  },
  POST_TRANSCRIPT: {
    START: "POST_TRANSCRIPT_START",
    SUCCESS: "POST_TRANSCRIPT_SUCCESS",
    FAILURE: "POST_TRANSCRIPT_FAILURE"
  },
  UPDATE_TRANSCRIPT: {
    START: "UPDATE_TRANSCRIPT_START",
    SUCCESS: "UPDATE_TRANSCRIPT_SUCCESS",
    FAILURE: "UPDATE_TRANSCRIPT_FAILURE"
  },
  DELETE_TRANSCRIPT: {
    START: "DELETE_TRANSCRIPT_START",
    SUCCESS: "DELETE_TRANSCRIPT_SUCCESS",
    FAILURE: "DELETE_TRANSCRIPT_FAILURE"
  },
  DRAFT_NEW_FOLDER: 'DRAFT_NEW_FOLDER',
  REMOVE_FROM_STATE: 'REMOVE_FROM_STATE'
};

// Get user's transcripts from top level (root directory)
export const getRootTranscripts = () => dispatch => {
  request(dispatch, 'get', '/transcripts/mine', types.GET_TRANSCRIPT_DATA);
};

// Get a specific transcript
export const getTranscript = (id = null) => dispatch => {
  request(dispatch, 'get', `/transcripts/${id}`, types.GET_TRANSCRIPT_DATA);
};

export const postTranscript = data => dispatch => {
  request(dispatch, 'post', `/transcripts/`, types.POST_TRANSCRIPT, data);
};

export const updateTranscript = data => dispatch => {
  request(dispatch, 'put', `/transcripts/${data._id}`, types.UPDATE_TRANSCRIPT, data);
};

export const deleteTranscript = id => dispatch => {
  request(dispatch, 'delete', `/transcripts/${id}`, types.DELETE_TRANSCRIPT).then(() => {
    dispatch({
      type: types.REMOVE_FROM_STATE,
      payload: id
    })
  });
};

export const draftNewFolder = data => dispatch => {
  dispatch({
    type: types.DRAFT_NEW_FOLDER,
    payload: data
  })
}

export const cancelNewFolder = id => dispatch => {
  dispatch({
    type: types.REMOVE_FROM_STATE,
    payload: id
  })
}