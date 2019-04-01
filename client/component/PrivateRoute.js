import React, { Component } from 'react';
import Dashboard from '../component/Dashboard';
import {
  Route,
  Link,
  Redirect,
  withRouter,
  BrowserRouter,
  Switch,
} from 'react-router-dom';

const PrivateRoute = props => {
  let { component: Component, ...rest } = props;
  console.log('inside of conditional rendering ', props.authentication);
  return (
    <Route
      {...rest}
      render={data => {
        if (props.authentication) {
          return <Component {...rest} />;
        } else {
          return <Redirect to="/demo" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
