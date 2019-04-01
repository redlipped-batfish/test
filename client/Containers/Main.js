import React, { Component } from 'react';
import Header from '../component/Header';
import Demo from '../component/Demo';
import PrivateRoute from '../component/PrivateRoute';
import Dashboard from '../component/Dashboard';
import {
  Route,
  Link,
  Redirect,
  withRouter,
  BrowserRouter,
  Switch,
} from 'react-router-dom';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      breakPoint: '',
      projects: {},
    };
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  isAuthenticated() {
    // fetch from server
    fetch('http://localhost:3000/isAuthenticated')
      .then(data => data.json())
      .then(data => {
        console.log(data);
        // deconstructed and parsed server data
        let { isAuthenticated, tests } = data;
        let projects = { 1: [] };
        tests.forEach(test => {
          let {
            test_id,
            url,
            endpoint,
            contenttype,
            requesttype,
            expectedresstatuscode,
            expectedbody,
            project_id,
          } = test;
          // if (!Object.keys(projects).includes(project_id)) {
          //   console.log('catman', projects);
          //   projects[project_id] = [];
          // }
          projects[project_id].push({
            test_id,
            url,
            endpoint,
            contenttype,
            requesttype,
            expectedresstatuscode,
            expectedbody,
            project_id,
          });
        });
        // set authenticated property to what the server returns
        this.setState({ authenticated: isAuthenticated, projects });
        console.log('this is the parsed projects', this.state.projects);
      });
  }

  componentWillMount() {
    this.isAuthenticated();
    console.log('Component did mount', this.state.authenticated);
  }

  render() {
    return (
      <div>
        hello i am main
        <Header />
        <Link to="/">Go to root</Link>
        <Switch>
          <Route path="/demo" component={Demo} />
          <PrivateRoute
            exact
            path="/"
            component={Dashboard}
            authentication={this.state.authenticated}
            projects={this.state.projects}
          />
          <Route path="*" render={() => <div>'404 Not found' </div>} />{' '}
          {/* show random red lipped picture */}
        </Switch>
      </div>
    );
  }
}

export default Main;
