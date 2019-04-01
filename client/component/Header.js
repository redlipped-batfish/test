import React, { Component } from 'react';
import LoginButton from './LoginButton';
import { Image } from 'semantic-ui-react';
import {
  BrowserRouter,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <div>
        {/* <Link to="/login">Login Page</Link> */}
        {/* <Link to="/test">Testing Testing Page</Link> */}
        <LoginButton />
      </div>
    );
  }
}

export default Header;
