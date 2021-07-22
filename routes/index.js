var express = require('express');
var router = express.Router();


const { MasterNode } = require('../elements/masternode');

/* GET home page. */
router.get('/', function(req, res, next) {
  let masterNode = new MasterNode();
  let nodeInfo = masterNode.getInfo();
  let page = (nodeInfo.running ) ? "master-node" : "master-node-stopped";
  res.render('index', { viewpagename: page, data: nodeInfo});
  //res.render('index', { viewpagename: "master-node", data: {message:"hola"} });
});

module.exports = router;
