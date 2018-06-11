var express = require('express');
var router = express.Router();
var FileMap = require('../lib/fileMap');
var evn = require('../evn');

/* GET home page. */
router.get('/file/:hashId', function(req, res, next) {
  var inputHashId = req.params.hashId.toLowerCase();
  var SeedFileName = null; //file name
  var ComapareDirPath = evn.file.fileStoragePath; //folder dir path
  //console.log(ComapareDirPath);
  (async function(){
    try{
      var fileMapping = await FileMap.init(ComapareDirPath+"/map.json");
      var fileName = fileMapping.getFileInfo(inputHashId);
      SeedFileName = ComapareDirPath +"/"+fileName;
      res.download(SeedFileName);
    }
    catch(err){
      res.send(err);
    }
  })()

});


module.exports = router;
