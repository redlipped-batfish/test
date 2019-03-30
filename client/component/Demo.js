import React, { Component } from 'react';
import {
  Form,
  Button,
  Icon,
  Container,
  Dropdown,
  Menu,
  Input,
  Table,
} from 'semantic-ui-react';

const requestTypes = [
  { key: 1, text: 'GET', value: 'GET' },
  { key: 2, text: 'POST', value: 'POST' },
];

const statusCodes = [
  { key: 1, text: '200: OK', value: '200: OK' },
  { key: 2, text: '400: Bad Request', value: '400: Bad Request' },
  { key: 3, text: '401: Unauthorized', value: '401: Unauthorized' },
  { key: 4, text: '404: Not Found', value: '404: Not Found' },
];

const contentTypes = [
  { key: 'a', text: 'text/plain', value: 'text/plain' },
  { key: 'b', text: 'text/css', value: 'text/css' },
  { key: 'c', text: 'application/json', value: 'application/json' },
];

class Demo extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      endpoint: '',
      contentType: '',
      requestType: '',
      requestBody: '',
      expectedResStatusCode: '',
      expectedResBody: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, name) {
    const newState = {};
    newState[name] = event.target.value;
    this.setState(newState);
    console.log(this.state);
  }

  handleDropdownChange(event, name) {
    const newState = {};
    newState[name] = event.target.textContent;
    this.setState(newState);
    console.log(this.state);
  }

  runTest(state) {
    console.log('i am some function');
    console.log('state:', state);
    fetch('http://localhost:3000/test', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      // body: JSON.stringify('hellowww'), // body data type must match "Content-Type" header
    })
      // fetch('http://localhost:3000/test', {
      //   method: 'GET',
      //   mode: 'cors',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      .then(stream => stream.json())
      .then(data => console.log('testingdata', data));
  }

  redirectGithub() {
    console.log('i am some function');
    fetch('http://localhost:3000/login')
      .then(stream => stream.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <div>
        <Container text>
          <Form>
            <Form.Field>
              <label>INPUT URL</label>
              <input
                placeholder="Insert Project URL here (e.g. https://mysite.com/)"
                value={this.state.url}
                onChange={event => {
                  this.handleChange(event, 'url');
                }}
              />
            </Form.Field>
            <Button
              onClick={() => this.runTest(this.state)}
              inline
              type="submit"
            >
              Run Test
            </Button>
            <hr />
            <br />
            <Form.Field>
              <label>CREATE ENDPOINT</label>
              <input
                value={this.state.endpoint}
                onChange={event => {
                  this.handleChange(event, 'endpoint');
                }}
                placeholder="Insert Endpoint URL here (e.g. /endpoint)"
              />
            </Form.Field>
            {/* <Form.Field label="Request Type" control="select">
              <option value="get">GET</option>
              <option value="post">POST</option>
            </Form.Field> */}
            <Form.Field>
              <label>Content-Type:</label>
              <Menu compact>
                <Dropdown
                  placeholder="Content Type"
                  options={contentTypes}
                  selection
                  value={this.state.contentType}
                  onChange={event => {
                    this.handleDropdownChange(event, 'contentType');
                  }}
                />
              </Menu>
            </Form.Field>
            <Form.Field>
              <label>Request Type:</label>
              <Menu compact>
                <Dropdown
                  placeholder="Request Type"
                  options={requestTypes}
                  selection
                  value={this.state.requestType}
                  onChange={event => {
                    this.handleDropdownChange(event, 'requestType');
                  }}
                />
              </Menu>
              {/* <input placeholder="Value" /> */}
            </Form.Field>
            <Form.Field>
              <label>Request Body:</label>
              <input
                placeholder="Insert body here"
                value={this.state.requestBody}
                onChange={event => {
                  this.handleChange(event, 'requestBody');
                }}
              />
            </Form.Field>
            <Form.Field>
              <Form.Field>
                <label>Expected Response Status Code:</label>
                <Menu compact>
                  <Dropdown
                    placeholder="Expected Status Code"
                    options={statusCodes}
                    selection
                    value={this.state.expectedResStatusCode}
                    onChange={event => {
                      this.handleDropdownChange(event, 'expectedResStatusCode');
                    }}
                  />
                </Menu>
                {/* <input placeholder="Value" /> */}
              </Form.Field>
              <label>Expected Response Body:</label>
              <input
                placeholder="Insert expected result (e.g. status: 200)"
                value={this.state.expectedResBody}
                onChange={event => {
                  this.handleChange(event, 'expectedResBody');
                }}
              />
            </Form.Field>
            <Button style={{ float: 'right' }} type="submit">
              Save Test
            </Button>
            <br />
            <br />
            <hr />
            <label>RESULTS:</label>
          </Form>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Endpoint: Test Name</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Expected Response</Table.HeaderCell>
                <Table.HeaderCell>Actual Response</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body />
          </Table>
        </Container>
      </div>
    );
  }
}

export default Demo;
