import React, { createContext, useReducer } from 'react';
import initialState from './state';
import apiReducer from './reducer';

export const APIContext = createContext();

const APIContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  function sendMessage(text) {
    dispatch({ type: 'POST_START' });

    fetch('https://file.io', {
      body: `text=${text}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((response) => {
        dispatch({ type: 'POST_SUCCESS', payload: response });
      })
      .catch((error) => {
        dispatch({ type: 'POST_ERROR', payload: error });
      });
  }

  function readMessage(id) {
    dispatch({ type: 'GET_START' });

    fetch(`https://file.io/${id}`)
      .then((response) => {
        if (response.status === 404) return '404 Error';
        if (response.status === 429) return '429 Too many requests';
        return response.text();
      })
      .then((response) => {
        console.log(response);
        dispatch({ type: 'GET_SUCCESS', payload: response });
      })
      .catch((error) => {
        dispatch({ type: 'GET_ERROR', payload: error });
      });
  }

  function destroyMessage() {
    dispatch({ type: 'DESTROY_MESSAGE' });
  }

  function resetState() {
    dispatch({ type: 'RESET_STATE' });
  }

  return (
    <APIContext.Provider
      value={{ state, resetState, sendMessage, readMessage, destroyMessage }}
    >
      {children}
    </APIContext.Provider>
  );
};

export default APIContextProvider;
