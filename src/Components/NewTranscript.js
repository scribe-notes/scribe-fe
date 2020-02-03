import React, { useState, useEffect, useContext, useRef } from 'react';
import useSpeechRecognition from '../util/useSpeechRecognition';
import { FaCircle, FaPauseCircle } from 'react-icons/fa';
import queryString from 'query-string';

import HistoryContext from '../contexts/HistoryContext';

import { connect } from 'react-redux';

import { postTranscript, getTranscript } from '../actions';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Scale,
  useDisclosure,
  Spinner
} from '@chakra-ui/core';

import './NewTranscript.scss';

const NewTranscript = props => {
  const [next, setNext] = useState(false);
  const [recordingLength, setRecordingLength] = useState(0);
  const [title, setTitle] = useState('New Transcript');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [newValue, setNewValue] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [stopping, setStopping] = useState(false);
  const [queueNext, setQueueNext] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const titleRef = useRef();

  // This value is used to animate the recording icon
  const [dimDot, setDimDot] = useState(false);

  const { history, setHistory } = useContext(HistoryContext);

  // Id of a parent, if any
  const { id } = props.match.params;

  const update = () => {
    setValue(value + ' ' + newValue);
  };

  const init = () => {
    // If we have an id but no data for it, get it
    if (!props.transcripts.data && id) props.getTranscript(id);
  };

  const exitIfPosted = () => {
    if (!props.transcripts.isLoading && next) {
      setHistory([]);
      props.history.push(`/transcripts${id ? `/${id}` : ''}`);
    }
  };

  useEffect(init, [id]);

  useEffect(update, [newValue]);

  useEffect(exitIfPosted, [props.transcripts.isLoading]);

  useEffect(() => {
    setError(props.transcripts.error);
  }, [props.transcripts.error]);

  useEffect(() => {
    const values = queryString.parse(props.location.search);

    if (values.step) {
      if (values.step === '1') {
        setNext(false);
      } else {
        setNext(true);
      }
    } else setNext(false);
  }, [props.location.search]);

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: result => setTempValue(result),
    onInterimResult: result => { 
      setTempValue('');
      setNewValue(result);
      return stopping;
    }
  });

  useEffect(() => {
    if(!supported)
      alert("Looks like your browser does not support speech recognition! Please try again on a different device or browser");
  }, [supported])

  const animateRecording = () => {
    setDimDot(true);
    if (!listening) return;
    setTimeout(() => {
      setDimDot(false);
      setTimeout(() => {
        animateRecording();
      }, 1000);
    }, 1000);
  };

  useEffect(animateRecording, [listening]);

  const NextHandler = () => {
    let clear = true;

    if (listening) clear = StopAndTime();

    if(!clear) {
      setQueueNext(true);
      return
    };

    // Get the current pathname
    let currentPath = window.location.pathname;

    // If there is a residual query string, remove it
    const end = currentPath.indexOf('?step=');
    if (end !== -1) currentPath = currentPath.slice(0, end);

    // Define where to go from here
    const newPath = `${currentPath}?step=2`;

    // Record the current location in history
    setHistory([
      ...history,
      {
        title: 'New Transcript',
        path: `${currentPath}?step=1`
      }
    ]);

    // Go to the next step
    props.history.push(newPath);
    return setNext(true);
  };

  useEffect(() => {
    titleRef.current && titleRef.current.focus();
  }, [next])

  const ListenAndTime = () => {
    setRecordingLength(Date.now());

    listen({ interimResults: true });
  };

  const StopAndTime = () => {
    setRecordingLength(Math.round((Date.now() - recordingLength) / 1000));
    if(tempValue) {
      setStopping(true);
      return false;
    }
    // We only do this if there is no tempValue,
    // meaning we are not missing any part of the recording
    stop();
    return true;
  };

  // This is what will be responsible for stopping speech recognition
  // after the last tempValue has been cleared
  const handleDelayedStop = () => {
    if(stopping && tempValue === '') {
      setStopping(false);
      stop();

      if(queueNext) {
        setQueueNext(false);
        NextHandler();
      }
    }
  }

  useEffect(handleDelayedStop, [tempValue])

  const handleDiscard = () => {
    if (id) props.history.push(`/new/${id}`);
    else props.history.push('/new');

    setHistory(history.slice(0, history.length - 1));

    setValue('');
    setTitle('New Transcript');
    setRecordingLength(0);
    setNewValue('');
  };

  const HandlePost = e => {
    e.preventDefault();

    if (!title) return setError('Title is required!');

    if (!value) return setError('Transcript cannot be blank!');

    let obj = {
      data: value,
      recordingLength: recordingLength.toString(),
      title
    };

    // If we have an id, assign it as the parent of this transcript
    if (id) {
      obj.parent = id;
    }

    props.postTranscript(obj);
  };

  return next ? (
    <div className='new-transcript'>
      <div className='controls'>
        <div className='left'>
          <h1>Save Transcript</h1>
          <p>
            Please Review the following transcript and make corrections as
            needed.
          </p>
          <p>Click Finish when done</p>
          <p>Or Discard to cancel</p>
        </div>
        <div className='right'>
          <p className='error'>{error}</p>
          <div className='buttons'>
            <div
              className={`button discard ${props.transcripts.isLoading &&
                'disabled'}`}
              onClick={onOpen}
            >
              DISCARD
            </div>
            <div
              className={`button ${(props.transcripts.isLoading || !title) &&
                'disabled'}`}
              onClick={HandlePost}
            >
              FINISH
            </div>
          </div>
        </div>
      </div>

      <div className='text-container'>
        <input
          disabled={props.transcripts.isLoading}
          className='title'
          placeholder='Title goes here...'
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={e => e.target.select()}
          ref={titleRef}
        />
        <textarea
          disabled={props.transcripts.isLoading}
          className='text'
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </div>
      <Scale in={isOpen}>
        {styles => (
          <AlertDialog
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={true}
          >
            <AlertDialogOverlay opacity={styles.opacity} />
            <AlertDialogContent {...styles}>
              <AlertDialogHeader>Discard Transcript?</AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to discard this transcript?
              </AlertDialogBody>
              <AlertDialogFooter>
                <div className='default-btn' ref={cancelRef} onClick={onClose}>
                  No
                </div>
                <div onClick={handleDiscard} className='default-btn red'>
                  Yes
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Scale>
    </div>
  ) : (
    <div className='new-transcript'>
      <div className='controls'>
        <div className='left'>
          <h1>
            {id ? (
              <span className='directory'>
                {props.transcripts.data?.title}/
              </span>
            ) : (
              ''
            )}
            New Transcript
          </h1>
          <p className='instructions'>
            Click the record button below to begin recording, and click next
            when you are done.
            <br />
            You will be able to correct any mistakes in the next step.
            <br />
            <strong>
              Note: Your browser may request access to your microphone, which is
              required for this to work!
            </strong>
            <br />
            {!supported && <strong className='error'>
              Unfortunately, it appears your browser does not support voice recognition!
              Please try again on a difference device or browser. We recommend using
              Google Chrome.
            </strong>}
          </p>
          <div className='buttons'>
            <div
              className={`button ${(listening || stopping || !supported) && 'disabled'}`}
              onClick={ListenAndTime}
            >
              <FaCircle />
            </div>
            <div
              className={`button ${(!listening || stopping || !supported) && 'disabled'}`}
              onClick={StopAndTime}
            >
              <FaPauseCircle />
            </div>
          </div>
        </div>
        <div className='right'>
          {listening && !stopping && (
            <div className='recording'>
              <div className={`rec ${dimDot && 'dim'}`}>.</div>
              <h2>RECORDING...</h2>
            </div>
          )}
          <div className='buttons'>
            {stopping && <Spinner />}
            <div
              className={`button ${(value.trim() === '' || stopping || !supported) && 'disabled'}`}
              onClick={NextHandler}
            >
              Next
            </div>
          </div>
        </div>
      </div>

      <div className='text-container'>
        <textarea className='text read-only' readOnly value={value + ' ' + tempValue} />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  transcripts: state.transcripts
});

export default connect(mapStateToProps, { postTranscript, getTranscript })(
  NewTranscript
);
