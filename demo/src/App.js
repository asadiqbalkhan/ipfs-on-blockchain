import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
// ipfs client
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }) // leaving out the arguments will default to these values
// ================
// INFURA SETTINGS 
// ================
// const { create } = require('ipfs-http-client')

// const projectId = '1uhgp0Dgz9Ygv2owxQQcQdO6nDN'
// const projectSecret = '3aec14ed5d6d4b2235c90a7f1654c178'
// const auth =
//   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth
//   }
// })

// ipfs.pin.add('QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn').then((res) => {
//   console.log(res)
// })



class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      buffer: null
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

  onSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting the form')
    
    ipfs.add(this.state.buffer , (error, result) => {
      //do stuff here
      console.log('IPFS result', result)
      if(error){
        console.error(error)
        return
      }
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
                <img src = '' className="logo" alt="logo"/>
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
