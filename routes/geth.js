var express = require('express');
var router = express.Router();
var Geth = require('../lib/gethConnect.js');
var formidable = require('formidable');

/* GET home page. */
var geth=new Geth();
router.use(function(req, res, next){
  console.log('test_use');
  next();
});
router.get('/geth', function(req, res, next) {
  //geth.setFileData("test","0x81063419f13cab5ac090cd8329d8fff9feead4a0","098f6bcd4621d373cade4e832627b4f6",1234567);
  var data = geth.getdata();
  //var data2 = geth.runContract();
  var coinbase=geth.coinbase;
  var coinbaseBlance=geth.coinbaseBlance;

  res.render('geth', { title: "Geth", coinbase:coinbase ,coinbaseBlance:coinbaseBlance});
});

router.post('/geth', function(req, res) {
  var form = new formidable.IncomingForm();
  // console.log('geth_post');
  // console.log("fileName :"+req.body.fileName);
  // console.log("address :"+req.body.address);
  // console.log("hashId :"+req.body.hashId);
  // console.log("timestamp :"+req.body.timestamp);

  var hashId = geth.setFileData(req.body.fileName, req.body.address, req.body.hashId.toLowerCase(), req.body.timestamp);
  console.log("* Write data in to blockchain(Data Hash ID :"+hashId+")")
  return res.redirect(303, '/geth');
});
module.exports = router;
