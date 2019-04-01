import React, { Component } from 'react';
import Login from './Login';
import Test from './Test';
import Demo from './Demo';
import {
  Route,
  Link,
  Redirect,
  withRouter,
  BrowserRouter,
  Switch,
} from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (props.authentication) {
          return <Component {...props} />;
        } else {
          return <Demo />;
          // <Redirect to={{ pathname: '/demo', state: { from: props.location } }} />
        }
      }}
    />
  );
};
