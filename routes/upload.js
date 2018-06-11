var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
const Path = require('path');
var crypto = require('crypto');
var Accounts = require('web3-eth-accounts');
var Geth = require('../lib/gethConnect.js');
var FileMap = require('../lib/fileMap');
var evn = require('../evn');

router.use(function(req, res, next){
  console.log('test_use');
  next();
});


/* GET upload page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'File Upload',status:null });
  console.log('get1');
});

router.get('/:status', function(req, res, next) {
  res.render('upload', { title: 'File Upload ',status: req.params.status });
  console.log('get2');
});

/* POST upload. */

router.post('/', function(req, res) {
  var form = new formidable.IncomingForm();
  console.log('post1');
  form.parse(req, function(err, fields, files) {
    if (err) throw err;

    console.log('received fields: ');
    console.log(fields);
    console.log('received files: ');
    console.log(files);
    console.log('received Signature: ');
    console.log(fields.signature);
    //var nowTime = new Date();
    var oldpath = files.filetoupload.path;
    var newpath = files.filetoupload.name;
    var fileNameParse=Path.parse(newpath);
    var newFileName = fileNameParse.name+"_"+Date.now()+fileNameParse.ext;
    var storageFolder = evn.file.fileStoragePath+'/';
    var newpath = storageFolder + newFileName;

    fs.readFile(oldpath, 'utf8' ,(err, data) => {
      if (err) throw err;
      //console.log(data);
      newFileHashId = md5(data).toLowerCase();
      console.log("New File's md5 : "+newFileHashId);

      var geth=new Geth();
      var fileData = geth.getFileWithHash(newFileHashId);
      var scertText = "Hello World"
      var signature=fields.signature;


      //check if sig is legal
      var re = new RegExp('^0x[0-9|a-f]{130}');
      signature = signature.match(re);
      var recoverMsg = null; //public key
      if(signature!=null){
        var accounts = new Accounts();
        recoverMsg = accounts.recover(scertText,signature[0]);
      }
      else{
        console.log('signature is illegal');
        return res.redirect(303, '/upload/illegal');
      }

      var publicOfFileOwner = fileData[1].toUpperCase();
      var publicOfFileSig = recoverMsg.toUpperCase();
      
      // console.log("File's owner :"+  publicOfFileOwner);
      // console.log("Recover msg :"+ publicOfFileSig);

      if(fileData[0]){
        console.log('File Data Exist!!!!!!');
        if(publicOfFileOwner == publicOfFileSig){
          fs.rename(oldpath, newpath, async function (err) {
            if (err) throw err;
            //Write file name in to map.json
            try{
              var fileMapping = await FileMap.init(storageFolder+"map.json");
              await fileMapping.addFile(newFileHashId,newFileName);
              console.log(fileMapping.getFileInfo(newFileHashId));
              console.log("Upload sucessful!");
              return res.redirect(303, '/upload/success');
            }
            catch(err){
              res.send("Error : Upload.js call fileMapping fail<br>msg:"+err)
            }
          });
        }
        else{
          console.log("Upload fail!");
          return res.redirect(303, '/upload/denied');
        }
      }
      else{
        return res.redirect(303, '/upload/hashIdNotFound');
      }


    });

  });
});



function md5(content){
  var md5 = crypto.createHash('md5');
  var result = md5.update(content).digest('hex');
  return result;
}
module.exports = router;
