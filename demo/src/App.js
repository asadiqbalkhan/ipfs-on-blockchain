import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import ImageABI from './abis/Image.json'
// ipfs client
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }) // leaving out the arguments will default to these values
class App extends Component{

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  //Get the account
  //Get the network
  //Get the smart contract --> abi ImageABI.abi and address networkData.address
  //Get the image hash

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log(accounts)
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = ImageABI.networks[networkId]
    if(networkData){
      //fetch contract
      const abi = ImageABI.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      console.log(contract)

      const imageHash = await contract.methods.getImageHash().call()
      this.setState({ imageHash })
    } else {
      window.alert('Smart contract not deployed to detected network')
    }

  }

  constructor(props){
    super(props);
    this.state = {
      account: '',
      buffer: null,
      contract: null, 
      imageHash: ''
    };
  }

  async loadWeb3(){
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else {
      window.alert('Please use meta mask')
    }
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
      this.state.contract.methods.setImageHash(imageHash).send({from: this.state.account})
        .then((r) => {
          this.setState({imageHash})
        })
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
                IPFS on Blockchain
          </a>
          <div className="navbar-nav px-3"><small className="text-white">{this.state.account}</small></div>
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
