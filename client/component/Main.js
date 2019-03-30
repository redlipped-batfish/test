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

class Main extends Component {
  render() {
    return (
      <div>
        hello i am main
        <Switch>
          <Route path="/" component={Demo} exact />
          <Route path="/login" component={Login} />
          {/* <Route path="/test" component={Test} /> */}
        </Switch>
      </div>
    );
  }
}

export default Main;
