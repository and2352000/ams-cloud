var fs = require('fs');
var fileName = './map.json';
var Promise = require('bluebird');

//To create object call FileMap.init() =>  return obj FileMap
class FileMap{
  constructor(jsonObj,jsonFilePath){
    if (typeof jsonObj === 'undefined') {
      throw new Error('Cannot be called directly : use FileMap.init()');
    }
    else {
      this.jsonObj = jsonObj;
      this.jsonFilePath = jsonFilePath;
    }
  }
  static init(jsonFilePath){
    var self = this;
    this.jsonFilePath = jsonFilePath;
    return new Promise(function(resolve,reject){
      fs.readFile(self.jsonFilePath,"utf8",function (err,data) {
        if (err) reject(err);
        //console.log(JSON.parse(data));
        self.jsonObj = JSON.parse(data);
        resolve(new FileMap(self.jsonObj, jsonFilePath));
      });
    });
  }
  async addFile(hashId, fileName){

    this.jsonObj[hashId] = fileName;
    //var self = this;
    var self = this;
    var jsonStr = JSON.stringify(this.jsonObj, null, 2);
    console.log(jsonStr);

    return new Promise(function(resolve,reject){
      fs.writeFile(self.jsonFilePath, jsonStr, 'utf8', (err)=>{
        if(err){reject(err);}
        resolve('done');
      });
    });
  }
  getFileInfo(hashId){
    return this.jsonObj[hashId];
  }
  getFileListObj(){
    return this.jsonObj;
  }


}
/*****Example*****/
/*
FileMap.init(fileName.json)
.then(async(fileMapping)=>{
  await fileMapping.addFile("113213","yyyy");
  await fileMapping.addFile("123123","zzz");
  console.log(fileMapping.getFileInfo("113213"));
})
.catch(err=>console.log);
*/
module.exports = FileMap;

