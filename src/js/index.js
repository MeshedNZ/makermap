// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import '../scss/index.scss';
import 'leaflet/dist/leaflet.css';

import React from 'react';
import ReactDOM from 'react-dom';

// PropTypes is for validation

// react-router -- IMPORTANT
import { Router, browserHistory } from 'react-router';
import Rest from 'grommet/utils/Rest';
import Routes from './routes';
import history from './routes-history';
import { Provider } from 'react-redux';
import store from './store';
import { init, routeChanged, loginSuccess } from './actions';

Rest.setHeaders({
  'Accept': 'application/json',
  'X-API-Version': 200
});

let element = document.getElementById('content');

import AppRoot from './components/AppRoot';
import Login from './components/Login';
import MapView from './components/MapView';
import TBD from 'grommet/components/TBD';

var routes = {
  path: '/',
  component: AppRoot,

  childRoutes: [
    {path: 'login', component: Login},
    {path: 'map', component: MapView},
    {path: 'settings', component: TBD}
  ]
};



ReactDOM.render((
  <div>
    <Provider store={store}>
      <Router routes={routes} history={browserHistory} />
    </Provider>
  </div>
), element);

document.body.classList.remove('loading');

let localStorage = window.localStorage;
// init from localStorage
store.dispatch(init(localStorage.email, localStorage.token));
// // simulate initial login
store.dispatch(loginSuccess('nobody@grommet.io', 'simulated'));

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
      history.replaceState(null, Routes.path('/map'));
    }
  }
};
store.subscribe(sessionWatcher);

// listen for history changes and initiate routeChanged actions for them
history.listen(function (location) {
  store.dispatch(routeChanged(location, Routes.prefix));
});
