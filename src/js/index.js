// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import '../scss/index.scss';
import 'leaflet/dist/leaflet.css';

import React from 'react';
import ReactDOM from 'react-dom';

// PropTypes is for validation

// react-router -- IMPORTANT
import Router from 'react-router';
// useful utility to make REST calls easier -- IMPORTANT
import Rest from 'grommet/utils/Rest';
// websockets
// import RestWatch from './RestWatch';
// locale
// import { getCurrentLocale, getLocaleData } from 'grommet/utils/Locale';
// import { addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import { IntlProvider } from 'react-intl';
// routing stuff -- IMPORTANT
import Routes from './routes';
// state container -- IMPORTANT
import { Provider } from 'react-redux';

// import DevTools from './DevTools';

import store from './store';
import history from './routes-history';
import { init, routeChanged } from './actions';

// The port number needs to align with devServerProxy and websocketHost in gulpfile.js
//let hostName = NODE_ENV === 'development' ? 'localhost:8010' : window.location.host;

//RestWatch.initialize('ws://' + hostName + '/rest/ws');

Rest.setHeaders({
  'Accept': 'application/json',
  'X-API-Version': 200
});

// From a comment in https://github.com/rackt/redux/issues/637
// this factory returns a history implementation which reads the current state
// from the redux store and delegates push state to a different history.
let createStoreHistory = () => {
  return {
    listen: (callback) => {
      // subscribe to the redux store. when `route` changes, notify the listener
      let notify = () => {
        const route = store.getState().route;
        if (route) {
          callback(route);
        }
      };
      const unsubscribe = store.subscribe(notify);

      return unsubscribe;
    },
    createHref: history.createHref,
    pushState: history.pushState,
    push: history.push
  };
};

let element = document.getElementById('content');
//
// let locale = getCurrentLocale();
// addLocaleData(en);

// let messages;
// try {
//   messages = require('../messages/' + locale);
// } catch (e) {
//   messages = require('../messages/en-US');
// }
// var localeData = getLocaleData(messages, locale);

ReactDOM.render((
  <div>
    <Provider store={store}>
      <Router routes={Routes.routes} history={createStoreHistory()} />
    </Provider>
    {/*}
    <DevTools store={store} />
    {*/}
  </div>
), element);

document.body.classList.remove('loading');

let localStorage = window.localStorage;
// init from localStorage
store.dispatch(init(localStorage.email, localStorage.token));
// // simulate initial login
// store.dispatch(loginSuccess('nobody@grommet.io', 'simulated'));

let postLoginPath = '/map';

// check for session
let sessionWatcher = () => {
  const {route, session} = store.getState();
  if (route) {
    if (route.pathname === '/login' && session.token) {
      localStorage.email = session.email;
      localStorage.token = session.token;
      history.pushState(null, Routes.path(postLoginPath));
    } else if (route.pathname !== Routes.path('/login') && ! session.token) {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      postLoginPath = route.pathname;
      history.pushState(null, Routes.path('/login'));
    } else if (route.pathname === '/') {
      history.replaceState(null, Routes.path('/dashboard'));
    }
  }
};
store.subscribe(sessionWatcher);

// listen for history changes and initiate routeChanged actions for them
history.listen(function (location) {
  store.dispatch(routeChanged(location, Routes.prefix));
});
