// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppRoot from './components/AppRoot';
import Login from './components/Login';
import MakerMap from './components/MakerMap';
import TBD from 'grommet/components/TBD';

console.log(AppRoot, Login, MakerMap, TBD);

// NOT CURRENTLY BEING USED

var rootPath = "/"; //"/ferret/";
//if (NODE_ENV === 'development') {
//  rootPath = "/"; // webpack-dev-server
//}

module.exports = {

  prefix: rootPath.slice(0, -1),

  path: (path) => (rootPath + path.slice(1)),

  routes: (
    <Route path="/" component={AppRoot}>
      <IndexRoute component={MakerMap} />
      <Route path="login" component={Login} />
      <Route path="map" component={MakerMap} />
      <Route path="settings" component={TBD} />
    </Route>
  )

};
