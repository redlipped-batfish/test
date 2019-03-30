import React from 'react';
import { render } from 'react-dom';
import App from './component/App';
// import { BrowserRouter } from 'react-router-dom';
import {
  Route,
  Link,
  Redirect,
  withRouter,
  BrowserRouter,
  Switch,
} from 'react-router-dom';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#root'),
);
