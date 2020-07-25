import React, { useEffect, useState, useReducer, useRef } from 'react'
/**
 * 
 * @param {*} initilValue 
 * @param {function} callBack 
 */
export const useStateCallbackWrapper = (initilValue, callBack) => {
  const [state, setState] = useState(initilValue);
  useEffect(() => callBack(state), [state]);
  return [state, setState];
};
export const useStateCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setStateCallback = (state, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(state);
  };

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}
export const useReducerCallback = (reducer,initialState) => {
  const [state, setState] = useReducer(reducer,initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setReducerCallback = (state, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(state);
  };

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setReducerCallback];
}