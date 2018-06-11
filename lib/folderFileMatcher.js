var fs = require('fs');
var difflib = require('difflib');
var Promise = require('bluebird');
var FileMap = require('../lib/fileMap');
var evn = require('../evn');

function readFileData(uploadFileName){
  return new Promise(function(resolve,reject){
    fs.exists(uploadFileName, function (existBool) {
      if(existBool){
      	//console.log('exist');
          fs.readFile(uploadFileName,'utf8',function(err, data){
            if(!err){
              //console.log(data);
              resolve(data);
            }
            else{
              console.log("err###");
              reject(err);
            }
          });

      } else {
    	//console.log('File is not exist');
      reject(new Error("func readFileData():"+uploadFileName+" is not exist"));
      }
    });
  });
}

function fileMatcher(file_s1,file_s2){ //callback => readFileData
    s = new difflib.SequenceMatcher(null, file_s1, file_s2);
    //console.log("Simailar percentage : "+s.ratio()*100 + "%");
    return s.ratio()*100;
}


function folderFileMatcher(uploadFileName,dirPath,seedHash){
  return new Promise(function(resolve,reject){
    var fileList = [];
    fs.exists(dirPath, async function (existBool) {
      if(existBool){
          // fs.readdir(dirPath,function(err,files){
          //   if(err){ reject(err); }
          //
          //   var itemsProcessed = 0;
          //   files.forEach(
          //     (file)=>{
          //       // console.log("File Name :"+__dirname +"/"+file);
          //       Promise.all([readFileData(uploadFileName),readFileData(dirPath+"/"+file)])
          //       .then(function (res){
          //         var percentage = fileMatcher(res[0],res[1]); // percentage 100 =>100%
          //         var fileObj = {};
          //         //file obj have two params. It'will return
          //         fileObj.fileName = file;
          //         fileObj.percentage = percentage;
          //         fileList.push(fileObj);
          //         //return after forEach finish
          //         itemsProcessed++;
          //         if(itemsProcessed === files.length) {
          //           resolve(fileList);
          //         }
          //       })
          //       .catch(
          //         (err)=>{reject(err);
          //       });
          //
          //       //console.log("File Name :"+dirPath+file);
          //     });
          //
          // });

        var SeedFileName = null;
        var ComapareDirPath = evn.file.fileStoragePath; //A folder to compare with seed file

        //Search file name form map.json
        var fileMapping = await FileMap.init(ComapareDirPath+"/map.json");
        var fileListObj = fileMapping.getFileListObj();
        var keys = Object.keys(fileListObj);
        var itemsProcessed = 0;

        keys.forEach(
          function(fileHash){
            var fileName = fileMapping.getFileInfo(fileHash);
            //var filePath = ComapareDirPath+"/"+fileName;

              Promise.all([readFileData(uploadFileName),readFileData(dirPath+"/"+fileName)])
              .then(function (res){
                var percentage = fileMatcher(res[0],res[1]); // percentage 100 =>100%
                var fileObj = {};
                //file obj have two params. It'will return
                fileObj.fileName = fileName;
                fileObj.percentage = percentage;
                fileObj.hashId = fileHash;
                if(seedHash != fileHash){
                  fileList.push(fileObj);
                }
                //return after forEach finish
                itemsProcessed++;
                if(itemsProcessed === keys.length) {
                  resolve(fileList);
                }
              })
              .catch(
                (err)=>{reject(err);
              });

        });


      }
      else{
        //console.log("Folder is not exist!");
        reject(new Error("func folderFileMatcher(): "+dirPath+" is not exist!"));
      }
    });

  });
}

/**** Example *****/
/*
const FolderFileMatcher = require('./folderFileMatcher');

var SeedFileName = __dirname+'/fileSeed'; //Seed file to compare with all files in folder
var ComapareDirPath = __dirname+"/files"; //A folder to compare with seed file

folderFileMatcher(SeedFileName,ComapareDirPath)
.then((fileList)=>{
  fileList.forEach((fileObj)=>{
    console.log("File Name :"+fileObj.fileName);
    console.log("Percentage :"+fileObj.percentage+"%");
  });
})
.catch(
  (err)=>{console.log(err);}
)
*/

module.exports = folderFileMatcher;

