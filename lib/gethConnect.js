var Web3 = require('web3');
var Evn = require('../evn.js');
class Geth{


  constructor(){
    this.rpcUrl=Evn.contractServer.rpcUrl;
    //this.rpcUrl="http://localhost:8545";
    //this.rpcUrl="http://192.168.50.152:8545";
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl));
      /*
      var abi =[{"constant":true,"inputs":[{"name":"hashId","type":"bytes16"}],"name":"getFileWithHash","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"fileList","outputs":[{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes16"}],"name":"fileInfos","outputs":[{"name":"fileName","type":"string"},{"name":"addr","type":"address"},{"name":"hashId","type":"bytes16"},{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"fileName","type":"string"},{"name":"addr","type":"address"},{"name":"hashId","type":"bytes16"},{"name":"timestamp","type":"uint256"}],"name":"setFile","outputs":[{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

      var address ='0x251968fe2a67fb18b43835c3bcb4578cba6688b8';
      */
      var abi = Evn.mainContract.abi;
      var address = Evn.mainContract.address;
      this.contract = this.web3.eth.contract(abi).at(address);
     }
  }
  getdata(){
    if(!this.web3.isConnected()){
        throw new Error('unable to connect to ethereum node at ' + this.rpcUrl);
    }else{
        /*connect susessful*/
        console.log('connected to ehterum node at ' + this.rpcUrl);
        this.coinbase = this.web3.eth.coinbase;
        //console.log('coinbase:' + this.coinbase);

        this.coinbaseBlance = this.web3.eth.getBalance(this.coinbase);
        //console.log('balance:' + this.web3.fromWei(this.coinbaseBlance, 'ether') + " ETH");

        let accounts = this.web3.eth.accounts;
        //console.log(accounts);


    }
  }
  setFileData(fileName, address, hashId, timestamp){
    var tranobj = {
      from: "0x81063419f13cab5ac090cd8329d8fff9feead4a0",
      gas: 3000000,
      gasPrice: 10000
    };
    this.contract.setFile.sendTransaction(fileName,
                                          address,
                                          hashId,
                                          timestamp,
                                          tranobj);
    return hashId;
  }
  getFileWithHash(hashId){
    /*Call contract function and get data with hash(md5)*/
    var msg = this.contract.getFileWithHash(hashId);

    /*get data from contract and print it*/
    //console.log(this.msg[0]); //filename
    //console.log(this.msg[1]); //address
    //console.log(this.msg[2]['c'][0]); //timestamp
    return msg;
  }

  async signatureVerify(hash, sig){

    //var r = `0x${sig.slice(0,66)}`;
    var r = sig.slice(0,66);
    //console.log(r);

    var s = `0x${sig.slice(66,130)}`;
    //console.log(s);
    var v = '0x' + sig.slice(130,132);
    v = this.web3.toDecimal(v);

    if(v==1 || v==0){
      v = v+27;
    }
    //console.log(v);
    var result = await this.contract.signatureVerify.call(hash, v, r, s);
    return result;
  }

  sign(address,dataToSign){
    var result = this.web3.eth.sign(address, dataToSign);
    return result;
  }
}



module.exports = Geth;
