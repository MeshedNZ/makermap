// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP


const initialState = {

};

const handlers = {

};

export default function makerMapReducer (state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return { ...state, ...handler(state, action) };
};
