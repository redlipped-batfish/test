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
      testComplete: false,
      testResult: null,
      testResponse: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, name) {
    const newState = {};
    newState[name] = event.target.value;
    newState.testComplete = false;
    this.setState(newState);
    console.log(this.state);
  }

  handleDropdownChange(event, name) {
    const newState = {};
    newState[name] = event.target.textContent;
    newState.testComplete = false;
    this.setState(newState);
    console.log(this.state);
  }

  runTest(state) {
    console.log('state:', state);

    let testStatusCode = null;
    let testResponseBody = null;

    fetch(this.state.url + this.state.endpoint, {
      method: this.state.requestType,
      headers: {
        'Content-Type': this.state.contentType,
      },
      body: this.state.requestType === 'GET' ? null : this.state.requestBody,
    })
      .then(response => {
        testStatusCode = response.status;
        return response.json();
      })
      .then(body => {
        testResponseBody = body;

        if (
          testStatusCode ===
            parseInt(this.state.expectedResStatusCode.slice(0, 3)) &&
          testResponseBody === this.state.expectedResBody
        ) {
          this.setState({
            testComplete: true,
            testResult: true,
            testResponse: testResponseBody,
          });
          console.log('successful test!');
        } else {
          this.setState({
            testComplete: true,
            testResult: false,
            testResponse: testResponseBody,
          });
          console.log('test failed!');
        }
      });
  }

  render() {
    //scan the state for test state(s)
    //generate an array of divs to add to the table
    //IN THE DEMO THERE IS ONLY ONE ALLOWED TEST, SO NO ARRAYS IN STATE
    let testsArr = [];
    if (this.state.testComplete) {
      let color = null;
      let name = null;
      let result = null;
      color = this.state.testResult ? 'green' : 'red';
      name = this.state.testResult ? 'check' : 'close';
      result = this.state.testResult ? 'positive' : 'negative';
      console.log(name, color);
      testsArr.push(
        <Table.Row key={1}>
          <Table.HeaderCell>{this.state.endpoint}</Table.HeaderCell>
          <Table.HeaderCell>{this.state.requestType}</Table.HeaderCell>
          <Table.HeaderCell>{this.state.expectedResBody}</Table.HeaderCell>
          <Table.HeaderCell>{this.state.testResponse}</Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name={name} color={color} inverted circular />
          </Table.HeaderCell>
        </Table.Row>,
      );
    }

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
            <Button onClick={() => this.runTest(this.state)} type="submit">
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
            <Form.Group widths="equal">
              <Form.Select
                fluid
                label="Content-Type:"
                options={contentTypes}
                placeholder="Content-Type"
                value={this.state.contentType}
                onChange={event => {
                  this.handleDropdownChange(event, 'contentType');
                }}
              />
              <Form.Select
                fluid
                label="Request Type:"
                options={requestTypes}
                placeholder="Request Type"
                value={this.state.requestType}
                onChange={event => {
                  this.handleDropdownChange(event, 'requestType');
                }}
              />
            </Form.Group>
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
                <Form.Select
                  fluid
                  label="Expected Response Status Code:"
                  options={statusCodes}
                  placeholder="Expected Status Code"
                  value={this.state.expectedResStatusCode}
                  onChange={event => {
                    this.handleDropdownChange(event, 'expectedResStatusCode');
                  }}
                />
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
                <Table.HeaderCell />
              </Table.Row>
              {testsArr}
            </Table.Header>
            <Table.Body />
          </Table>
        </Container>
      </div>
    );
  }
}

export default Demo;
