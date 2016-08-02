import React, { Component } from 'react';
import { Grid, Row, Col, Panel, Jumbotron, Image, Table, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Modal } from 'react-bootstrap';
import secretkeyEncryption from 'secretkey-encryption';
import tweetnaclUtil from 'tweetnacl-util';

class BitnationID extends Component {

  /* Initialise */
  /* ---------- */

  constructor() {
    super();
    this.state = {
      bitnationIdLoaded: false,
      showModal: false,
      password: '',
      secretKey: null
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const bitnationIdFile = document.getElementById('bitnationIdFile').files[0];
    const reader = new FileReader();
    reader.onload = function (inputFile) {
      const parsedData = JSON.parse(inputFile.target.result);
      this.setState({ bitnationIdLoaded: true, bitnationIdData: parsedData });
    }.bind(this);
    reader.readAsText(bitnationIdFile);
  }

  revealModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  decryptEncryptedSecretKey(e) {
    e.preventDefault();
    this.setState({ showModal: false });
    const base64cryptoData = this.state.bitnationIdData.crypto;
    const cryptoDataAsArrays = {
      encryptedSecretKey: tweetnaclUtil.decodeBase64(base64cryptoData.encryptedSecretKey),
      salt: tweetnaclUtil.decodeBase64(base64cryptoData.salt),
      nonce: tweetnaclUtil.decodeBase64(base64cryptoData.nonce),
      logN: base64cryptoData.logN,
      blockSize: base64cryptoData.blockSize
    };

    secretkeyEncryption.decryptEncryptedSecretKey(this.state.password, cryptoDataAsArrays)
    .then((secretKey) => {
      this.setState({ secretKey: tweetnaclUtil.encodeBase64(secretKey) });
    })
    .catch((error) => {
      alert(`error: ${error}`);
      console.log(`error: ${error}`);
    });

    console.log(this.state.password);
  }

  render() {
    let content;

    if (this.state.bitnationIdLoaded) {
      const { bitnationIdData, secretKey } = this.state;
      const cryptoData = [
        { name: 'Salt', value: bitnationIdData.crypto.salt },
        { name: 'nonce', value: bitnationIdData.crypto.nonce },
        { name: 'logN', value: bitnationIdData.crypto.logN },
        { name: 'blockSize', value: bitnationIdData.crypto.blockSize }
      ];

      let decryptKeyMessage;
      if (secretKey) {
        cryptoData.push({ name: 'Secret Key', value: secretKey });
      } else {
        cryptoData.push({ name: 'Encrypted secret key', value: bitnationIdData.crypto.encryptedSecretKey });
        decryptKeyMessage = <a href="#" onClick={this.revealModal.bind(this)}>Decrypt your secret key now</a>;
      }
      content = (
        <Grid>
          <Row>
            <Col md={6}>
              <Image src={bitnationIdData.image} responsive thumbnail />
            </Col>
            <Col md={6}>
              <h2>{bitnationIdData.userData.name}</h2>
              <p>You were born <strong>{bitnationIdData.userData.dateOfBirth}</strong> and your height is <strong>{bitnationIdData.userData.height}cm</strong>.</p>
              <p>The two people that witnessed the creation of your ID are <strong>{bitnationIdData.userData.witness1}</strong> and <strong>{bitnationIdData.userData.witness2}</strong>.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h3>The cryptographic parts of your ID</h3>
              <p>Firstly you have a unique public key people can use to verify your signature.</p>
              <Panel header="Your public key">
                {bitnationIdData.crypto.publicKey}
              </Panel>
              <p>Your secret key is encrypted. These are the fields we need to decrypt it together with your password. {decryptKeyMessage}</p>
              <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                <Modal.Header closeButton>
                  <Modal.Title>Decrypt Your Encrypted Secret Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.decryptEncryptedSecretKey.bind(this)}>
                    <FormGroup>
                      <FormControl
                        autoFocus
                        type="password"
                        value={this.state.password}
                        placeholder="Enter your password"
                        onChange={this.handlePasswordChange.bind(this)}
                      />
                    </FormGroup>
                    <Button bsStyle="primary" type="submit">
                      Decrypt Now
                    </Button>
                  </form>
                </Modal.Body>
              </Modal>
              <Table striped bordered condensed>
                <tbody>
                  {cryptoData.map((data) =>
                    <tr key={data.name}>
                      <td>{data.name}</td><td>{data.value}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <h3>Your ID is stamped to the Horizon blockchain</h3>
              <p>On the creation of your ID, your userdata was signed. That signature together with your public key was written to the Horizon blockchain.</p>
              <Panel header="Your Horizon Transaction Number">
                {bitnationIdData.hztx}
              </Panel>
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
          <h1>BITNATION ID<br /><small>The human readable version</small></h1>
          <hr />
          {content}
          <hr />
          <p>App created by the team at <a href="http://www.bitnation.co">BITNATION</a>.</p>
        </Jumbotron>
      </Grid>
    );
  }
}

export default BitnationID;
