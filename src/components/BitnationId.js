import React, { Component } from 'react';
import { Grid, Row, Col, Jumbotron, Image, Table, FormGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap';

class BitnationID extends Component {

  /* Initialise */
  /* ---------- */

  constructor() {
    super();
    this.state = {
      bitnationIdLoaded: false
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const bitnationIdFile = document.getElementById('bitnationIdFile').files[0];
    const reader = new FileReader();
    reader.onload = function (inputFile) {
      const parsedData = JSON.parse(inputFile.target.result);
      this.setState({bitnationIdLoaded: true, bitnationIdData: parsedData});
    }.bind(this);
    reader.readAsText(bitnationIdFile);
  }

  render() {
    let content;

    if (this.state.bitnationIdLoaded) {
      const { bitnationIdData } = this.state;
      content = (
        <Grid>
          <Row>
            <Col md={6}>
              <Image src={bitnationIdData.image} responsive thumbnail />
            </Col>
            <Col md={6}>
              <h2>{bitnationIdData.userData.name}</h2>
              <Table striped bordered condensed>
                <tbody>
                  <tr>
                    <td>Date of Birth</td><td>{bitnationIdData.userData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td>Height</td><td>{bitnationIdData.userData.height}cm</td>
                  </tr>
                  <tr>
                    <td>1st witness</td><td>{bitnationIdData.userData.witness1}</td>
                  </tr>
                  <tr>
                    <td>2nd witness</td><td>{bitnationIdData.userData.witness2}</td>
                  </tr>
                </tbody>
              </Table>
              </Col>
            </Row>
          </Grid>
      );
    } else {
      content = (
        <form onSubmit={this.onSubmit.bind(this)}>
        <FormGroup controlId="bitnationIdFile">
        <ControlLabel>Upload your BITNATION ID</ControlLabel>
        <FormControl type="file" required />
        <HelpBlock>All ID's are named bitnation-id.json</HelpBlock>
        </FormGroup>
        <Button bsSize="large" bsStyle="primary" type="submit">
        Submit
        </Button>
        </form>
      );
    }

    return (
      <Grid>
        <Jumbotron className="bitnation-id">
          <h1>BITNATION ID</h1>
          <hr />
          {content}
      </Jumbotron>
      </Grid>
    );
  }
}

BitnationID.propTypes = {
  //saveData: React.PropTypes.func.isRequired
};

export default BitnationID;
