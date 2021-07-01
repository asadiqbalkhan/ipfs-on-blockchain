import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
// ipfs client
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }) // leaving out the arguments will default to these values
class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      buffer: null,
      imageHash: 'QmUfedgqKVRbcuuwfQ2uEiDEfHhS882DnYXDZ7gHp5Yxsq'
    };
  }


  captureFile = (event) => {
  event.preventDefault()
  console.log('file captured...')
    // process ipfs
  const file = event.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', )
    }
    
  }
  // Example : hash: "QmUfedgqKVRbcuuwfQ2uEiDEfHhS882DnYXDZ7gHp5Yxsq"
  // Example: url: https://ipfs.infura.io/ipfs/QmUfedgqKVRbcuuwfQ2uEiDEfHhS882DnYXDZ7gHp5Yxsq
  onSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting the form')
    
    ipfs.add(this.state.buffer , (error, result) => {
      //do stuff here
      console.log('IPFS result', result)
      const imageHash = result[0].hash
      this.setState({ imageHash  })
      if(error){
        console.error(error)
        return
      }
      // Step 2 store a file on blockchain...
    })
  }

  
  render(){
  return (
      <>
        <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0"
              href='/'
              target="_blank"
              rel='noopener noreferrer'>
                NFT
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <img src={`https://ipfs.infura.io/ipfs/${this.state.imageHash}`} alt='logo' />
                <p>&nbsp;</p>
                <h2>Change Meme</h2>
                <form action="" onSubmit={this.onSubmit}>
                <input type="file" onChange={this.captureFile}/>
                <input type="submit" />
              </form>
              </div>
            </main>
          </div>
        </div>

        </div>
      </>
    );
  }
}

export default App;
