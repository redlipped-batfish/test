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

// TODO: take care of logout
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

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      projects: {},
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

  componentDidMount() {
    this.setState({ projects: this.props.projects });
  }

  runAllTests(state) {
    //replace the following two lines with logic that determines which project is the currently selected project
    console.log('This are the projects:', state.projects);
    const firstProject = Object.keys(state.projects)[0];
    const tests = state.projects[firstProject];

    let testStatusCode = null;
    let testResponseBody = null;

    const promiseArr = [];
    const testsArray = [];
    for (let test of tests) {
      //TODO refactor this to use Promise.all instead of this pseudo-synchronous await/fetch
      //--------------------------------------------------------------------------------
      // promiseArr.push(
      //   fetch(test.url + test.endpoint, {
      //     method: test.requestType,
      //     headers: {
      //       'Content-Type': test.contentType,
      //     },
      //     body: test.requestType === 'GET' ? null : test.requestBody,
      //   }),
      // );
      // .then(response => {
      //   testStatusCode = response.status;
      //   return response.json();
      // })
      // .then(body => {
      //   testResponseBody = body;
      //   if (
      //     testStatusCode ===
      //       parseInt(test.expectedResStatusCode.slice(0, 3)) &&
      //     testResponseBody === test.expectedResBody
      //   ) {
      //     console.log('successful test!');
      //     testsArray.push({
      //       ...test,
      //       testComplete: true,
      //       testResult: true,
      //       testResponse: testResponseBody,
      //     });
      //   } else {
      //     console.log('test failed!');
      //     testsArray.push({
      //       ...test,
      //       testComplete: true,
      //       testResult: false,
      //       testResponse: testResponseBody,
      //     });
      //   }
      // });
    }
    // Promise.all(promiseArr)
    //   .then(data => {
    //     data.forEach(element => {
    //       // element.body.json();
    //       console.log('catman heeeey', element);
    //     });
    //     return data;
    //   })

    const newState = { ...state };
    newState.firstProject = testsArray;
    // console.log('These are the results:', testsArray);
    // this.setState(newState);
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
    //TODO: for authenticated user, should iterate thru their projects and assemble a table
    //their projects should exist in the state.projects object
    let testsArr = [];
    if (this.state.testResult) {
      let color = null;
      let name = null;
      let result = null;
      let key = 1;
      for (let test of this.props.projects[1]) {
        key++;
        color = this.state.testResult ? 'green' : 'red';
        name = this.state.testResult ? 'check' : 'close';
        result = this.state.testResult ? 'positive' : 'negative';
        testsArr.push(
          <Table.Row key={key}>
            <Table.HeaderCell>{test.endpoint}</Table.HeaderCell>
            <Table.HeaderCell>{test.endpoint}</Table.HeaderCell>
            <Table.HeaderCell>{test.endpoint}</Table.HeaderCell>
            <Table.HeaderCell>{test.endpoint}</Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name={name} color={color} inverted circular />
            </Table.HeaderCell>
          </Table.Row>,
        );
      }
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
            <Button onClick={() => this.runAllTests(this.state)} type="submit">
              Run All
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

export default Dashboard;
