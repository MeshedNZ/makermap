
import Rest from 'grommet/utils/Rest';


// session
export const INIT = 'INIT';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// route
export const ROUTE_CHANGED = 'ROUTE_CHANGED';

// nav
export const NAV_ACTIVATE = 'NAV_ACTIVATE';
export const NAV_RESPONSIVE = 'NAV_RESPONSIVE';

export function init(email, token) {
  return { type: INIT, email: email, token: token };
}

export function login(email, password) {
  return function (dispatch) {
    Rest.post('/rest/login-sessions',
      {email: email, password: password})
      .end(function(err, res) {
        if (err || !res.ok) {
          dispatch(loginFailure(res.body));
        } else {
          dispatch(loginSuccess(email, res.body.sessionID));
        }
      });
  };
}

export function loginSuccess(email, token) {
  return { type: LOGIN_SUCCESS, email: email, token: token };
}

export function loginFailure(error) {
  return { type: LOGIN_FAILURE, error: error };
}

export function logout() {
  return { type: LOGOUT };
}

export function routeChanged(route, prefix) {
  return { type: ROUTE_CHANGED, route: route, prefix: prefix };
}

export function navActivate(active) {
  return { type: NAV_ACTIVATE, active: active };
}

export function navResponsive(responsive) {
  return { type: NAV_RESPONSIVE, responsive: responsive };
}
