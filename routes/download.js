var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var crypto = require('crypto');
var fs = require('fs');
const FolderFileMatcher = require('../lib/folderFileMatcher.js');
var Geth = require('../lib/gethConnect.js');
var FileMap = require('../lib/fileMap');
var evn = require('../evn');


router.get("/download",function(req,res){

  res.render('download',{status: null});

});
router.get("/download/:hashId",async function(req,res){
  var geth=new Geth();
  var inputHashId = req.params.hashId.toLowerCase();
  var fileData = geth.getFileWithHash(inputHashId);
  var simfileData = null; // Most simalar file data

/*
  var s = "Title : "+fileData[0]+"<br>"+
          "Address : "+fileData[1]+"<br>"+
          "Timestamp : "+fileData[2]['c'][0];
*/

//console.log(req.params.hashId);
  if(fileData[0]){
    console.log(fileData[0]);
    var SeedFileName = null;
    var ComapareDirPath = evn.file.fileStoragePath; //A folder to compare with seed file
    var simalarRank = {};//Max simalar file
    simalarRank.name = null;
    simalarRank.percentage = 0;
    //Search file name form map.json
    var fileMapping = await FileMap.init(ComapareDirPath+"/map.json");
    var fileName = fileMapping.getFileInfo(inputHashId);
    SeedFileName = ComapareDirPath +"/"+fileName;
    var mostSimFileHash = null;



    //Compare all file in Folder with seed file
  function folderFileMatcher2(Seed,ComPath,HashId){
      FolderFileMatcher(Seed,ComPath,HashId)
      .then((fileList)=>{
        fileList.forEach((fileObj)=>{
          var percentage = fileObj.percentage;
          var percentage = new Number(percentage);
          //Find Max simalar file
          if(!simalarRank.name){
            simalarRank.name = fileObj.fileName;
            simalarRank.percentage = percentage.valueOf();
          }
          else if(percentage.valueOf()>simalarRank.percentage){
            simalarRank.name = fileObj.fileName;
            simalarRank.percentage = percentage.valueOf();
          }

          console.log("File Name :"+fileObj.fileName);
          console.log("Percentage :"+fileObj.percentage+"%");

        });
        fs.readFile(ComapareDirPath+"/"+simalarRank.name,function(err,data){
          if(err) res.send('download read file fail!');
          mostSimFileHash = md5(data);
          simfileData = geth.getFileWithHash(mostSimFileHash);
          res.render('download',{fileName:fileData[0],
                                 address:fileData[1],
                                 hashId:req.params.hashId.toLowerCase(),
                                 timestamp:fileData[2]['c'][0],
                                 simFile : simfileData,
                                 mostSimFileHash : mostSimFileHash,
                                 percentage : simalarRank.percentage,
                                 status:"FIND"});
          //console.log(simfileData);
        });
        console.log("per :"+simalarRank.percentage);
        console.log("Rank :"+simalarRank.name);


      })
      .catch(
        (err)=>{console.log(err);}
      )
    }

    fs.stat(SeedFileName,function(err){
      if(err){
        res.render('download',{fileName:null,
                               address:null,
                               hashId:req.params.hashId.toLowerCase(),
                               timestamp:null,
                               simFile : null,
                               percentage : null,
                               status:"NONUPlOAD"});
      return;
      }
      folderFileMatcher2(SeedFileName,ComapareDirPath,inputHashId);
    });




  }
  else {
    //No file
    res.render('download',{fileName:null,
                           address:null,
                           hashId:req.params.hashId.toLowerCase(),
                           timestamp:null,
                           simFile : null,
                           percentage : null,
                           status:"NOTFIND"});
  }
});

router.post("/download",function(req,res){
  res.redirect(303,'/download/'+req.body.md5)
});

function md5(content){
  var md5 = crypto.createHash('md5');
  var result = md5.update(content,'binary').digest('hex');
  return result;
}

module.exports = router;
