// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import { NAV_PEEK, NAV_ACTIVATE, NAV_RESPONSIVE, LOGOUT, ROUTE_CHANGED } from '../actions';

const initialState = {
  active: false,
  responsive: 'multiple',
  peek: false,
  items: [
    {path: '/map', label: 'MakerMap'},
    {path: '/settings', label: 'Settings'}
  ]
};

const handlers = {
  [NAV_PEEK]: (_, action) => ({peek: action.peek}),
  [NAV_ACTIVATE]: (_, action) => ({active: action.active, activateOnMultiple: null}),
  [NAV_RESPONSIVE]: (state, action)  => {
    let result = {responsive: action.responsive};
    if ('single' === action.responsive && state.active) {
      result.active = false;
      result.activateOnMultiple = true;
    } else if ('multiple' === action.responsive && state.activateOnMultiple) {
      result.active = true;
    }
    return result;
  },
  [LOGOUT]: (_, action) => ({active: false}),
  [ROUTE_CHANGED]: (state, action) => {
    return ('single' === state.responsive && state.active) ? { active: false } : {};
  }
};

export default function navReducer (state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return { ...state, ...handler(state, action) };
}
