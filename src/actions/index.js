import AxiosWithAuth from "../util/AxiosWithAuth";

export { login, refresh, signup, logout } from "./user";
export {
  getRootTranscripts,
  getTranscript,
  postTranscript,
  updateTranscript,
  deleteTranscript,
  draftNewFolder,
  cancelNewFolder
} from "./transcripts";
export { getLastLocation, recordLocation, clearHistory } from "./history";

// Action Helper

// This method is used to perform all actions that require making a request to
// the database, and allows for reuse of all the similar logic that every action
// will require.

export const request = (dispatch, method, path, type, data = null) => {
  dispatch({
    type: type.START
  });
  return AxiosWithAuth()
    .request({
      method,
      url: path,
      data
    })
    .then(res => {
      dispatch({
        type: type.SUCCESS,
        payload: res.data || null
      });
    })
    .catch(err => {
      dispatch({
        type: type.FAILURE,
        payload:
          err.response?.data?.message ||
          "An unkown error occurred. Please try again"
      });
    });
};
