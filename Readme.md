# Anonymous Metadata Separation Cloud Storge System

## Installation
### Evironment require
- [Node.js](https://nodejs.org/en/) version v8.11.1 or higher
- [go-etheruem](https://github.com/ethereum/go-ethereum)
- Deploy a smart contract(example will update soon)

Node.js 0.8.11.1 or higher is required.
Download whole file and using command downblow to compelete installation.
```bash
$ cd ams-cloud
$ npm install
```
## Feature
- A page for upload the metadata to smart contract
- A upload page for handle upload file and comfirm signature
- A download page for check similar of file and show infomation

## Quick Start


Copy **env.js.example** and change name to **evn.js**. Then modify to fit your config :
```bash
$ cp env.js.example env.js
$ vim env.js
```

Create file store folder :
```bash
$ mkdir file-storage
```
Add **map.json** into **file-storage**
```bash
$ cd file-storage
$ vim map.json
#Write a empty object {} into map.json
```
Start server :
```bash
$ npm start
```
Connect to http://127.0.0.1:3000/downlod