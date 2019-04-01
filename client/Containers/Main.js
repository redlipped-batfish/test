import React, { Component } from 'react';
import Header from '../component/Header';
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
  constructor(){
    super();
    this.state = {
      authenticated = false,
      breakPoint: '',
      projects: [],
    }
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  isAuthenticated = () => {
    // fetch from server
    fetch('http://localhost:3000/isAuthenticated')
      .then(data => data.json())
      .then(data => {
        console.log(data);
        // deconstructed and parsed server data
        let {authenticated, tests} = data;
        let projects = [];
        tests.forEach(test => {
          
        })
        // set authenticated property to what the server returns
        this.setState({authenticated, projects});
      });
  }

  render() {
    this.isAuthenticated();
    return (
      <div>
        hello i am main
        <Header/>
        <Switch>
          {/* <Route path="/demo" component={Demo} exact /> */}
          <PrivateRoute exact path="/" 
            component={Dashboard} 
            authentication={this.state.authenticated} 
            projects={this.state.projects}/>
          <Route path="*" component={() => '404 Not found'} /> {/* show random red lipped picture */}
        </Switch>
      </div>
    );
  }
}

export default Main;
