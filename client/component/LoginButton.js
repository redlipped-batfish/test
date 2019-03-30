import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';

class LoginButton extends Component {
  //replace this stuff with actual OAUTH stuff
  redirectGithub() {
    console.log('i am some function');
    fetch('http://localhost:3000/login')
      .then(stream => stream.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <Button style={{ float: 'right' }} onClick={this.redirectGithub} icon>
        {' '}
        <span>
          <h4>Login </h4>
          <Icon size="big" name="github" />
        </span>
      </Button>
    );
  }
}

export default LoginButton;
